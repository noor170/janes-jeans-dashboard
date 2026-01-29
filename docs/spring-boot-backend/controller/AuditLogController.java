package com.janesjeans.controller;

import com.janesjeans.dto.AuditLogDTO;
import com.janesjeans.dto.CreateAuditLogRequest;
import com.janesjeans.dto.PaginatedAuditLogs;
import com.janesjeans.entity.AuditAction;
import com.janesjeans.entity.User;
import com.janesjeans.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<PaginatedAuditLogs> getAuditLogs(
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) String performedById,
            @RequestParam(required = false) String targetUserId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(auditLogService.getAuditLogs(
                action, performedById, targetUserId, startDate, endDate, page, limit
        ));
    }

    @PostMapping
    public ResponseEntity<AuditLogDTO> createAuditLog(
            @AuthenticationPrincipal User user,
            @RequestBody CreateAuditLogRequest request,
            HttpServletRequest httpRequest
    ) {
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        return ResponseEntity.ok(auditLogService.createLog(user, request, ipAddress, userAgent));
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
