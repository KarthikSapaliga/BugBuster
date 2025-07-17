package com.bugbuster.controller;

import com.bugbuster.model.Bug;
import com.bugbuster.repository.BugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    @Autowired
    private BugRepository bugRepository;

    // Create a new bug
    @PostMapping
    public Bug createBug(@RequestBody Bug bug) {
        bug.setCreatedAt(LocalDateTime.now());
        return bugRepository.save(bug);
    }

    // Get all bugs for a specific project
    @GetMapping("/project/{projectId}")
    public List<Bug> getBugsByProject(
            @PathVariable String projectId,
            @RequestParam(required = false) Boolean fromGithub) {

        if (fromGithub != null) {
            return bugRepository.findByProjectIdAndFromGithub(projectId, fromGithub);
        }

        return bugRepository.findByProjectId(projectId);
    }

    // Get all bugs assigned to a user
    @GetMapping("/assignedTo/{userId}")
    public List<Bug> getBugsAssignedTo(@PathVariable String userId) {
        return bugRepository.findByAssignedTo(userId);
    }

    // Get all bugs created by a user
    @GetMapping("/createdBy/{userId}")
    public List<Bug> getBugsCreatedBy(@PathVariable String userId) {
        return bugRepository.findByCreatedBy(userId);
    }

    // Get a bug by its ID
    @GetMapping("/{id}")
    public Bug getBugById(@PathVariable String id) {
        return bugRepository.findById(id).orElse(null);
    }

    // Update an existing bug
    @PutMapping("/{id}")
    public Bug updateBug(@PathVariable String id, @RequestBody Bug updatedBug) {
        updatedBug.setId(id);
        return bugRepository.save(updatedBug);
    }

    // Delete a bug
    @DeleteMapping("/{id}")
    public void deleteBug(@PathVariable String id) {
        bugRepository.deleteById(id);
    }

    // Close a bug (sets closedAt, closedBy, and state)
    @PatchMapping("/{id}/close")
    public Bug closeBug(@PathVariable String id, @RequestParam String closedBy) {
        Optional<Bug> bugOptional = bugRepository.findById(id);
        if (bugOptional.isPresent()) {
            Bug bug = bugOptional.get();
            bug.setClosedAt(LocalDateTime.now());
            bug.setClosedBy(closedBy);
            bug.setState("CLOSED");
            return bugRepository.save(bug);
        }
        return null;
    }

    // Assign a bug to a user
    @PatchMapping("/{id}/assign")
    public Bug assignBug(@PathVariable String id,
            @RequestParam String assignedTo,
            @RequestParam String assignedBy) {

        Optional<Bug> bugOptional = bugRepository.findById(id);
        if (bugOptional.isPresent()) {
            Bug bug = bugOptional.get();
            bug.setAssignedAt(LocalDateTime.now());
            bug.setAssignedTo(assignedTo);
            bug.setAssignedBy(assignedBy);
            return bugRepository.save(bug);
        }
        return null;
    }

    // Get all bugs (optional - useful for admin or overview dashboards)
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }
}
