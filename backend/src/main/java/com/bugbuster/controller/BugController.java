package com.bugbuster.controller;

import com.bugbuster.service.BugService;
import com.bugbuster.service.UserService;
import com.bugbuster.utils.JwtUtil;

import io.jsonwebtoken.Claims;

import com.bugbuster.model.Attachment;
import com.bugbuster.model.Bug;
import com.bugbuster.model.Comment;
import com.bugbuster.model.ImportedIssue;
import com.bugbuster.model.Project;
import com.bugbuster.repository.ImportedIssueRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    @Autowired
    private BugService bugService;
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ImportedIssueRepository importedIssueRepository;

    // Create Bug
    @PostMapping
    public Bug createBug(@RequestHeader("Authorization") String authHeader, @RequestBody Bug bug) {
        String userId = extractUserId(authHeader);
        bug.setCreatedBy(userId);
        bug.setCreatedAt(LocalDateTime.now());

        String urgency = bug.getUrgency();
        String severity = bug.getSeverity();

        int severityValue = getSeverityValue(severity.toUpperCase());
        int urgencyValue = getUrgencyValue(urgency.toUpperCase());
        String priority = "";

        int weightedScore = severityValue + urgencyValue;

        if (weightedScore >= 7) {
            priority = "P1";
        } else if (weightedScore >= 5) {
            priority = "P2";
        } else if (weightedScore >= 3) {
            priority = "P3";
        } else {
            priority = "P4";
        }

        bug.setPriority(priority);

        return bugService.createBug(bug);
    }

    // import github issues
    @PostMapping("/github-import")
    public ResponseEntity<Bug> importExternalBug(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authHeader) {

        String userId = extractUserId(authHeader);

        // Extract fields from the raw map
        Bug newBug = new Bug();
        newBug.setTitle((String) payload.get("title"));
        newBug.setDescription((String) payload.get("description"));
        newBug.setReproductionSteps((String) payload.get("reproductionSteps"));
        newBug.setExpectedOutcome((String) payload.get("expectedOutcome"));
        newBug.setActualOutcome((String) payload.get("actualOutcome"));
        newBug.setSeverity((String) payload.get("severity"));
        newBug.setUrgency((String) payload.get("urgency"));
        newBug.setState("OPEN");
        newBug.setProjectId((String) payload.get("projectId"));
        newBug.setFromGithub(true);
        newBug.setCreatedBy(userId);
        newBug.setCreatedAt(LocalDateTime.now());

        List<Object> attachmentsRaw = (List<Object>) payload.get("attachments");
        List<Attachment> processedAttachments = new ArrayList<>();

        if (attachmentsRaw != null) {
            for (Object obj : attachmentsRaw) {
                if (obj instanceof Map) {
                    Map<String, Object> attMap = (Map<String, Object>) obj;
                    String url = (String) attMap.get("url");
                    String type = (String) attMap.get("type");

                    if (url != null && !url.isBlank()) {
                        Attachment att = new Attachment();
                        att.setFilename(url);
                        att.setOriginalName(url);
                        att.setSize(0L);
                        att.setUploadedAt(LocalDateTime.now());
                        att.setType(type);
                        processedAttachments.add(att);
                    }
                }
            }
        }

        newBug.setAttachments(processedAttachments);

        String severity = (String) payload.get("severity");
        String urgency = (String) payload.get("urgency");

        String priority = "";
        int severityValue = getSeverityValue(severity.toUpperCase());
        int urgencyValue = getUrgencyValue(urgency.toUpperCase());
        int weightedScore = severityValue + urgencyValue;

        if (weightedScore >= 7) {
            priority = "P1";
        } else if (weightedScore >= 5) {
            priority = "P2";
        } else if (weightedScore >= 3) {
            priority = "P3";
        } else {
            priority = "P4";
        }

        newBug.setPriority(priority);

        Integer issueId = (Integer) payload.get("issueId");
        String state = (String) payload.getOrDefault("state", "OPEN");

        if (issueId != null) {

            newBug.setIssueId(issueId);

            ImportedIssue imported = new ImportedIssue();
            imported.setIssueId(issueId);
            imported.setStatus(state);
            imported.setProjectId((String) payload.get("projectId"));

            importedIssueRepository.save(imported);
        }

        Bug savedBug = bugService.createBug(newBug);
        return ResponseEntity.ok(savedBug);
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
    public ResponseEntity<?> updateBug(@PathVariable String id,
            @RequestBody Bug updatedBug,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<Bug> existingOpt = bugService.getBugById(id);
            if (existingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Bug existingBug = existingOpt.get();
            String userId = extractUserId(authHeader);

            if (!existingBug.getCreatedBy().equals(userId) && !isTester(authHeader)) {
                return ResponseEntity.status(403).body("Unauthorized to update this bug.");
            }

            if (updatedBug.getTitle() != null) existingBug.setTitle(updatedBug.getTitle());
            if (updatedBug.getDescription() != null) existingBug.setDescription(updatedBug.getDescription());
            if (updatedBug.getReproductionSteps() != null) existingBug.setReproductionSteps(updatedBug.getReproductionSteps());
            if (updatedBug.getExpectedOutcome() != null) existingBug.setExpectedOutcome(updatedBug.getExpectedOutcome());
            if (updatedBug.getActualOutcome() != null) existingBug.setActualOutcome(updatedBug.getActualOutcome());
            if (updatedBug.getSeverity() != null) existingBug.setSeverity(updatedBug.getSeverity());
            if (updatedBug.getUrgency() != null) existingBug.setUrgency(updatedBug.getUrgency());
            if (updatedBug.getPriority() != null) existingBug.setPriority(updatedBug.getPriority());
            if (updatedBug.getProjectId() != null) existingBug.setProjectId(updatedBug.getProjectId());
            if (updatedBug.getState() != null) existingBug.setState(updatedBug.getState());
            if (updatedBug.getAssignedTo() != null) existingBug.setAssignedTo(updatedBug.getAssignedTo());
            if (updatedBug.getAssignedBy() != null) existingBug.setAssignedBy(updatedBug.getAssignedBy());
            if (updatedBug.getAssignedAt() != null) existingBug.setAssignedAt(updatedBug.getAssignedAt());
            if (updatedBug.getResolvedAt() != null) existingBug.setResolvedAt(updatedBug.getResolvedAt());
            if (updatedBug.getResolvedBy() != null) existingBug.setResolvedBy(updatedBug.getResolvedBy());
            if (updatedBug.getClosedAt() != null) existingBug.setClosedAt(updatedBug.getClosedAt());
            if (updatedBug.getClosedBy() != null) existingBug.setClosedBy(updatedBug.getClosedBy());
            if (updatedBug.getAttachments() != null) existingBug.setAttachments(updatedBug.getAttachments());
            if (updatedBug.getComments() != null) existingBug.setComments(updatedBug.getComments());
            if (updatedBug.isFromGithub()) existingBug.setFromGithub(true);

            Bug savedBug = bugService.updateBug(existingBug);

            return ResponseEntity.ok(savedBug);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update bug: " + e.getMessage());
        }
    }

    // Delete Bug
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBug(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        Optional<Bug> bug = bugService.getBugById(id);
        if (bug.isEmpty())
            return ResponseEntity.notFound().build();

        String userId = extractUserId(authHeader);
        if (!bug.get().getCreatedBy().equals(userId) && !isTester(authHeader)) {
            return ResponseEntity.status(403).build();
        }

        bugService.deleteBug(id);
        return ResponseEntity.ok().build();
    }

    // Close Bug
    @PatchMapping("/close/{id}")
    public ResponseEntity<?> closeBug(@PathVariable String id,
            @RequestParam String closedBy, @RequestParam String closeMessage,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isTester(authHeader)) {
                return ResponseEntity.status(403).body("Only testers can close bugs.");
            }

            Optional<Bug> bugOpt = bugService.getBugById(id);
            if (bugOpt.isEmpty())
                return ResponseEntity.notFound().build();

            Bug bug = bugOpt.get();

            if (!"RESOLVED".equalsIgnoreCase(bug.getState())) {
                return ResponseEntity.badRequest().body("Bug must be in RESOLVED state to be closed.");
            }

            if (!closedBy.equals(bug.getTesterAssignedTo())) {
                return ResponseEntity.status(403).body("Only the assigned tester can close this bug.");
            }

            if (closeMessage == null || closeMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Close message must not be empty.");
            }

            String fullMessage = "[" + LocalDateTime.now() + "] " + closeMessage;

            bug.setState("CLOSED");
            bug.setClosedBy(closedBy);
            bug.setClosedAt(LocalDateTime.now());
            bug.getCloseMessages().add(fullMessage);

            return ResponseEntity.ok(bugService.updateBug(bug));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to close bug: " + e.getMessage());
        }
    }

    // Assign and Reassign Bugs
    @PatchMapping("/assign/{id}")
    public ResponseEntity<?> assignBugToDeveloper(
            @PathVariable String id,
            @RequestParam String developerId,
            @RequestParam double estimatedHours,
            @RequestParam String assignMessage,
            @RequestHeader("Authorization") String authHeader) {

        try {
            if (!isTester(authHeader)) {
                return ResponseEntity.status(403).body("Only managers or testers can assign bugs.");
            }

            Optional<Bug> bugOpt = bugService.getBugById(id);
            if (bugOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Bug not found");
            }

            Bug bug = bugOpt.get();

            if (!(bug.getState().equalsIgnoreCase("OPEN") || bug.getState().equalsIgnoreCase("RESOLVED"))) {
                return ResponseEntity.status(400).body("Bug can only be assigned if it's in OPEN or can be reassigned if it's in RESOLVED state.");
            }

            String fullMessage = "[" + LocalDateTime.now() + "] " + assignMessage;
            if (bug.getAssignmentMessages() == null) {
                bug.setAssignmentMessages(new ArrayList<>());
            }

            String assignedBy = extractUserId(authHeader);
            bug.setAssignedTo(developerId);
            bug.setAssignedBy(assignedBy);
            bug.setAssignedAt(LocalDateTime.now());
            bug.setState("IN_PROGRESS");
            bug.setEstimatedHours(estimatedHours);
            bug.getAssignmentMessages().add(fullMessage);

            if(bug.getState().equalsIgnoreCase("RESOLVED")){
                bug.setResolvedAt(null);
                bug.setResolvedBy(null);
            }

            return ResponseEntity.ok(bugService.updateBug(bug));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to assign bug: " + e.getMessage());
        }
    }

    // Start Working Route
    @PatchMapping("/start-working/{id}")
    public ResponseEntity<?> startWorkOnBug(
            @PathVariable String id,
            @RequestParam double estimatedHours,
            @RequestHeader("Authorization") String authHeader) {

        try {
            if (!isDeveloper(authHeader)) {
                return ResponseEntity.status(403).body("Only developers can start work on bugs.");
            }

            Optional<Bug> bugOpt = bugService.getBugById(id);
            if (bugOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Bug not found");
            }

            Bug bug = bugOpt.get();

            if (!bug.getState().equalsIgnoreCase("OPEN")) {
                return ResponseEntity.badRequest().body("Bug must be in OPEN state to start working on it.");
            }

            String userId = extractUserId(authHeader);

            bug.setAssignedTo(userId);
            bug.setAssignedBy(userId);
            bug.setAssignedAt(LocalDateTime.now());
            bug.setState("IN_PROGRESS");
            bug.setEstimatedHours(estimatedHours);

            Bug updatedBug = bugService.updateBug(bug);

            return ResponseEntity.ok(updatedBug);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to start bug: " + e.getMessage());
        }
    }

    // resolve the bug
    @PatchMapping("/resolve/{id}")
    public ResponseEntity<?> resolveBug(
            @PathVariable String id,
            @RequestParam String resolveMessage,
            @RequestParam double spentHours,
            @RequestParam String testerId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserId(authHeader);

            Optional<Bug> bugOpt = bugService.getBugById(id);
            if (bugOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Bug bug = bugOpt.get();

            if (!userId.equals(bug.getAssignedTo())) {
                return ResponseEntity.status(403).body("Only the assigned developer can resolve this bug.");
            }

            if (!"IN_PROGRESS".equalsIgnoreCase(bug.getState())) {
                return ResponseEntity.badRequest().body("Bug must be IN_PROGRESS to be resolved.");
            }

            if (resolveMessage == null || resolveMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Resolve message must not be empty.");
            }

            if (bug.getResolveMessages() == null) {
                bug.setResolveMessages(new ArrayList<>());
            }

            String fullMessage = "[" + LocalDateTime.now() + "] " + resolveMessage;

            bug.setState("RESOLVED");
            bug.setResolvedAt(LocalDateTime.now());
            bug.setResolvedBy(userId);
            bug.getResolveMessages().add(fullMessage);
            bug.setSpentHours(spentHours);
            bug.setTesterAssignedTo(testerId);

            return ResponseEntity.ok(bugService.updateBug(bug));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to resolve bug: " + e.getMessage());
        }
    }

    // Get all Bugs
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugService.getAllBugs();
    }

    // Get all bugs of user
    @GetMapping("/all")
    public ResponseEntity<?> getAllBugsForUserProjects(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserId(authHeader);

            List<Project> userProjects = userService.getProjectsByCreatorOrMember(userId);

            List<String> projectIds = userProjects.stream()
                    .map(Project::getId)
                    .toList();

            List<Bug> bugs = bugService.getBugsByProjectIds(projectIds);

            return ResponseEntity.ok(bugs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching bugs: " + e.getMessage());
        }
    }

    // Get recent bugs of user
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentBugsForUserProjects(@RequestParam(defaultValue = "3") int n,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = extractUserId(authHeader);

            List<Project> userProjects = userService.getProjectsByCreatorOrMember(userId);
            List<String> projectIds = userProjects.stream()
                    .map(Project::getId)
                    .toList();

            List<Bug> bugs = bugService.getBugsByProjectIds(projectIds);

            bugs.sort((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()));

            List<Bug> recentBugs = bugs.stream().limit(n).toList();

            return ResponseEntity.ok(recentBugs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching recent bugs: " + e.getMessage());
        }
    }

    // Get Bugs by Project
    @GetMapping("/project/{projectId}")
    public List<Bug> getBugsByProject(@PathVariable String projectId,
            @RequestParam(required = false) Boolean fromGithub) {
        return bugService.getBugsByProject(projectId, fromGithub);
    }

    // Get Bugs assigned to current user
    @GetMapping("/assigned")
    public List<Bug> getAssignedBugs(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        return bugService.getAllBugs().stream()
                .filter(bug -> userId.equalsIgnoreCase(bug.getAssignedTo()))
                .collect(Collectors.toList());
    }

    @GetMapping("/close-requests")
    public List<Bug> getCloseRequestsForTester(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        return bugService.getAllBugs().stream()
                .filter(bug -> userId.equalsIgnoreCase(bug.getTesterAssignedTo()))
                .collect(Collectors.toList());
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

            Attachment attachment = new Attachment(filename, file.getOriginalFilename(), file.getSize(),
                    LocalDateTime.now(), null);
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

    // Comment on Bug
    @PostMapping("/comments/{id}")
    public ResponseEntity<?> addComment(@PathVariable String id,
            @RequestBody Comment comment,
            @RequestHeader("Authorization") String authHeader) {
        Optional<Bug> bugOpt = bugService.getBugById(id);
        if (bugOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bug not found");
        }

        Bug bug = bugOpt.get();

        if (bug.getComments() == null) {
            bug.setComments(new ArrayList<>());
        }

        comment.setAuthor(extractUserId(authHeader));
        comment.setTimestamp(LocalDateTime.now());

        bug.getComments().add(comment);
        bugService.updateBug(bug);

        return ResponseEntity.ok("Comment added successfully");
    }

    // Get All Comments
    @GetMapping("/comments/{id}")
    public ResponseEntity<?> getComments(@PathVariable String id) {
        Optional<Bug> bugOpt = bugService.getBugById(id);

        if (bugOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bug not found");
        }

        List<Comment> comments = bugOpt.get().getComments();

        if (comments == null) {
            comments = new ArrayList<>();
        } else {
            // Sort by timestamp descending (newest first)
            comments.sort((c1, c2) -> c2.getTimestamp().compareTo(c1.getTimestamp()));
        }

        return ResponseEntity.ok(comments);
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

    private String extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractAllClaims(token);
        return claims.getSubject();
    }

    private boolean isTester(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractAllClaims(token);
        Object role = claims.get("role");

        if (role instanceof String) {
            return Arrays.asList(((String) role).split(",")).contains("TESTER");
        } else if (role instanceof List) {
            return ((List<?>) role).contains("TESTER");
        }
        return false;
    }

    private boolean isDeveloper(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractAllClaims(token);
        Object role = claims.get("role");

        if (role instanceof String) {
            return Arrays.asList(((String) role).split(",")).contains("DEVELOPER");
        } else if (role instanceof List) {
            return ((List<?>) role).contains("DEVELOPER");
        }
        return false;
    }

    private int getUrgencyValue(String urgency) {
        int urgencyValue;
        switch (urgency.toUpperCase()) {
            case "URGENT":
                urgencyValue = 4;
                break;
            case "HIGH":
                urgencyValue = 3;
                break;
            case "MEDIUM":
                urgencyValue = 2;
                break;
            case "LOW":
                urgencyValue = 1;
                break;
            default:
                urgencyValue = 0;
        }
        return urgencyValue;
    }

    private int getSeverityValue(String severity) {
        int severityValue;
        switch (severity.toUpperCase()) {
            case "CRITICAL":
                severityValue = 4;
                break;
            case "HIGH":
                severityValue = 3;
                break;
            case "MEDIUM":
                severityValue = 2;
                break;
            case "LOW":
                severityValue = 1;
                break;
            default:
                severityValue = 0;
        }
        return severityValue;
    }
}
