# Build & Run Progress (as of 2025-11-27 13:02)

## Recent actions
- Updated `pom.xml` to use Maven Compiler Plugin (Java 17) and Lombok annotation processor.
- Added Lombok dependency version `1.18.30` with `provided` scope.
- Refactored controllers and UI components (Dashboard, SubmissionList, FeedbackForm).
- Successfully compiled the project with `mvnw.cmd compile`.
- Ran the Spring Boot application using `.

## Current error
When executing `.

```
.

mvnw.cmd spring-boot:run
```

the build fails with:

```
APPLICATION FAILED TO START
Description:
Web server failed to start. Port 8080 was already in use.
```

### Why this happens
Port **8080** is already bound by another process (most likely a previous instance of the application that was not stopped).

### Steps taken so far
1. Ran `.

mvnw.cmd spring-boot:run` – Maven started, compiled classes, and attempted to start Tomcat.
2. Observed the log output showing the server initialization and the final error about port 8080.
3. Verified that the Maven wrapper works and the project builds correctly.

### How to resolve
#### Option A – Stop the existing process
```powershell
# Find the PID listening on port 8080
netstat -ano | findstr :8080
# Example output:  TCP    0.0.0.0:8080   0.0.0.0:0   LISTENING   12345
# Kill the process (replace 12345 with the actual PID)
Stop-Process -Id 12345 -Force
```
After stopping the process, run the application again:
```powershell
.

mvnw.cmd spring-boot:run
```
#### Option B – Change the server port
Add (or edit) `src/main/resources/application.properties`:
```
server.port=8081
```
Then restart the app; it will listen on the new port.

## Next steps
- Stop the conflicting process or change the port as described.
- Verify the backend is reachable (`curl -I http://localhost:8080/` or the new port).
- Continue end‑to‑end testing of sign‑up, submission, and feedback flows.

---
*All modifications made to the codebase are already reflected in the repository. This file records the current state and the actions taken to resolve the startup issue.*
