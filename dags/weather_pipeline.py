from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta, timezone
import requests
import psycopg2
import zoneinfo

# Config
API_KEY = "your_openweather_api_key"

CITIES = [
    {"name": "Ha Noi", "lat": 21.0285, "lon": 105.8542},
    {"name": "Ho Chi Minh", "lat": 10.7769, "lon": 106.7009},
    {"name": "Da Nang", "lat": 16.0471, "lon": 108.2068},
    {"name": "Hai Phong", "lat": 20.8449, "lon": 106.6881},
    {"name": "Can Tho", "lat": 10.0452, "lon": 105.7469},
    {"name": "Nha Trang", "lat": 12.2388, "lon": 109.1967},
    {"name": "Hue", "lat": 16.4637, "lon": 107.5909},
    {"name": "Vung Tau", "lat": 10.3460, "lon": 107.0843},
    {"name": "Bien Hoa", "lat": 10.9634, "lon": 106.8227},
    {"name": "Buon Ma Thuot", "lat": 12.6667, "lon": 108.0378}
]
DB_CONFIG = {
    'host': 'postgres',      # container name
    'user': 'airflow',       # user Postgres
    'password': 'airflow',   # password Postgres
    'dbname': 'weatherdb',   # database name
    'port': 5432
}

# Extract
def extract_data():
    results = {}
    for city in CITIES:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={city['lat']}&lon={city['lon']}&appid={API_KEY}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        results[city['name']] = response.json()
    return results

# Transform
def transform_data(ti):
    raw_data = ti.xcom_pull(task_ids="extract")
    transformed = []
    vn_tz = zoneinfo.ZoneInfo("Asia/Ho_Chi_Minh")
    for city, data in raw_data.items():
        temperature_c = data['main']['temp']
        temp_min = data['main'].get('temp_min')
        temp_max = data['main'].get('temp_max')
        humidity = data['main']['humidity']
        pressure = data['main'].get('pressure')
        wind_speed = data.get('wind', {}).get('speed')
        weather_desc = data.get('weather', [{}])[0].get('description')
        weather_icon = data.get('weather', [{}])[0].get('icon')
        dt_utc = datetime.utcfromtimestamp(data['dt'])
        dt_vn = dt_utc.replace(tzinfo=timezone.utc).astimezone(vn_tz)
        transformed.append({
            "city": city,
            "temperature": temperature_c,
            "temp_min": temp_min,
            "temp_max": temp_max,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": wind_speed,
            "weather_desc": weather_desc,
            "weather_icon": weather_icon,
            "datetime": dt_vn
        })
    return transformed

# Load
def load_data(ti):
    data_list = ti.xcom_pull(task_ids="transform")
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = """
        INSERT INTO weather_data (
            city, temperature, temp_min, temp_max, humidity, pressure, wind_speed, weather_desc, weather_icon, datetime
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        for data in data_list:
            cursor.execute(sql, (
                data["city"], data["temperature"], data["temp_min"], data["temp_max"],
                data["humidity"], data["pressure"], data["wind_speed"],
                data["weather_desc"], data["weather_icon"], data["datetime"]
            ))
        conn.commit()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# DAG
default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=1),
}


with DAG(
    "weather_pipeline_postgres",
    default_args=default_args,
    description="ETL weather data from OpenWeather API to Postgres",
    schedule_interval=timedelta(minutes=1),
    start_date=datetime(2025, 8, 25),
    catchup=False,
) as dag:

    extract = PythonOperator(
        task_id="extract",
        python_callable=extract_data,
    )

    transform = PythonOperator(
        task_id="transform",
        python_callable=transform_data,
    )

    load = PythonOperator(
        task_id="load",
        python_callable=load_data,
    )

    extract >> transform >> load
