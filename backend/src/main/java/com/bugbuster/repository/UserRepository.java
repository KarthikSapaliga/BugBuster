package com.bugbuster.repository;

import com.bugbuster.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(String role);

    List<User> findByRoleIn(List<String> roles);

    @Query("{ 'role': 'DEVELOPER', '_id': { $in: ?0 } }")
    List<User> findDevelopersInTeam(List<String> userIds);
}
