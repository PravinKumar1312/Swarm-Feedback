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

## Quality Assurance & Testing
**Date:** 2025-11-27

### Objective
Rectify all warnings and perform automated testing.

### Steps Taken
1.  **Backend**:
    - Ran `mvn -B test` successfully.
    - Verified no compilation warnings.
2.  **Frontend**:
    - Installed `eslint-plugin-react` to fix linting configuration.
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

## Quality Assurance & Testing
**Date:** 2025-11-27

### Objective
Rectify all warnings and perform automated testing.

### Steps Taken
1.  **Backend**:
    - Ran `mvn -B test` successfully.
    - Verified no compilation warnings.
2.  **Frontend**:
    - Installed `eslint-plugin-react` to fix linting configuration.
    - Fixed `motion` unused variable errors.
    - Fixed `setState` concurrency issue in `AuthContext`.
    - Fixed unescaped characters in JSX.
    - Achieved 0 linting errors.
3.  **Documentation**:
    - Created `docs/test_report.md` with detailed results.
### 5. Port Configuration
- **Backend Port:** Changed from `8080` to `8081` in `application.properties` to avoid conflicts.
- **Frontend API URL:** Updated `frontend/src/services/api.js` to point to `http://localhost:8081/api`.

### 6. Troubleshooting & Fixes
- **Frontend Blank Page:** Fixed by wrapping `App` in `BrowserRouter` in `main.jsx`.
- **Authentication Failure:**
    - **Symptom:** "Failed to login" error for all users.
    - **Cause:** `io.jsonwebtoken.io.DecodingException: Illegal base64 character: '_'`. The default JWT secret was not a valid Base64 string.
    - **Fix:** Updated `jwt.secret` in `application.properties` with a valid Base64 encoded string.
    - **Verification:** Successfully logged in as `sysadmin`. Dashboard loads correctly with role badges.
    - **See:** `docs/troubleshooting_log.md` for full details.

### 7. Visual Verification
- **Login Page Load:** Verified (Screenshot: `login_page_loaded_1764250852176.png`)
- **SysAdmin Dashboard:** Verified (Screenshot: `sysadmin_dashboard_final_success_1764252820374.png`)
