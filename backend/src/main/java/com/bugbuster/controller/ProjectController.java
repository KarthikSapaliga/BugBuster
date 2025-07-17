package com.bugbuster.controller;

import com.bugbuster.dto.ProjectRequest;
import com.bugbuster.model.Project;
import com.bugbuster.service.ProjectService;
import com.bugbuster.utils.JwtUtil;
import io.jsonwebtoken.Claims;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create-project")
    public Project createProject(@RequestBody ProjectRequest req,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractAllClaims(token);

        String role = claims.get("role", String.class);
        String userId = claims.getSubject();

        if (!"MANAGER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied: only MANAGER can create projects.");
        }

        return projectService.createProject(req, userId);
    }

    @GetMapping("/my-projects")
    public List<Project> getMyProjects(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractAllClaims(token);
        String userId = claims.getSubject();

        return projectService.getProjectsByUserId(userId);
    }

    @PutMapping("/update-project/{projectId}")
    public Project updateProject(
            @PathVariable String projectId,
            @RequestBody ProjectRequest req,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.extractAllClaims(token);

        String role = claims.get("role", String.class);

        if (!"MANAGER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied: only MANAGER can update projects.");
        }

        return projectService.updateProject(projectId, req);
    }

    @GetMapping("/get-by-id/{id}")
    public Project getProjectById(@PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        return projectService.getProjectById(id);
    }

}
