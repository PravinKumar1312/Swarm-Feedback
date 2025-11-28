package com.swarm.feedback.service;

import com.swarm.feedback.model.ActivityLog;
import java.util.List;
import java.util.Map;

public interface ActivityLogService {
    void logActivity(String userId, String actionType, Map<String, Object> details);

    List<ActivityLog> getLogsByUserId(String userId);
}
