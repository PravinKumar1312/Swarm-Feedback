package com.swarm.feedback.service;

import com.swarm.feedback.model.Submission;
import java.util.List;
import java.util.Optional;

public interface SubmissionService {
    Submission createSubmission(Submission submission);

    List<Submission> getAllSubmissions();

    List<Submission> getSubmissionsByUserId(String userId);

    Optional<Submission> getSubmissionById(String id);
}
