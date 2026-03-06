package com.janesjeans.api.controller;

import com.janesjeans.api.entity.AuditLog;
import com.janesjeans.api.service.AuditLogServiceBackend;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Admin – Audit Logs", description = "Audit log viewing and creation (ADMIN / SUPER_ADMIN only)")
@SecurityRequirement(name = "bearerAuth")
public class AuditLogController {

    private final AuditLogServiceBackend auditLogService;

    @Operation(summary = "List audit logs", description = "Paginated list with optional action and userId filters")
    @ApiResponse(responseCode = "200", description = "Paginated audit logs with total, page, limit, and totalPages fields")
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

    @Operation(summary = "Create an audit log entry")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Log created", content = @Content(schema = @Schema(implementation = AuditLog.class))),
        @ApiResponse(responseCode = "400", description = "Invalid data", content = @Content)
    })
    @PostMapping
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog log) {
        return ResponseEntity.ok(auditLogService.createLog(log));
    }
}
