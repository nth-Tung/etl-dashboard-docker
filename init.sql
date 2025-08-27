-- Tạo database weatherdb
CREATE DATABASE weatherdb;

CREATE DATABASE metabase OWNER airflow;

\connect weatherdb;

CREATE TABLE IF NOT EXISTS weather_data (
  id SERIAL PRIMARY KEY,
  city VARCHAR(50),
  temperature REAL,
  humidity INT,
  datetime TIMESTAMP
);
