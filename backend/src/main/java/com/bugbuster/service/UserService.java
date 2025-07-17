package com.bugbuster.service;

import com.bugbuster.model.User;
import com.bugbuster.repository.UserRepository;
import com.bugbuster.utils.JwtUtil;
import com.bugbuster.dto.SignupRequest;
import com.bugbuster.dto.AuthResponse;
import com.bugbuster.dto.SigninRequest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthResponse signin(SigninRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user);
    }

    public AuthResponse signup(SignupRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        User newUser = new User();
        newUser.setName(req.getName());
        newUser.setEmail(req.getEmail());
        newUser.setRole(req.getRole().toUpperCase());
        newUser.setPassword(encoder.encode(req.getPassword()));

        User savedUser = userRepo.save(newUser);
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        return new AuthResponse(token, savedUser);
    }

    public List<User> getDevelopers() {
        return userRepo.findByRole("DEVELOPER");
    }

    public List<User> getDevelopersAndTesters() {
        return userRepo.findByRoleIn(List.of("DEVELOPER", "TESTER"));
    }

    public User getUserById(String id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

}
