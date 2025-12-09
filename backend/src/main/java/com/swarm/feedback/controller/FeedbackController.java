package com.swarm.feedback.controller;

import com.swarm.feedback.model.Feedback;
import com.swarm.feedback.payload.request.FeedbackRequest;
import com.swarm.feedback.payload.response.MessageResponse;
import com.swarm.feedback.repository.SubmissionRepository;
import com.swarm.feedback.security.services.UserDetailsImpl;
import com.swarm.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private com.swarm.feedback.service.ActivityLogService activityLogService;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private com.swarm.feedback.repository.UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String reviewerId = "anonymous";
        boolean isAdmin = false;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            reviewerId = userDetails.getId();
            isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        Feedback feedback = new Feedback();
        feedback.setSubmissionId(feedbackRequest.getSubmissionId());
        feedback.setReviewerUserId(reviewerId);
        feedback.setComments(feedbackRequest.getComments());
        feedback.setRating(feedbackRequest.getRating());
        feedback.setStatus(isAdmin ? "APPROVED" : "PENDING");

        Feedback savedFeedback = feedbackService.createFeedback(feedback);

        // Log activity if not anonymous
        if (!"anonymous".equals(reviewerId)) {
            java.util.Map<String, Object> details = new java.util.HashMap<>();
            details.put("feedbackId", savedFeedback.getId());
            details.put("submissionId", savedFeedback.getSubmissionId());
            details.put("rating", savedFeedback.getRating());
            activityLogService.logActivity(reviewerId, "GIVE_FEEDBACK", details);
        }

        return ResponseEntity.ok(new MessageResponse("Feedback submitted successfully!"));
    }

    @GetMapping
    public ResponseEntity<List<java.util.Map<String, Object>>> getAllFeedback() {
        List<Feedback> feedbacks = feedbackService.getAllFeedback();
        List<java.util.Map<String, Object>> enrichedFeedbacks = feedbacks.stream().map(feedback -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", feedback.getId());
            map.put("submissionId", feedback.getSubmissionId());
            map.put("reviewerUserId", feedback.getReviewerUserId());
            map.put("comments", feedback.getComments());
            map.put("rating", feedback.getRating());
            map.put("createdAt", feedback.getCreatedAt());

            if (feedback.getReviewerUserId() != null) {
                userRepository.findById(feedback.getReviewerUserId()).ifPresent(user -> {
                    map.put("reviewerUsername", user.getUsername());
                });
            }

            if (feedback.getSubmissionId() != null) {
                submissionRepository.findById(feedback.getSubmissionId()).ifPresent(submission -> {
                    map.put("submissionTitle", submission.getTitle());
                });
            }

            return map;
        }).collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(enrichedFeedbacks);
    }

    @GetMapping("/my")
    public List<Feedback> getMyFeedback() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        List<Feedback> feedback = new java.util.ArrayList<>();

        // If reviewer, get feedback given (Always see own)
        feedback.addAll(feedbackService.getFeedbackByReviewerId(userId));

        // If submitter, get feedback received
        List<Feedback> received = feedbackService.getFeedbackReceivedByUserId(userId);
        if (!isAdmin) {
            received = received.stream()
                    .filter(f -> "APPROVED".equals(f.getStatus()))
                    .collect(java.util.stream.Collectors.toList());
        }
        feedback.addAll(received);

        // Remove duplicates if any (though unlikely to overlap unless self-review)
        return feedback.stream().distinct().collect(java.util.stream.Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable String id, @RequestBody FeedbackRequest feedbackRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Admin access required."));
        }

        return feedbackService.getAllFeedback().stream() // Inefficient but simple for now
                .filter(f -> f.getId().equals(id))
                .findFirst()
                .map(feedback -> {
                    feedback.setComments(feedbackRequest.getComments());
                    feedback.setRating(feedbackRequest.getRating());
                    feedbackService.createFeedback(feedback); // save

                    // Log activity
                    java.util.Map<String, Object> details = new java.util.HashMap<>();
                    details.put("feedbackId", feedback.getId());
                    details.put("action", "ADMIN_UPDATE");
                    activityLogService.logActivity(userDetails.getId(), "UPDATE_FEEDBACK", details);

                    return ResponseEntity.ok(new MessageResponse("Feedback updated successfully!"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFeedbackStatus(@PathVariable String id,
            @RequestBody java.util.Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Admin access required."));
        }

        String newStatus = payload.get("status");
        if (newStatus == null
                || (!newStatus.equals("APPROVED") && !newStatus.equals("REJECTED") && !newStatus.equals("PENDING"))) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid status."));
        }

        return feedbackService.getAllFeedback().stream()
                .filter(f -> f.getId().equals(id))
                .findFirst()
                .map(feedback -> {
                    feedback.setStatus(newStatus);
                    feedbackService.createFeedback(feedback); // save

                    // Log activity
                    java.util.Map<String, Object> details = new java.util.HashMap<>();
                    details.put("feedbackId", feedback.getId());
                    details.put("status", newStatus);
                    activityLogService.logActivity(userDetails.getId(), "UPDATE_FEEDBACK_STATUS", details);

                    return ResponseEntity.ok(new MessageResponse("Feedback status updated successfully!"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
