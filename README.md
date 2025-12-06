# Hair Salon Management System

## 🌟 Overview
A comprehensive full-stack solution for managing a hair salon. The system consists of three main components:
1.  **Backend API**: Spring Boot 3 application handling business logic, data persistence, and security.
2.  **Customer App**: Next.js (App Router) application for customers to book appointments and view services.
3.  **Admin Dashboard**: Next.js (App Router) application for staff/owners to manage the salon.

## 🏗 System Architecture

### Tech Stack
*   **Backend**: Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, Lombok.
*   **Database**: PostgreSQL 15.
*   **Frontend**: Next.js 14, TypeScript, TailwindCSS, Shadcn/UI, Axios.
*   **Infrastructure**: Docker, Docker Compose.

### Directory Structure
```
hair-salon-system/
├── backend/                 # Spring Boot Backend
│   ├── src/                 # Source code
│   └── Dockerfile
├── frontend-customer/       # Customer Web App
│   ├── app/                 # Next.js App Router pages
│   └── Dockerfile
├── frontend-admin/          # Admin Dashboard Web App
│   ├── app/                 # Next.js App Router pages
│   └── Dockerfile
├── docker-compose.yml       # Orchestration for local dev
└── render.yaml              # Deployment config for Render.com
```

## 🚀 Setup & Run (Local Development)

### Prerequisites
*   Docker Desktop installed and running.

### Installation
1.  Clone the repository.
2.  Run the following command in the root directory:
    ```bash
    docker-compose up --build
    ```
    This will build the images for backend, both frontends, and start the database.

### Access Points
*   **Backend API**: [http://localhost:8080](http://localhost:8080)
*   **Swagger API Docs**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
*   **Customer App**: [http://localhost:3000](http://localhost:3000)
*   **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)

## 📚 API Documentation (Swagger)
The backend automatically generates API documentation using **SpringDoc OpenAPI**.
Once the application is running, access the full interactive documentation at:
**[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

### Key Endpoints
*   **Auth**: `/api/auth/signin`, `/api/auth/signup`
*   **Services**: `/api/services` (GET public, POST/PUT/DELETE admin)
*   **Appointments**: `/api/appointments` (Booking flow)
*   **Payments**: `/api/payments`

## 🗄 Database Schema (ERD)
*   **Users**: Stores Customers, Staff, and Admins.
*   **Services**: Catalog of haircut services.
*   **Appointments**: Links User (Customer), User (Staff), and Service. Contains status.
*   **Payments**: Links to Appointment. Tracks transaction status.

## 🔒 Security
*   **JWT**: Stateless authentication.
*   **Roles**: `CUSTOMER`, `STAFF`, `ADMIN` roles enforced via `@PreAuthorize`.
*   **CORS**: Configured to allow frontend origins.

## ☁️ Deployment
The project is configured for **Render.com**.
1.  Connect your repo to Render.
2.  Select "New Blueprint Instance".
3.  Deploy using `render.yaml`.
