# Swarm Feedback MVP

A simple feedback management system built with **Spring Boot** (Backend) and **React + Tailwind CSS** (Frontend).

## Features
- **Submit Feedback**: Users can submit text-based feedback.
- **View Feedback**: Real-time list of submitted feedback with timestamps.
- **REST API**: Backend exposes endpoints for feedback management.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.x, H2 Database (In-memory), Spring Data JPA.
- **Frontend**: React 18, Vite, Tailwind CSS v4.

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+

### Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server will start on `http://localhost:8080`.

### Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## API Endpoints
- `POST /api/feedback`: Submit new feedback.
- `GET /api/feedback`: Retrieve all feedback.

## License
MIT