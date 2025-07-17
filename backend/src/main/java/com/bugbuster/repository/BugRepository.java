package com.bugbuster.repository;

import com.bugbuster.model.Bug;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugRepository extends MongoRepository<Bug, String> {
    List<Bug> findByProjectId(String projectId);

    List<Bug> findByAssignedTo(String userId);

    List<Bug> findByCreatedBy(String userId);

    List<Bug> findByProjectIdAndFromGithub(String projectId, boolean fromGithub);
}
