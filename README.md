# ETL Dashboard with Airflow, MySQL/Postgres, and Metabase/Superset Apache

This project provides a local ETL and analytics environment using **Apache Airflow**, **MySQL/Postgres**, and **Metabase/Superset Apache**, containerized with Docker and orchestrated with Docker Compose.

## Features

- Airflow for workflow orchestration (LocalExecutor)
- MySQL as metadata and workflow database
- Metabase for visualization and dashboards
- Custom DAGs, plugins, and logs support
- Easy Docker Compose setup

## Prerequisites

- Docker ≥ 20.x  
- Docker Compose ≥ 2.x  
- Linux/macOS environment (adjust paths and permissions if using Windows)

## Setup and Run

### 1. Build Airflow Docker image

```bash
docker build -t extending_airflow .
```

This includes any additional Python packages or customizations.

### 2. Create `.env` file in the project root

```bash
AIRFLOW_UID=1000
AIRFLOW_GID=0
_AIRFLOW_WWW_USER_USERNAME=airflow
_AIRFLOW_WWW_USER_PASSWORD=airflow
```

> Note: GID must be 0 to comply with Airflow Docker image requirements.

### 3. Initialize Airflow database and admin user

```bash
docker compose up airflow-init
```

This prepares DAGs, plugins, and logs directories.

### 4. Start all services

```bash
docker compose up -d
```

Services started:

- **airflow-webserver** → http://localhost:8080
- **airflow-scheduler** → manages DAG scheduling
- **mysql** → Airflow database
- **metabase** → dashboard UI at http://localhost:3000

### 5. Access credentials

- **Airflow Web UI**: `.env` username/password
- **Metabase**: data stored in Docker volume `metabase`

## Volumes and directories

| Host Path / Volume | Purpose                  |
|------------------|-------------------------|
| ./dags            | Airflow DAGs            |
| ./logs            | Airflow logs            |
| ./plugins         | Airflow plugins         |
| mysql_data volume | MySQL database          |
| metabase volume   | Metabase data           |

## Stopping and cleaning

```bash
docker compose down
docker compose down -v   # remove volumes if needed
```

> Make sure UID/GID in `.env` matches host permissions to avoid errors with mounted volumes. Place custom DAGs in `./dags` before starting Airflow. Metabase can connect to MySQL or other external data sources if needed.
