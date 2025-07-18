package com.bugbuster.service;

import com.bugbuster.model.Bug;
import com.bugbuster.repository.BugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BugService {

    @Autowired
    private BugRepository bugRepository;

    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }

    public Bug updateBug(Bug bug) {
        return bugRepository.save(bug);
    }

    public void deleteBug(String id) {
        bugRepository.deleteById(id);
    }

    public Optional<Bug> getBugById(String id) {
        return bugRepository.findById(id);
    }

    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    public List<Bug> getBugsByProject(String projectId, Boolean fromGithub) {
        if (fromGithub != null) {
            return bugRepository.findByProjectIdAndFromGithub(projectId, fromGithub);
        } else {
            return bugRepository.findByProjectId(projectId);
        }
    }

    public List<Bug> getBugsAssignedTo(String userId) {
        return bugRepository.findByAssignedTo(userId);
    }

    public List<Bug> getBugsCreatedBy(String userId) {
        return bugRepository.findByCreatedBy(userId);
    }
}
