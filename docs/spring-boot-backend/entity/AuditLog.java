package com.janesjeans.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(name = "performed_by_id", nullable = false)
    private String performedById;

    @Column(name = "performed_by_email", nullable = false)
    private String performedByEmail;

    @Column(name = "performed_by_name", nullable = false)
    private String performedByName;

    @Column(name = "target_user_id")
    private String targetUserId;

    @Column(name = "target_user_email")
    private String targetUserEmail;

    @Column(name = "target_user_name")
    private String targetUserName;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
