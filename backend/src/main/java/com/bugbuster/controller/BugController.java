package com.bugbuster.controller;

import com.bugbuster.service.BugService;
import com.bugbuster.service.UserService;
// import com.bugbuster.service.MailService;
import com.bugbuster.model.Attachment;
import com.bugbuster.model.Bug;
import com.bugbuster.model.Comment;
import com.bugbuster.model.WorkRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    @Autowired
    private BugService bugService;
    @Autowired
    private UserService userService;
    // @Autowired
    // private MailService mailService;

    // Create Bug
    @PostMapping
    public Bug createBug(@RequestBody Bug bug, Authentication auth) {
        bug.setCreatedBy(auth.getName());
        bug.setCreatedAt(LocalDateTime.now());
        return bugService.createBug(bug);
    }

    // Get Bug by ID
    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBug(@PathVariable String id) {
        return bugService.getBugById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Bug
    @PutMapping("/{id}")
    public ResponseEntity<Bug> updateBug(@PathVariable String id, @RequestBody Bug updatedBug, Authentication auth) {
        Optional<Bug> existingOpt = bugService.getBugById(id);
        if (existingOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Bug existing = existingOpt.get();
        if (!existing.getCreatedBy().equals(auth.getName()) && !auth.getAuthorities().toString().contains("TESTER")) {
            return ResponseEntity.status(403).build();
        }

        updatedBug.setId(id);
        return ResponseEntity.ok(bugService.updateBug(updatedBug));
    }

    // Delete Bug
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBug(@PathVariable String id, Authentication auth) {
        Optional<Bug> bug = bugService.getBugById(id);
        if (bug.isEmpty())
            return ResponseEntity.notFound().build();
        if (!bug.get().getCreatedBy().equals(auth.getName()) && !auth.getAuthorities().toString().contains("TESTER")) {
            return ResponseEntity.status(403).build();
        }

        bugService.deleteBug(id);
        return ResponseEntity.ok().build();
    }

    // Get all Bugs
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugService.getAllBugs();
    }

    // Get Bugs by Project
    @GetMapping("/project/{projectId}")
    public List<Bug> getBugsByProject(@PathVariable String projectId,
            @RequestParam(required = false) Boolean fromGithub) {
        return bugService.getBugsByProject(projectId, fromGithub);
    }

    // Get Bugs assigned to current user
    @GetMapping("/assigned")
    public List<Bug> getAssignedBugs(Authentication auth) {
        String username = auth.getName();
        return bugService.getAllBugs().stream()
                .filter(bug -> username.equalsIgnoreCase(bug.getAssignedTo()))
                .collect(Collectors.toList());
    }

    // Comment on Bug
    @PostMapping("/comment/{id}")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody Comment comment, Authentication auth) {
        Optional<Bug> bugOpt = bugService.getBugById(id);
        if (bugOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Bug bug = bugOpt.get();
        if (bug.getComments() == null)
            bug.setComments(new ArrayList<>());

        comment.setAuthor(auth.getName());
        comment.setTimestamp(new Date());
        bug.getComments().add(comment);

        bugService.updateBug(bug);
        return ResponseEntity.ok(bug);
    }

    // Get comments
    @GetMapping("/comments/{id}")
    public ResponseEntity<?> getComments(@PathVariable String id) {
        return bugService.getBugById(id)
                .map(bug -> ResponseEntity.ok(bug.getComments() != null ? bug.getComments() : new ArrayList<>()))
                .orElse(ResponseEntity.notFound().build());
    }

    // Request work on Bug
    @PostMapping("/requests/{id}")
    public ResponseEntity<?> addRequest(@PathVariable String id, @RequestBody WorkRequest request,
            Authentication auth) {
        Optional<Bug> bugOpt = bugService.getBugById(id);
        if (bugOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Bug bug = bugOpt.get();
        if (bug.getRequests() == null)
            bug.setRequests(new ArrayList<>());

        request.setAuthor(auth.getName());
        request.setStatus("pending");
        request.setTimestamp(new Date());
        bug.getRequests().add(request);

        bugService.updateBug(bug);
        return ResponseEntity.ok(bug);
    }

    // Approve/Reject request
    @PutMapping("/requests/{id}/{index}")
    public ResponseEntity<?> handleRequest(
            @PathVariable String id,
            @PathVariable int index,
            @RequestParam String status,
            Authentication auth) {
        Optional<Bug> bugOpt = bugService.getBugById(id);
        if (bugOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Bug bug = bugOpt.get();

        // Only testers can approve/reject
        boolean isTester = auth.getAuthorities().stream()
                .anyMatch(role -> role.getAuthority().equals("TESTER"));
        if (!isTester) {
            return ResponseEntity.status(403).body("Only testers can approve or reject work requests.");
        }

        List<WorkRequest> requests = bug.getRequests();
        if (requests == null || index < 0 || index >= requests.size()) {
            return ResponseEntity.badRequest().body("Invalid request index");
        }

        WorkRequest req = requests.get(index);
        req.setStatus(status);

        if ("approved".equalsIgnoreCase(status)) {
            String assignedTo = req.getAuthor();
            bug.setAssignedTo(assignedTo);
            bug.setAssignedAt(LocalDateTime.now());
            bug.setAssignedBy(auth.getName());

            // Cancel other pending requests
            for (int i = 0; i < requests.size(); i++) {
                if (i != index && "pending".equalsIgnoreCase(requests.get(i).getStatus())) {
                    requests.get(i).setStatus("rejected");
                }
            }

            // mailService.sendBugAssignmentMail(assignedTo, bug.getTitle());
        }

        bugService.updateBug(bug);
        return ResponseEntity.ok(bug);
    }

    // Get all requests for a bug
    @GetMapping("/requests/{id}")
    public ResponseEntity<?> getRequests(@PathVariable String id) {
        return bugService.getBugById(id)
                .map(bug -> ResponseEntity.ok(bug.getRequests() != null ? bug.getRequests() : new ArrayList<>()))
                .orElse(ResponseEntity.notFound().build());
    }

    // Upload file
    @PostMapping("/files/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir))
                Files.createDirectories(uploadDir);

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Attachment attachment = new Attachment(filename, file.getOriginalFilename(), file.getSize(), new Date());
            return ResponseEntity.ok(attachment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

    // Download file
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads", filename);
            File file = filePath.toFile();

            if (!file.exists())
                return ResponseEntity.notFound().build();

            byte[] fileContent = Files.readAllBytes(filePath);
            String contentType = determineContentType(filename);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error downloading file: " + e.getMessage());
        }
    }

    private String determineContentType(String filename) {
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return switch (ext) {
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "gif" -> "image/gif";
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls" -> "application/vnd.ms-excel";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "zip" -> "application/zip";
            case "rar" -> "application/x-rar-compressed";
            case "txt" -> "text/plain";
            default -> "application/octet-stream";
        };
    }
}
