package com.janesjeans.dto;

import com.janesjeans.entity.AuditAction;
import lombok.Data;

import java.util.Map;

@Data
public class CreateAuditLogRequest {
    private AuditAction action;
    private String targetUserId;
    private String targetUserEmail;
    private String targetUserName;
    private Map<String, Object> details;
}
