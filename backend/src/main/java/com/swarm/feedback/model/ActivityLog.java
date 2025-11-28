package com.swarm.feedback.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "activity_logs")
public class ActivityLog {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String actionType; // e.g., "CREATE_SUBMISSION", "LOGIN", "GIVE_FEEDBACK"

    private Map<String, Object> details;

    @Indexed
    private LocalDateTime createdAt = LocalDateTime.now();
}
