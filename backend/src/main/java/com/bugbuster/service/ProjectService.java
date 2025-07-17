package com.bugbuster.service;

import com.bugbuster.dto.ProjectRequest;
import com.bugbuster.model.Project;
import com.bugbuster.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    public Project createProject(ProjectRequest req, String managerId) {
        Project project = new Project();
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setVersionControl(req.getVersionControl());
        project.setTeamMembers(req.getTeamMembers());
        project.setCreatedBy(managerId);

        return projectRepo.save(project);
    }

    public List<Project> getProjectsByUserId(String userId) {
        return projectRepo.findByTeamMembersContaining(userId);
    }
}
