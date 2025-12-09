# Swarm Feedback Application Documentation

## Overview
Swarm Feedback is a platform for submitting projects and receiving feedback from reviewers. It features role-based access control (Submitter, Reviewer, Admin), project submission with file attachments, and a feedback system.

## Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Spring Boot, Spring Security (JWT), MongoDB
- **Database**: MongoDB

## Features
- **User Authentication**: JWT-based login/signup with role selection.
- **Roles**:
  - **Submitter**: Can submit projects and view their history.
  - **Reviewer**: Can view submissions and provide feedback.
  - **Admin**: Can manage submissions and users.
- **Project Submission**: Submit title, description, and links/files.
- **Feedback System**: Reviewers can rate and comment on projects.
- **Profile Management**: Users can update their profile details.
- **Password Recovery**: Forgot password flow via email (simulated in dev).

## Setup & Run

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (running locally on port 27017)

### Backend
1. Navigate to `backend` directory.
2. Run `mvnw spring-boot:run` (Windows) or `./mvnw spring-boot:run` (Linux/Mac).
3. Server starts on `http://localhost:8082`.

### Frontend
1. Navigate to `frontend` directory.
2. Run `npm install` (first time).
3. Run `npm run dev`.
4. App runs on `http://localhost:5173`.

## Troubleshooting
- **Login Failed**: Ensure MongoDB is running and the backend is connected. Check backend logs for errors.
- **Email Not Sent**: Configure `spring.mail` properties in `application.properties` with valid SMTP credentials.

## API Endpoints
- `POST /api/auth/signin`: Login
- `POST /api/auth/signup`: Register
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/submissions`: Create submission
- `GET /api/submissions`: Get all submissions (filtered by role)

## Clean Install Demo
A video demonstrating the registration and login flow for new users (Submitter and Reviewer) with no default accounts is available here:
[Clean Install Demo Video](./clean_install_demo.webp)

## Recent Fixes
- **Clean State**: Removed default user creation from `DataInitializer`. The system now starts with no users, requiring registration.
- **Login Issues**: Resolved by fixing CORS configuration in `WebSecurityConfig` and removing conflicting `@CrossOrigin` annotation in `AuthController`.
- **Database Initialization**: Ensured the database is not automatically seeded with default accounts, adhering to the "no default account" policy.
