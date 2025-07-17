package com.bugbuster.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    private String id;

    private String name;
    private String description;
    private String versionControl;
    private List<String> teamMembers; // list of user IDs
    private String createdBy; // manager's user ID
}
