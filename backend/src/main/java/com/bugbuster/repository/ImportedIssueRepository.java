package com.bugbuster.repository;

import com.bugbuster.model.ImportedIssue;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ImportedIssueRepository extends MongoRepository<ImportedIssue, String> {
    Optional<ImportedIssue> findByIssueId(int issueId);
    List<ImportedIssue> findByProjectId(String projectId);

}
