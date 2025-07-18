package com.bugbuster.repository;

import com.bugbuster.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByTeamMembersContaining(String userId);
    List<Project> findByCreatedBy(String userId);
    List<Project> findByTeamMembersContainingOrCreatedBy(String memberEmail, String creatorId);
}
