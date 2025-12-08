# Hair Salon Backend

## Overview
This is the REST API for the Hair Salon Management System, built with Spring Boot. It handles data persistence, business logic, and security.

## Tech Stack
-   **Framework:** Spring Boot 3
-   **Java:** JDK 17
-   **Build Tool:** Maven
-   **Database:** PostgreSQL

## Local Development

### 1. Prerequisites
-   JDK 17
-   Maven
-   PostgreSQL (running locally or via Docker)

### 2. Configuration
Ensure your `src/main/resources/application.yml` points to your database.
Default configuration:
-   **URL:** `jdbc:postgresql://localhost:5432/hairsalon`
-   **User:** `postgres`
-   **Password:** `password`

### 3. Running Locally
Run the application using Maven:
```bash
mvn spring-boot:run
```
The API will be available at: [http://localhost:8080](http://localhost:8080)

## Docker Setup
The Dockerfile uses a multi-stage build (Maven compile -> JRE run).
```bash
docker-compose up --build
```
The backend depends on the `db` service in Docker Compose.
