# Swarm Feedback - Phase 2: Production Readiness & Polish

## 1. Infrastructure & Persistence
- [ ] **Database Migration**
    - [ ] Setup PostgreSQL (Docker or Local)
    - [ ] Configure Spring Boot `application.properties` for PostgreSQL
    - [ ] Verify data persistence across restarts
- [ ] **Containerization**
    - [ ] Create `Dockerfile` for Backend
    - [ ] Create `Dockerfile` for Frontend
    - [ ] Create `docker-compose.yml` (Backend + Frontend + DB)

## 2. User Experience (UX) Enhancements
- [x] **Notifications**
    - [x] Install `react-hot-toast` or similar
    - [x] Add success toasts for: Login, Registration, Submission, Feedback
    - [x] Add error toasts for failed actions
- [x] **Loading States**
    - [x] Add loading spinners/skeletons for data fetching
    - [x] Disable buttons during submission to prevent double-clicks
- [x] **Responsive Design Polish**
    - [x] Verify and fix mobile layout issues

## 3. Feature Expansion
- [x] **User Profile**
    - [x] Create Profile Page
    - [x] Allow editing of Username/Bio
- [ ] **Search & Filter**
    - [ ] Add search bar for Projects
    - [ ] Add filter by Status (Approved/Pending) for Admins

## 4. Code Quality & Testing
- [ ] **Backend Testing**
    - [ ] Write Unit Tests for Services (JUnit/Mockito)
    - [ ] Write Integration Tests for Controllers
- [ ] **Frontend Testing**
    - [ ] Setup basic component tests (Vitest/Jest)
