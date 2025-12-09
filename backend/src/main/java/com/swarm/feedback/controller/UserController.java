package com.swarm.feedback.controller;

import com.swarm.feedback.model.User;
import com.swarm.feedback.repository.UserRepository;
import com.swarm.feedback.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(userRepository.findAll().stream().map(u -> {
            u.setPasswordHash(null);
            return u;
        }).collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return ResponseEntity.status(401).build();
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(400).body("User ID is null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, Object> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(400).body("User ID is null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (payload.containsKey("bio")) {
            user.setBio((String) payload.get("bio"));
        }

        if (payload.containsKey("name")) {
            user.setName((String) payload.get("name"));
        }

        if (payload.containsKey("age")) {
            Object ageObj = payload.get("age");
            if (ageObj instanceof Integer) {
                user.setAge((Integer) ageObj);
            } else if (ageObj instanceof String) {
                try {
                    user.setAge(Integer.parseInt((String) ageObj));
                } catch (NumberFormatException e) {
                    // ignore or handle error
                }
            }
        }

        if (payload.containsKey("regNumber")) {
            user.setRegNumber((String) payload.get("regNumber"));
        }

        if (payload.containsKey("profilePic")) {
            user.setProfilePic((String) payload.get("profilePic"));
        }

        if (payload.containsKey("skills")) {
            Object skillsObj = payload.get("skills");
            if (skillsObj instanceof java.util.List) {
                @SuppressWarnings("unchecked")
                java.util.List<String> skillsList = (java.util.List<String>) skillsObj;
                user.setSkills(skillsList);
            }
        }

        java.util.Objects.requireNonNull(user);
        userRepository.save(user);

        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/me/picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(400).body("User ID is null");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // Create uploads directory if not exists
            java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }

            // Generate unique filename
            String filename = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadDir.resolve(filename);

            // Save file
            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Update user profile pic URL
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            // Assuming the backend runs on localhost:8082, we construct the URL
            // In production, this should be configurable
            String fileUrl = "http://localhost:8082/uploads/" + filename;
            user.setProfilePic(fileUrl);
            userRepository.save(user);

            user.setPasswordHash(null);
            return ResponseEntity.ok(user);

        } catch (java.io.IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }
}
