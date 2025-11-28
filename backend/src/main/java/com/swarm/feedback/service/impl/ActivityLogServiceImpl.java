package com.swarm.feedback.service.impl;

import com.swarm.feedback.model.ActivityLog;
import com.swarm.feedback.repository.ActivityLogRepository;
import com.swarm.feedback.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Override
    public void logActivity(String userId, String actionType, Map<String, Object> details) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setActionType(actionType);
        log.setDetails(details);
        activityLogRepository.save(log);
    }

    @Override
    public List<ActivityLog> getLogsByUserId(String userId) {
        return activityLogRepository.findByUserId(userId);
    }
}
