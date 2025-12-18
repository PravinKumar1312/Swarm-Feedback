package com.swarm.feedback.repository;

import com.swarm.feedback.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findAllByOrderByCreatedAtDesc();

    List<Message> findBySenderId(String senderId);
}
