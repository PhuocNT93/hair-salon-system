# Hair Salon Customer Frontend

## Overview
This is the customer-facing application for the Hair Salon Management System. It allows users to browse services, book appointments, and view stylists.

## Tech Stack
-   **Framework:** Next.js 16 (App Router)
-   **React:** React 19
-   **UI Library:** Material UI (v6)
-   **Styling:** CSS Modules / Emotion

## Local Development Configuration
**Port:** 3002 (Configured in package.json and Dockerfile)

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
The application will be available at: [http://localhost:3002](http://localhost:3002)

## Docker Setup
Build and run using Docker Compose from the root directory:
```bash
docker-compose up --build
```
This service maps port `3002` to container port `3002`.

## Project Structure
-   `/app`: Next.js App Router pages
-   `/components/layout`: Navbar, Footer
-   `/components/ThemeRegistry`: Material UI Theme configuration
