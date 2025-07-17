package com.bugbuster.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String role; // MANAGER, TESTER, DEVELOPER
}
