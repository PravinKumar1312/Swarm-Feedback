# Project Setbacks and Error Log

## Setback #1: Backend Startup Failure (2025-12-01)

### Description
The backend service (`spring-boot:run`) failed to start after recent updates to `UserController`, `WebConfig`, and `AuthTokenFilter`. The error manifests as a `MojoExecutionException` during the Maven build process.

### Symptoms
- `mvnw spring-boot:run` exits with code 1.
- Port 8080/8081 appears to be clear (after manual cleanup), but the application still fails to launch.
- The frontend is running but cannot connect to the backend ("Failed to load profile").

### Root Cause Analysis (Ongoing)
- Potential compilation error due to recent code changes (annotations, unchecked casts).
- Potential configuration issue in `WebConfig`.
- Potential port conflict or "zombie" java processes.

### Resolution Steps Taken
1.  Manual termination of conflicting Java processes.
2.  Clean build attempts (`mvnw clean install`).
3.  Code review of recent changes.

### Status
**Resolved** - Backend rebuilt and restarted. CORS enabled, JWT expiration increased to 7 days.

