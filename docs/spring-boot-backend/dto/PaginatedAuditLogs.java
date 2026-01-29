package com.janesjeans.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedAuditLogs {
    private List<AuditLogDTO> logs;
    private long total;
    private int page;
    private int limit;
    private int totalPages;
}
