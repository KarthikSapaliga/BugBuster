package com.bugbuster.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bugbuster.service.ImportedIssueService;

@RestController
@RequestMapping("/api/github")
public class ImportedIssueController {

    @Autowired
    private ImportedIssueService importedIssueService;

    // @GetMapping("/imported-issue-ids")
    // public ResponseEntity<List<Integer>> getAllImportedIssueIds() {
    // List<Integer> ids = importedIssueService.getAllImportedIssueIds();
    // return ResponseEntity.ok(ids);
    // }

    @GetMapping("/imported-issue-ids/{projectId}")
    public ResponseEntity<List<Integer>> getImportedIssueIdsByProject(
            @PathVariable String projectId) {
        List<Integer> ids = importedIssueService.getImportedIssueIdsByProject(projectId);
        return ResponseEntity.ok(ids);
    }

}
