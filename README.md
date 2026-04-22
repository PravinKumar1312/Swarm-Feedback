# Swarm Feedback Platform 🚀

A modern, enterprise-grade feedback and project review platform with an **iOS-inspired glassmorphic UI** and **high-performance backend**.
**URL**: https://swarm-feedback.vercel.app/

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

### Core Functionality

- 🔐 **JWT Authentication** - Secure user authentication with role-based access
- 📝 **Project Submissions** - Submit and manage project portfolios
- ⭐ **Feedback System** - Comprehensive rating and review mechanism
- 👥 **Multi-Role Support** - Submitter, Reviewer, and Admin roles
- 📊 **Analytics Dashboard** - Insights and performance metrics
- 🏆 **Leaderboard** - Gamified ranking system
- 🔔 **Real-time Notifications** - WebSocket-powered instant updates
- 👤 **Profile Management** - Customizable user profiles with avatars

### UI/UX Highlights

- 🎨 **iOS-Inspired Design** - Modern glassmorphic interface
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 📱 **Fully Responsive** - Mobile-first design approach
- 🌈 **Gradient Accents** - Beautiful color schemes
- 🎯 **Intuitive Navigation** - User-friendly interface
- ♿ **Accessible** - WCAG AA compliant

### Backend Optimizations

- ⚡ **Connection Pooling** - Optimized database connections
- 🗄️ **Caching** - Spring Cache for improved performance
- 🔄 **HTTP/2 Support** - Modern protocol implementation
- 📦 **Response Compression** - Gzip compression enabled
- 🔀 **Async Processing** - Non-blocking operations
- 📈 **Performance Monitoring** - Structured logging

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite (Rolldown)
- **Styling**: Tailwind CSS v4 (Alpha)
- **Animations**: Framer Motion, AnimeJS
- **3D Graphics**: React Three Fiber, Drei
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **State Management**: React Context API
- **Real-time**: SockJS, STOMP

### Backend

- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: MongoDB (NoSQL)
- **Security**: Spring Security + JWT
- **API Docs**: SpringDoc OpenAPI (Swagger)
- **Real-time**: WebSocket
- **Email**: Spring Mail
- **Caching**: Spring Cache

---

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **MongoDB**: v5.0 or higher
- **Maven**: v3.8 or higher

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Configure MongoDB** (optional - uses localhost by default):

   ```bash
   export MONGODB_URI=mongodb://localhost:27017/swarm-feedback
   ```

3. **Run the application**:

   ```bash
   ./mvnw spring-boot:run
   ```

   Server starts on `http://localhost:8082`

4. **Access API Documentation**:
   - Swagger UI: `http://localhost:8082/swagger-ui.html`
   - API Docs: `http://localhost:8082/api-docs`

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

   App available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📞 Support

For questions, issues, or contributions:

- **Email**: gladden8848@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/swarm-feedback/issues)

---

**Built with ❤️ using React, Spring Boot, and MongoDB**

_Last Updated: January 16, 2026_
