# Data Model & MongoDB Setup

## Overview
This document outlines the MongoDB data model and configuration for the Swarm Feedback application.

## MongoDB Configuration
- **Database Name**: `swarm_feedback`
- **Connection URI**: `mongodb://localhost:27017/swarm_feedback` (Dev) / `mongodb+srv://...` (Prod)

## Collections

### 1. users
Stores user profiles and authentication details.
- **_id**: ObjectId
- **username**: String (Unique)
- **email**: String (Unique)
- **passwordHash**: String
- **name**: String
- **roles**: Set<String> (e.g., "ROLE_SUBMITTER", "ROLE_REVIEWER", "ROLE_ADMIN")
- **createdAt**: LocalDateTime
- **lastLoginAt**: LocalDateTime

### 2. submissions
Stores projects or documents uploaded for feedback.
- **_id**: ObjectId
- **ownerUserId**: String (Indexed)
- **title**: String
- **description**: String
- **fileUrls**: List<String>
- **tags**: List<String>
- **status**: String ("OPEN", "CLOSED")
- **createdAt**: LocalDateTime
- **updatedAt**: LocalDateTime

### 3. feedback
Stores reviews and ratings given by reviewers.
- **_id**: ObjectId
- **submissionId**: String (Indexed)
- **reviewerUserId**: String (Indexed)
- **rating**: Integer (1-5)
- **comments**: String
- **createdAt**: LocalDateTime

### 4. activity_logs
Tracks system activities for analytics and auditing.
- **_id**: ObjectId
- **userId**: String (Indexed)
- **actionType**: String (e.g., "CREATE_SUBMISSION", "LOGIN")
- **details**: Map<String, Object>
- **createdAt**: LocalDateTime

## Implementation Status
- [x] All entity classes created in `com.swarm.feedback.model`
- [x] Repositories created in `com.swarm.feedback.repository`
- [x] MongoDB connection configured in `application.properties`
