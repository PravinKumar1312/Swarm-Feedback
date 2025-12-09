# Walkthrough - Swarm Feedback MVP

## Overview
This walkthrough demonstrates the complete functionality of the Swarm Feedback MVP, covering all three user roles: Submitter, Reviewer, and Admin.

## Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`

## User Flows

### 1. Authentication
1.  Open the application at `http://localhost:5173`.
2.  **Register** a new user or **Login** with existing credentials.
3.  Upon login, you are redirected to the Dashboard tailored to your roles.
4.  **Profile Management**:
    - Click on your **Username** in the header to access your Profile.
    - View your details (Email, Roles).
    - Click **Edit Profile** to update your Display Name and Bio.

### 2. Submitter Flow (Project Owner)
1.  **Home Dashboard**:
    - Upon login, you land on the **Home** page.
    - View quick stats (Total Projects, Feedback) and Recent Activity.
2.  **Submit a Project**:
    - Click **Submit Project** in the sidebar.
    - Fill out the form and click **Submit**.
    - You are automatically redirected to the History page.
3.  **View History**:
    - Click **History** in the sidebar.
    - Toggle between **My Projects** and **Received Feedback** tabs.
    - Check the status of your submissions.
4.  **Profile**:
    - Click **Profile** in the sidebar to view or edit your details.

### 3. Reviewer Flow
1.  **Find Projects**:
    - On the Dashboard, look at "Recent Projects".
    - Only **APPROVED** projects are visible for review.
2.  **Give Feedback**:
    - Click **Review** on a project card.
    - The "Give Feedback" form will appear at the top.
    - Enter a Rating (1-5) and Comments.
    - Click **Submit Feedback**.

### 4. Admin Flow
1.  **Access Admin Dashboard**:
    - Log in as an Admin user.
    - The main view is the **Admin Dashboard**.
2.  **Manage Projects**:
    - Click **Manage Projects** tab.
    - View all submissions (including PENDING).
    - Click **Approve** or **Reject** to change status.
3.  **Manage Feedback**:
    - Click **Manage Feedback** tab.
    - View all feedback submitted by reviewers.
    - Click **Edit** to modify content or rating if necessary.

## Verification
The system has been manually verified to ensure all roles function as expected and data is persisted correctly in the H2 database.
