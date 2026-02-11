package com.janesjeans.api.controller;

import com.janesjeans.api.entity.AuditLog;
import com.janesjeans.api.service.AuditLogServiceBackend;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogServiceBackend auditLogService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AuditLog> result = auditLogService.getAuditLogs(action, userId, page, limit);
        Map<String, Object> response = new HashMap<>();
        response.put("logs", result.getContent());
        response.put("total", result.getTotalElements());
        response.put("page", result.getNumber() + 1);
        response.put("limit", result.getSize());
        response.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog log) {
        return ResponseEntity.ok(auditLogService.createLog(log));
    }
}
