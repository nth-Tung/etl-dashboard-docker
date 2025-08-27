-- Tạo database weatherdb
CREATE DATABASE weatherdb;

CREATE DATABASE superset OWNER airflow;

\connect weatherdb;

CREATE TABLE IF NOT EXISTS weather_data (
  id SERIAL PRIMARY KEY,
  city VARCHAR(50),
  temperature REAL,
  temp_min REAL,
  temp_max REAL,
  humidity INT,
  pressure INT,
  wind_speed REAL,
  weather_desc VARCHAR(100),
  weather_icon VARCHAR(10),
  datetime TIMESTAMP
);
