package com.swarm.feedback.repository;

import com.swarm.feedback.model.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByOwnerUserId(String ownerUserId);
}
