package com.swarm.feedback.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swarm.feedback.model.User;
import com.swarm.feedback.payload.request.LoginRequest;
import com.swarm.feedback.payload.request.SignupRequest;
import com.swarm.feedback.payload.response.JwtResponse;
import com.swarm.feedback.payload.response.MessageResponse;
import com.swarm.feedback.repository.UserRepository;
import com.swarm.feedback.security.jwt.JwtUtils;
import com.swarm.feedback.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // @Autowired
    // com.swarm.feedback.service.ActivityLogService activityLogService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("DEBUG: Login attempt for user: " + loginRequest.getUsername());
        System.out.println("DEBUG: Password provided: " + loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Log login activity
        // activityLogService.logActivity(userDetails.getId(), "LOGIN", null);

        // Update last login time
        String userId = userDetails.getId();
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setLastLoginAt(java.time.LocalDateTime.now());
                userRepository.save(user);
            }
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getUsername()); // Default name to username

        Set<String> strRoles = signUpRequest.getRoles();
        Set<String> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            roles.add("ROLE_SUBMITTER");
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        throw new RuntimeException("Error: Role 'admin' is not allowed for public registration.");
                    case "reviewer":
                        roles.add("ROLE_REVIEWER");
                        break;
                    case "submitter":
                        roles.add("ROLE_SUBMITTER");
                        break;
                    default:
                        roles.add("ROLE_SUBMITTER");
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        // Log signup activity
        // activityLogService.logActivity(savedUser.getId(), "SIGNUP", null);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody com.swarm.feedback.payload.request.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found with email: " + request.getEmail()));

        String token = java.util.UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15)); // 15 mins expiry
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        // In a real app, send email here. For now, we log it.
        System.out.println("Reset Password Link for " + user.getEmail() + ": " + resetLink);

        try {
            sendEmail(user.getEmail(), "Password Reset Request", "Click the link to reset your password: " + resetLink);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Don't fail the request if email fails, just log it (since we printed the
            // link)
        }

        return ResponseEntity.ok(new MessageResponse("Reset link sent to your email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody com.swarm.feedback.payload.request.ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Error: Invalid token"));

        if (user.getResetPasswordTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Token expired"));
        }

        user.setPasswordHash(encoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }

    @Autowired(required = false)
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    private void sendEmail(String to, String subject, String text) {
        if (mailSender != null) {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        }
    }
}
