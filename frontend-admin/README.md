# Hair Salon Admin Frontend

## Overview
This is the administrative dashboard for the Hair Salon Management System. It allows staff to manage appointments, customers, services, and view reports.

## Tech Stack
-   **Framework:** Next.js 16 (App Router)
-   **React:** React 19
-   **UI Library:** Material UI (v6)
-   **Icons:** MUI Icons + Lucide React

## Local Development Configuration
**Port:** 3000 (Mapped to 3001 in Docker Compose)

### 1. Prerequisites
-   Node.js 20+
-   npm

### 2. Installation
Due to peer dependency conflicts between Next.js 16 and Material UI, you must use the `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```
The application will be available at: [http://localhost:3000](http://localhost:3000)

## Docker Setup
Build and run using Docker Compose from the root directory:
```bash
docker-compose up --build
```
In Docker Compose, this service is accessible at [http://localhost:3001](http://localhost:3001).

## Key Features
-   **Auth:** Login, Register, Forgot Password
-   **Dashboard:** Responsive Sidebar (MUI Drawer)
-   **Routing:** `/dashboard/*` for protected routes
