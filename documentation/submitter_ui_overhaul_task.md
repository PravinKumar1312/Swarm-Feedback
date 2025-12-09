# Submitter UI Overhaul Task List

## Overview
Restructure the Submitter (User Account) interface to use a Hamburger Menu navigation with four distinct sections.

## 1. Navigation & Layout
- [x] **Hamburger Menu Component**
    - [x] Create a responsive Hamburger Menu / Sidebar.
    - [x] Implement navigation links: Home, Submit Project, History, Profile.
- [x] **Main Layout**
    - [x] Create a persistent layout wrapper containing the Menu.
    - [ ] Update `App.jsx` to use nested routes or layout structure.

## 2. Section 1: Home / Welcome
- [x] **Welcome Area**
    - [x] Display "Welcome [Username]" message.
- [x] **Recent Activity**
    - [x] Fetch and display recent notifications or messages (e.g., "Your project X received feedback").
    - [x] Display quick stats (Total Submissions, Total Feedback Received).

## 3. Section 2: Project Submission
- [x] **Submission Page**
    - [x] Move `SubmissionForm` to a dedicated route/view.
    - [x] Ensure it redirects to History or shows success upon submission.

## 4. Section 3: History (My Projects & Feedback)
- [x] **History View**
    - [x] Display list of submitted projects (using `SubmissionList`).
    - [x] **Enhancement**: Show recent feedback summaries directly on the project cards or in a collapsible section.
    - [x] Ensure status (Approved/Pending) is clearly visible.

## 5. Section 4: User Profile
- [x] **Profile Integration**
    - [x] Link the existing `Profile` component to the "Profile" menu item.
    - [x] Ensure consistent styling with the new layout.

## 6. Cleanup
- [x] Refactor `Dashboard.jsx` to remove monolithic role-based rendering if necessary, or split into role-specific dashboards.
