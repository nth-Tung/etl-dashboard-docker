CREATE DATABASE IF NOT EXISTS weatherdb;
USE weatherdb;

CREATE TABLE IF NOT EXISTS weather_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(50),
  temperature FLOAT,
  humidity INT,
  datetime DATETIME
);
