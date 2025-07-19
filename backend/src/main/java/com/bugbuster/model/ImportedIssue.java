package com.bugbuster.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "imported_issues")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportedIssue {
    @Id
    private String id;
    private int issueId;
    private String status;
    private String projectId;
}
