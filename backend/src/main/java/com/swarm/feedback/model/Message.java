package com.swarm.feedback.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String senderId;
    private String senderUsername;
    private String subject;
    private String description;
    private String mediaUrl; // For uploaded video/pic
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean isRead = false;
}
