package com.swarm.feedback.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "submissions")
public class Submission {
    @Id
    private String id;

    @Indexed
    private String ownerUserId;

    private String title;

    private String description;

    private List<String> fileUrls;

    private List<String> tags;

    private String status = "OPEN";

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}
