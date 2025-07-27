package com.bugbuster.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "bugs")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Bug {
    @Id
    private String id;

    private Integer issueId;
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

    private String testerAssignedTo;

    private LocalDateTime resolvedAt;
    private String resolvedBy;

    private String description;
    private String reproductionSteps;
    private String expectedOutcome;
    private String actualOutcome;

    private double estimatedHours;
    private double spentHours;

    @Builder.Default
    private List<String> resolveMessages = new ArrayList<>();

    @Builder.Default
    private List<String> closeMessages = new ArrayList<>();
    
    @Builder.Default
    private List<String> assignmentMessages = new ArrayList<>();

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
