package com.swarm.feedback.service.impl;

import com.swarm.feedback.model.Submission;
import com.swarm.feedback.repository.SubmissionRepository;
import com.swarm.feedback.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Override
    public Submission createSubmission(Submission submission) {
        return submissionRepository.save(java.util.Objects.requireNonNull(submission));
    }

    @Override
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @Override
    public List<Submission> getSubmissionsByUserId(String userId) {
        return submissionRepository.findByOwnerUserId(userId);
    }

    @Override
    public Optional<Submission> getSubmissionById(String id) {
        return submissionRepository.findById(java.util.Objects.requireNonNull(id));
    }

    @Override
    public List<Submission> getSubmissionsByStatus(String status) {
        return submissionRepository.findByStatus(status);
    }
}
