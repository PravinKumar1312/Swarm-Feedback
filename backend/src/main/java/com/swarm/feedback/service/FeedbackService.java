package com.swarm.feedback.service;

import com.swarm.feedback.model.Feedback;
import java.util.List;

public interface FeedbackService {
    Feedback createFeedback(Feedback feedback);

    List<Feedback> getFeedbackBySubmissionId(String submissionId);

    List<Feedback> getFeedbackByReviewerId(String reviewerId);

    List<Feedback> getAllFeedback();
}
