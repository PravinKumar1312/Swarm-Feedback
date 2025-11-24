# Development Log - Swarm Feedback MVP

## Project Bootstrap
**Date:** 2025-11-24

### Objective
Initialize project structure, backend, and frontend.

### Steps Taken
1.  **Environment Check**:
    - Java: 17.0.12
    - Node: v23.11.0
    - npm: 11.5.2
    - Maven: Not found in PATH (Will use `mvnw` from generated project).
2.  **Backend Initialization**:
    - Generated Spring Boot project (Web, JPA, H2, Lombok) using `curl`.
    - Extracted to `backend/`.
    - Verified `mvnw` and `pom.xml`.
3.  **Frontend Initialization**:
    - Created React project using `npx create-vite frontend --template react`.
    - Installed dependencies (`npm install`).
    - Configured Tailwind CSS (manually created config files due to npx issues).
    - **Fix**: Updated to Tailwind CSS v4 configuration (installed `@tailwindcss/postcss`, updated `postcss.config.js` and `index.css`).
    - Verified `package.json` and directory structure.

## Backend Development
**Date:** 2025-11-24

### Objective
Implement core backend logic (Entity, Repository, Service, Controller).

### Steps Taken
1.  **Database Configuration**:
    - Configured H2 in-memory database in `application.properties`.
    - Enabled H2 console.
2.  **Domain Layer**:
    - Created `Feedback` entity with `id`, `content`, and `createdAt`.
    - Created `FeedbackRepository` extending `JpaRepository`.
3.  **Service Layer**:
    - Created `FeedbackService` to handle business logic.
4.  **API Layer**:
    - Created `FeedbackController` with `POST` and `GET` endpoints.
    - Enabled CORS for `http://localhost:5173`.
5.  **Verification**:
    - Running `./mvnw test` to verify context loads.
