# Swarm Feedback - Project Report

**Date:** 2025-11-27
**Version:** 1.0.0 (MVP)

## 1. Project Overview
**Swarm Feedback** is a web application designed to facilitate project submissions and peer feedback. It allows users to submit their projects (e.g., GitHub links, descriptions) and receive constructive feedback and ratings from other users (reviewers).

## 2. Architecture & Technology Stack

### Backend
*   **Framework:** Spring Boot 3.2.5 (Java 17)
*   **Database:** MongoDB (Running locally or embedded for dev)
*   **Security:** Spring Security with JWT (JSON Web Tokens) for authentication.
*   **Build Tool:** Maven
*   **Port:** 8081

### Frontend
*   **Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS v4
*   **State Management:** React Context API (AuthContext)
*   **HTTP Client:** Axios
*   **Icons:** Lucide React
*   **Animations:** Framer Motion
*   **Port:** 5173

## 3. Features Implemented

### Authentication
*   **User Registration:** Users can sign up as "Submitter" or "Reviewer".
*   **Login:** Secure login with JWT issuance.
*   **Role-Based Access:** UI adapts based on user roles.

### Project Submission
*   **Create Submission:** Submitters can post new projects with titles, descriptions, and tags.
*   **View Submissions:** A dashboard displays all active project submissions.

### Feedback System
*   **Submit Feedback:** Users can rate projects (1-5 stars) and leave detailed comments.
*   **View Feedback:** Feedback is aggregated and displayed for each project.

## 4. Setup & Execution

### Prerequisites
*   Java 17+
*   Node.js v18+
*   Maven (wrapper included)

### Running the Application

**1. Start the Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
*Server runs on: http://localhost:8081*

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*Client runs on: http://localhost:5173*

## 5. Testing & Quality Assurance
*   **Backend Tests:** Automated Unit/Integration tests executed via `mvn test`. Result: **PASS**.
*   **Frontend Linting:** Static analysis via ESLint. Result: **PASS** (0 errors).
*   **Manual Verification:** "Happy Path" walkthrough verified (Registration -> Login -> Submit -> Feedback).

## 6. Current Status
- **Backend:** Running on port `8081`. Connected to MongoDB.
- **Frontend:** Running on port `5173`.
- **Authentication:** Fully functional (JWT fixed).
- **User Roles:** Admin, Submitter, Reviewer roles implemented and visible on dashboard.
- **Testing:** Unit tests passed. Manual end-to-end verification successful.

## 7. Visual Evidence & Recordings
The following assets verify the application's functionality:

### Screenshots
1.  **Login Page:** `login_page_loaded_1764250852176.png` - Confirms the frontend loads and routes correctly.
2.  **Admin Dashboard:** `sysadmin_dashboard_final_success_1764252820374.png` - Confirms successful login, role retrieval, and dashboard rendering.
3.  **Standard User Dashboard:** `new_user_dashboard_success_1764253153983.png` - Confirms successful registration and login for a new user.

### Video Recordings
1.  **App Loading Check:** `check_app_state_1764250840449.webp`
2.  **Registration Flow:** `short_demo_register_login_1764251015590.webp`
3.  **SysAdmin Login Success:** `sysadmin_login_success_1764252787572.webp`
4.  **New User Registration & Login:** `retry_new_user_flow_1764253107743.webp`


## 8. Troubleshooting
A detailed log of issues encountered (including the JWT decoding error) and their resolutions can be found in `docs/troubleshooting_log.md`.
