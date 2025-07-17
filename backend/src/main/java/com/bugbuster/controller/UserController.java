package com.bugbuster.controller;

import com.bugbuster.model.User;
import com.bugbuster.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/developers")
    public List<User> getDevelopers() {
        return userService.getDevelopers();
    }

    @GetMapping("/devs-and-testers")
    public List<User> getDevelopersAndTesters() {
        return userService.getDevelopersAndTesters();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

}
