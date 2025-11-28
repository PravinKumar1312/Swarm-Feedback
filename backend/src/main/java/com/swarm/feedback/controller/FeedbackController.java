package com.swarm.feedback.controller;

import com.swarm.feedback.model.Feedback;
import com.swarm.feedback.payload.request.FeedbackRequest;
import com.swarm.feedback.payload.response.MessageResponse;
import com.swarm.feedback.security.services.UserDetailsImpl;
import com.swarm.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private com.swarm.feedback.service.ActivityLogService activityLogService;

    @PostMapping
    public ResponseEntity<?> createFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String reviewerId = "anonymous";

        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            reviewerId = userDetails.getId();
        }

        Feedback feedback = new Feedback();
        feedback.setSubmissionId(feedbackRequest.getSubmissionId());
        feedback.setReviewerUserId(reviewerId);
        feedback.setComments(feedbackRequest.getComments());
        feedback.setRating(feedbackRequest.getRating());

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

    @GetMapping("/submission/{submissionId}")
    public List<Feedback> getFeedbackBySubmission(@PathVariable String submissionId) {
        return feedbackService.getFeedbackBySubmissionId(submissionId);
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }
}
