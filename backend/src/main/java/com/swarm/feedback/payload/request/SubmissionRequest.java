package com.swarm.feedback.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class SubmissionRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private List<String> fileUrls;
}
