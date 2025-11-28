package com.swarm.feedback.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotBlank
    private String submissionId;

    @NotBlank
    private String comments;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
}
