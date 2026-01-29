package com.janesjeans.dto;

import com.janesjeans.entity.AuditAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    private String id;
    private AuditAction action;
    private UserInfo performedBy;
    private UserInfo targetUser;
    private Map<String, Object> details;
    private String ipAddress;
    private String userAgent;
    private String timestamp;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String email;
        private String name;
    }
}
