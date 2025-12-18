package com.swarm.feedback.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.swarm.feedback.model.User;
import com.swarm.feedback.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User user = new User();
            user.setUsername("admin");
            user.setEmail("admin@example.com");
            user.setPasswordHash(encoder.encode("admin123"));
            user.setName("Admin User");
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_ADMIN");
            user.setRoles(roles);
            userRepository.save(user);
            System.out.println("Admin user created: admin / admin123");
        }
    }
}
