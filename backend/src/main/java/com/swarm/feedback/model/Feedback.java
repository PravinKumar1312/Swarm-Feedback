package com.swarm.feedback.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "feedback")
public class Feedback {
    @Id
    private String id;

    private String submissionId;

    @Indexed
    private String reviewerUserId;

    private String comments;

    private Integer rating;

    private String status = "PENDING";

    private String rejectionReason;

    private String submitterReply;

    private LocalDateTime submitterRepliedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
}
