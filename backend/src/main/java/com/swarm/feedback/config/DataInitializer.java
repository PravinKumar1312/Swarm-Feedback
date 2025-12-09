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
        // Default users are no longer created automatically.
        // The database will be cleared manually or via a separate process if needed.
        // userRepository.deleteAll(); // Uncomment if you want to wipe the DB on
        // startup
    }
}
