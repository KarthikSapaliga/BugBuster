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
    private String githubLink;
    private String githubToken;

    private List<String> teamMembers;
    private String createdBy;
}
