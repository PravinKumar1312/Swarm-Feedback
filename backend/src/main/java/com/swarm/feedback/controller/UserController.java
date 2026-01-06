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

    @Autowired
    com.swarm.feedback.repository.FeedbackRepository feedbackRepository;

    @Autowired
    com.swarm.feedback.repository.SubmissionRepository submissionRepository;

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

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        java.util.List<User> users = userRepository.findAll();
        // Sort in memory or use Sort parameter in findAll if available
        users.sort((a, b) -> (b.getPoints() == null ? 0 : b.getPoints()) - (a.getPoints() == null ? 0 : a.getPoints()));

        java.util.List<java.util.Map<String, Object>> result = users.stream().limit(10).map(u -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("username", u.getUsername());
            map.put("points", u.getPoints() == null ? 0 : u.getPoints());
            map.put("level", u.getLevel());
            map.put("profilePic", u.getProfilePic());
            return map;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(result);
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

        // Calculate Ratings dynamically
        if (user.getRoles() != null && user.getRoles().contains("ROLE_REVIEWER")) {
            // For Reviewer: Average rating GIVEN
            java.util.List<com.swarm.feedback.model.Feedback> givenFeedback = feedbackRepository
                    .findAllByReviewerUserId(userId);
            if (!givenFeedback.isEmpty()) {
                double avg = givenFeedback.stream().mapToInt(com.swarm.feedback.model.Feedback::getRating).average()
                        .orElse(0.0);
                user.setRatings(avg);
            }
        } else {
            // For Submitter: Average rating RECEIVED across all projects
            java.util.List<com.swarm.feedback.model.Submission> mySubmissions = submissionRepository
                    .findByOwnerUserId(userId);
            if (!mySubmissions.isEmpty()) {
                java.util.List<String> submissionIds = mySubmissions.stream()
                        .map(com.swarm.feedback.model.Submission::getId).collect(java.util.stream.Collectors.toList());
                java.util.List<com.swarm.feedback.model.Feedback> receivedFeedback = feedbackRepository
                        .findAllBySubmissionIdIn(submissionIds);

                // Filter for approved feedback only
                double avg = receivedFeedback.stream()
                        .filter(f -> "APPROVED".equals(f.getStatus()))
                        .mapToInt(com.swarm.feedback.model.Feedback::getRating)
                        .average().orElse(0.0);
                user.setRatings(avg);
            }
        }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(403).body("Access denied");
        }

        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(new com.swarm.feedback.payload.response.MessageResponse("User deleted successfully!"));
    }
}
