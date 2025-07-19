package com.bugbuster.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "bugs")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Bug {
    @Id
    private String id;

    private String issueId;
    private String projectId;

    private String title;
    private String state;

    private LocalDateTime createdAt;
    private String createdBy;

    private LocalDateTime closedAt;
    private String closedBy;

    private LocalDateTime assignedAt;
    private String assignedTo;
    private String assignedBy;

    private LocalDateTime resolvedAt;
    private String resolvedBy;

    private String description;
    private String reproductionSteps;
    private String expectedOutcome;
    private String actualOutcome;

    @Builder.Default
    private String severity = "LOW";

    @Builder.Default
    private String urgency = "LOW";

    private String priority;

    private boolean fromGithub;

    @Builder.Default
    private List<Attachment> attachments = new ArrayList<>();

    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}
