package com.bugbuster.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class RootController {

    @GetMapping("/")
    public String home() {
        return "BugBuster Backend is running!";
    }
}
