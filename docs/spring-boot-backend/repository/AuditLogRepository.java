package com.janesjeans.repository;

import com.janesjeans.entity.AuditAction;
import com.janesjeans.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    Page<AuditLog> findByAction(AuditAction action, Pageable pageable);

    Page<AuditLog> findByPerformedById(String performedById, Pageable pageable);

    Page<AuditLog> findByTargetUserId(String targetUserId, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:performedById IS NULL OR a.performedById = :performedById) AND " +
           "(:targetUserId IS NULL OR a.targetUserId = :targetUserId) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate)")
    Page<AuditLog> findWithFilters(
            @Param("action") AuditAction action,
            @Param("performedById") String performedById,
            @Param("targetUserId") String targetUserId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
