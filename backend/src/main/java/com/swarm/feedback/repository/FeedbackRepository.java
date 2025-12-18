package com.swarm.feedback.repository;

import com.swarm.feedback.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    List<Feedback> findBySubmissionId(String submissionId);

    List<Feedback> findByReviewerUserId(String reviewerUserId);

    List<Feedback> findBySubmissionIdIn(List<String> submissionIds);

    // Added to match controller usage
    List<Feedback> findAllByReviewerUserId(String reviewerUserId);

    List<Feedback> findAllBySubmissionIdIn(List<String> submissionIds);
}
