package com.bugbuster.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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

    private String description;
    private String reproductionSteps;
    private String expectedOutcome;
    private String actualOutcome;

    private String urgency;
    private String severity;

    private boolean fromGithub;

    private List<Attachment> attachments; 
    private List<Comment> comments;   
    private List<WorkRequest> requests;  
}
