package com.swarm.feedback.controller;

import com.swarm.feedback.model.Message;
import com.swarm.feedback.repository.MessageRepository;
import com.swarm.feedback.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody Message message) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        message.setSenderId(userDetails.getId());
        message.setSenderUsername(userDetails.getUsername());

        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping
    public ResponseEntity<?> getAllMessages() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Assuming authentication is already checked via security config, but getting
        // principal needs caution if anonymous
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(403).body(Map.of("message", "Admin access required"));
        }

        return ResponseEntity.ok(messageRepository.findAllByOrderByCreatedAtDesc());
    }
}
