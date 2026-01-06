package com.swarm.feedback.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    private Integer points = 0;
    private String level = "Bronze";
    private Set<String> badges = new HashSet<>();
    private Integer reviewsGiven = 0;
    private Integer helpfulVotes = 0;
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private String name;

    private String bio;

    private Set<String> roles = new HashSet<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private Integer age;

    private String regNumber;

    private String profilePic;

    private java.util.List<String> skills;

    private Double ratings;

    private LocalDateTime lastLoginAt;

    private String resetPasswordToken;

    private LocalDateTime resetPasswordTokenExpiry;
}
