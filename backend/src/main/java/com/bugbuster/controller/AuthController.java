package com.bugbuster.controller;

import com.bugbuster.service.UserService;
import com.bugbuster.dto.AuthResponse;
import com.bugbuster.dto.SigninRequest;
import com.bugbuster.dto.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest req) {
        return userService.signup(req);
    }

    @PostMapping("/signin")
    public AuthResponse signin(@RequestBody SigninRequest req) {
        return userService.signin(req);
    }

}
