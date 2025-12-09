# Swarm Feedback MVP Task List

## 1. Project Bootstrap & Backend Foundation
- [x] **Project Setup**
    - [x] Create project directories
    - [x] Initialize Spring Boot Backend
    - [x] Initialize React Frontend
    - [x] Setup Tailwind CSS
- [x] **Backend Core**
    - [x] Setup Database (H2/PostgreSQL)
    - [x] Create User Entity & Auth Repository
    - [x] Create Submission Entity & Repository
    - [x] Create Feedback Entity & Repository

## 4. Admin UI
- [x] **Dashboard Integration**
    - [x] Dedicated `AdminDashboard` component
- [x] **Submission Management**
    - [x] View all submissions
    - [x] Approve/Reject submissions
- [x] **Feedback Management**
    - [x] View all feedback
    - [x] Edit feedback content/rating
- [x] **User Management**
    - [x] View user details (Owner ID, Reviewer ID) in lists

## 5. Verification & Polish
- [x] **End-to-End Testing**
    - [x] Verify Submitter flow (Login -> Submit -> View)
    - [x] Verify Reviewer flow (Login -> View Projects -> Give Feedback)
    - [x] Verify Admin flow (Login -> Approve/Reject -> Edit Feedback)
- [x] **Documentation**
    - [x] Update `README.md`
    - [x] Update `.gitignore`
## 6. Phase 3: Submitter UI Overhaul
- [x] **Navigation & Layout**
    - [x] Implement responsive Sidebar/Hamburger Menu
    - [x] Create `MainLayout` wrapper
- [x] **Pages Implementation**
    - [x] **Home**: Welcome dashboard with stats and recent activity
    - [x] **Submit Project**: Dedicated submission page with redirect
    - [x] **History**: Tabbed view for Projects and Feedback
    - [x] **Profile**: Integrated into new layout
- [x] **Routing**
    - [x] Update `App.jsx` with nested routes
    - [x] Implement role-based redirection (`DashboardRouter`)
