from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import requests
import psycopg2  # <-- dùng psycopg2 thay cho mysql.connector

# Config
API_KEY = "c7c9b5c93d52cf6d6d0204e1e58df0de"  # Thay bằng API key thật
CITY = "Ho Chi Minh"
DB_CONFIG = {
    'host': 'postgres',      # container name của postgres trong docker-compose
    'user': 'airflow',       # user Postgres
    'password': 'airflow',   # password Postgres
    'dbname': 'weatherdb',   # database name
    'port': 5432
}

# Extract
def extract_data():
    url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

# Transform
def transform_data(ti):
    raw_data = ti.xcom_pull(task_ids="extract")
    temperature_c = raw_data['main']['temp']
    humidity = raw_data['main']['humidity']
    dt = datetime.utcfromtimestamp(raw_data['dt'])
    return {"city": CITY, "temperature": temperature_c, "humidity": humidity, "datetime": dt}

# Load
def load_data(ti):
    data = ti.xcom_pull(task_ids="transform")
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        sql = """
        INSERT INTO weather_data (city, temperature, humidity, datetime)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (data["city"], data["temperature"], data["humidity"], data["datetime"]))
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
    schedule_interval=timedelta(hours=1),
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
