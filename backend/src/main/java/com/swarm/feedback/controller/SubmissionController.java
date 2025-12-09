package com.swarm.feedback.controller;

import com.swarm.feedback.model.Submission;
import com.swarm.feedback.payload.request.SubmissionRequest;
import com.swarm.feedback.payload.response.MessageResponse;
import com.swarm.feedback.security.services.UserDetailsImpl;
import com.swarm.feedback.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private com.swarm.feedback.service.ActivityLogService activityLogService;

    @PostMapping
    public ResponseEntity<?> createSubmission(@Valid @RequestBody SubmissionRequest submissionRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Submission submission = new Submission();
        submission.setOwnerUserId(userDetails.getId());
        submission.setTitle(submissionRequest.getTitle());
        submission.setDescription(submissionRequest.getDescription());
        submission.setFileUrls(submissionRequest.getFileUrls());

        Submission savedSubmission = submissionService.createSubmission(submission);

        // Log activity
        java.util.Map<String, Object> details = new java.util.HashMap<>();
        details.put("submissionId", savedSubmission.getId());
        details.put("title", savedSubmission.getTitle());
        activityLogService.logActivity(userDetails.getId(), "CREATE_SUBMISSION", details);

        return ResponseEntity.ok(new MessageResponse("Submission created successfully!"));
    }

    @GetMapping
    public List<Submission> getAllSubmissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = false;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        if (isAdmin) {
            return submissionService.getAllSubmissions();
        } else {
            return submissionService.getSubmissionsByStatus("APPROVED");
        }
    }

    @GetMapping("/my")
    public List<Submission> getMySubmissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return submissionService.getSubmissionsByUserId(userDetails.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable String id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSubmissionStatus(@PathVariable String id,
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

        return submissionService.getSubmissionById(id)
                .map(submission -> {
                    submission.setStatus(newStatus);
                    submissionService.createSubmission(submission); // save

                    // Log activity
                    java.util.Map<String, Object> details = new java.util.HashMap<>();
                    details.put("submissionId", submission.getId());
                    details.put("status", newStatus);
                    activityLogService.logActivity(userDetails.getId(), "UPDATE_SUBMISSION_STATUS", details);

                    return ResponseEntity.ok(new MessageResponse("Submission status updated successfully!"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
