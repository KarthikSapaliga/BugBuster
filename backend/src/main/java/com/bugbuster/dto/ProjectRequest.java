package com.bugbuster.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectRequest {
    private String name;
    private String description;
    private String versionControl;
    private List<String> teamMembers;
}
