package com.janesjeans.api.service;

import com.janesjeans.api.entity.AuditLog;
import com.janesjeans.api.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceBackend {

    private final AuditLogRepository auditLogRepository;

    public AuditLog createLog(AuditLog log) {
        return auditLogRepository.save(log);
    }

    public Page<AuditLog> getAuditLogs(String action, String userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (action != null && !action.isEmpty()) {
            return auditLogRepository.findByAction(action, pageRequest);
        }
        if (userId != null && !userId.isEmpty()) {
            return auditLogRepository.findByUserId(userId, pageRequest);
        }
        return auditLogRepository.findAll(pageRequest);
    }
}
