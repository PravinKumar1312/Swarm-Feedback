package com.swarm.feedback.service.impl;

import com.swarm.feedback.model.Feedback;
import com.swarm.feedback.repository.FeedbackRepository;
import com.swarm.feedback.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getFeedbackBySubmissionId(String submissionId) {
        return feedbackRepository.findBySubmissionId(submissionId);
    }

    @Override
    public List<Feedback> getFeedbackByReviewerId(String reviewerId) {
        return feedbackRepository.findByReviewerUserId(reviewerId);
    }

    @Autowired
    private com.swarm.feedback.repository.SubmissionRepository submissionRepository;

    @Override
    public List<Feedback> getFeedbackReceivedByUserId(String userId) {
        List<com.swarm.feedback.model.Submission> submissions = submissionRepository.findByOwnerUserId(userId);
        List<String> submissionIds = submissions.stream()
                .map(com.swarm.feedback.model.Submission::getId)
                .collect(java.util.stream.Collectors.toList());
        return feedbackRepository.findBySubmissionIdIn(submissionIds);
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
