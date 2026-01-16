# Troubleshooting Log

## 1. Authentication Failure: "Illegal base64 character"

### Issue Description
Users (both manually registered and seeded admin users) were unable to log in. The login page displayed a generic "Failed to login" error.

### Root Cause Analysis
1.  **Backend Logs:** The backend logs (`run_log_debug_2.txt`) revealed a critical exception during the login process:
    ```
    io.jsonwebtoken.io.DecodingException: Illegal base64 character: '_'
    ```
    This error occurred in `JwtUtils.java` when attempting to decode the JWT secret key.
2.  **Configuration Check:** The `application.properties` file contained a default placeholder for `jwt.secret`:
    ```properties
    jwt.secret=${JWT_SECRET:your_very_long_secret_key_that_should_be_at_least_256_bits_long}
    ```
    The `jjwt` library (version 0.11.5) used in the project expects the secret key to be a valid Base64-encoded string when using `Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))`. The default string contained underscores (`_`), which are not valid in standard Base64 encoding (though valid in Base64URL, the decoder used was standard Base64).

### Resolution
1.  **Generated Valid Secret:** A new, valid Base64-encoded string was generated.
2.  **Updated Configuration:** The `application.properties` file was updated with the new secret:
    ```properties
    jwt.secret=VGhpcyBJcyBBIFZlcnkgTG9uZyBTZWNyZXQgS2V5IEZvciBKV1QgQXV0aGVudGljYXRpb24=
    ```
3.  **Restarted Backend:** The Spring Boot application was restarted to apply the changes.

### Verification
-   **Action:** Attempted login with the seeded `sysadmin` user.
-   **Result:** Login was successful. The user was redirected to the dashboard.
-   **Evidence:** Screenshot `sysadmin_dashboard_final_success_1764252820374.png` confirms the dashboard loaded with the correct user context and role badges.

## 2. Frontend Routing Issue

### Issue Description
The frontend application was loading a blank page.

### Root Cause Analysis
The `App` component in `main.jsx` was using `react-router-dom`'s `Routes` but was not wrapped in a `BrowserRouter`.

### Resolution
Wrapped the `<App />` component with `<BrowserRouter>` in `frontend/src/main.jsx`.

### Verification
-   **Evidence:** Screenshot `login_page_loaded_1764250852176.png` confirms the login page now renders correctly.
