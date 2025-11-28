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
        // Create SysAdmin User if not exists
        if (!userRepository.existsByUsername("sysadmin")) {
            User admin = new User();
            admin.setUsername("sysadmin");
            admin.setEmail("sysadmin@swarm.com");
            admin.setPasswordHash(encoder.encode("sysadmin123"));
            admin.setName("System Administrator");

            Set<String> roles = new HashSet<>();
            roles.add("ROLE_ADMIN");
            roles.add("ROLE_SUBMITTER");
            roles.add("ROLE_REVIEWER");
            admin.setRoles(roles);

            userRepository.save(admin);
            System.err.println("SysAdmin user created: sysadmin / sysadmin123");
        } else {
            System.err.println("SysAdmin user already exists");
        }
    }
}
