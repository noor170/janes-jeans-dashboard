package com.janesjeans.service;

import com.janesjeans.dto.AuditLogDTO;
import com.janesjeans.dto.CreateAuditLogRequest;
import com.janesjeans.dto.PaginatedAuditLogs;
import com.janesjeans.entity.AuditAction;
import com.janesjeans.entity.AuditLog;
import com.janesjeans.entity.User;
import com.janesjeans.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditLogDTO createLog(User performer, CreateAuditLogRequest request, String ipAddress, String userAgent) {
        try {
            AuditLog log = AuditLog.builder()
                    .action(request.getAction())
                    .performedById(performer.getId())
                    .performedByEmail(performer.getEmail())
                    .performedByName(performer.getFirstName() + " " + performer.getLastName())
                    .targetUserId(request.getTargetUserId())
                    .targetUserEmail(request.getTargetUserEmail())
                    .targetUserName(request.getTargetUserName())
                    .details(request.getDetails() != null ? objectMapper.writeValueAsString(request.getDetails()) : null)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .build();

            AuditLog saved = auditLogRepository.save(log);
            return mapToDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create audit log", e);
        }
    }

    public PaginatedAuditLogs getAuditLogs(
            AuditAction action,
            String performedById,
            String targetUserId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int limit
    ) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "timestamp"));

        Page<AuditLog> logsPage = auditLogRepository.findWithFilters(
                action, performedById, targetUserId, startDate, endDate, pageRequest
        );

        return PaginatedAuditLogs.builder()
                .logs(logsPage.getContent().stream().map(this::mapToDTO).collect(Collectors.toList()))
                .total(logsPage.getTotalElements())
                .page(page)
                .limit(limit)
                .totalPages(logsPage.getTotalPages())
                .build();
    }

    private AuditLogDTO mapToDTO(AuditLog log) {
        Map<String, Object> details = null;
        if (log.getDetails() != null) {
            try {
                details = objectMapper.readValue(log.getDetails(), Map.class);
            } catch (Exception ignored) {}
        }

        return AuditLogDTO.builder()
                .id(log.getId())
                .action(log.getAction())
                .performedBy(AuditLogDTO.UserInfo.builder()
                        .id(log.getPerformedById())
                        .email(log.getPerformedByEmail())
                        .name(log.getPerformedByName())
                        .build())
                .targetUser(log.getTargetUserId() != null ? AuditLogDTO.UserInfo.builder()
                        .id(log.getTargetUserId())
                        .email(log.getTargetUserEmail())
                        .name(log.getTargetUserName())
                        .build() : null)
                .details(details)
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .timestamp(log.getTimestamp().toString())
                .build();
    }

    // Helper method to log actions
    public void logAction(User performer, AuditAction action, User targetUser, Map<String, Object> details, String ipAddress, String userAgent) {
        CreateAuditLogRequest request = new CreateAuditLogRequest();
        request.setAction(action);
        if (targetUser != null) {
            request.setTargetUserId(targetUser.getId());
            request.setTargetUserEmail(targetUser.getEmail());
            request.setTargetUserName(targetUser.getFirstName() + " " + targetUser.getLastName());
        }
        request.setDetails(details);
        createLog(performer, request, ipAddress, userAgent);
    }
}
