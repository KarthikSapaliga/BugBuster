package com.bugbuster.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bugbuster.model.ImportedIssue;
import com.bugbuster.repository.ImportedIssueRepository;

@Service
public class ImportedIssueService {
    @Autowired
    private ImportedIssueRepository importedIssueRepository;

    public List<Integer> getAllImportedIssueIds() {
        return importedIssueRepository.findAll()
                .stream()
                .map(ImportedIssue::getIssueId)
                .collect(Collectors.toList());
    }

    public List<Integer> getImportedIssueIdsByProject(String projectId) {
        return importedIssueRepository.findByProjectId(projectId)
                .stream()
                .map(ImportedIssue::getIssueId)
                .collect(Collectors.toList());
    }

}
