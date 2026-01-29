import { AuditLog, AuditLogFilters, PaginatedAuditLogs, CreateAuditLogRequest, AuditAction } from '@/types/auditLog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// In-memory store for demo (replace with actual API calls when backend is ready)
let auditLogsStore: AuditLog[] = [];

class AuditLogService {
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getCurrentUser(): { id: string; email: string; name: string } | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
      } catch {
        return null;
      }
    }
    return null;
  }

  // Log an action (uses mock store for demo, can be switched to API)
  async logAction(request: CreateAuditLogRequest): Promise<AuditLog | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const log: AuditLog = {
      id: `LOG${Date.now()}`,
      action: request.action,
      performedBy: currentUser,
      targetUser: request.details?.targetUser as AuditLog['targetUser'],
      details: request.details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // For demo: store locally
    auditLogsStore.unshift(log);

    // When backend is ready, use this:
    // try {
    //   const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, {
    //     method: 'POST',
    //     headers: this.getAuthHeaders(),
    //     body: JSON.stringify(request),
    //   });
    //   return await response.json();
    // } catch (error) {
    //   console.error('Failed to log action:', error);
    //   return null;
    // }

    return log;
  }

  // Get audit logs with filters
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<PaginatedAuditLogs> {
    const { action, performedById, targetUserId, startDate, endDate, page = 1, limit = 20 } = filters;

    // For demo: filter from local store
    let filteredLogs = [...auditLogsStore];

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }
    if (performedById) {
      filteredLogs = filteredLogs.filter(log => log.performedBy.id === performedById);
    }
    if (targetUserId) {
      filteredLogs = filteredLogs.filter(log => log.targetUser?.id === targetUserId);
    }
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }

    const total = filteredLogs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);

    return {
      logs: paginatedLogs,
      total,
      page,
      limit,
      totalPages,
    };

    // When backend is ready, use this:
    // const params = new URLSearchParams();
    // if (action) params.append('action', action);
    // if (performedById) params.append('performedById', performedById);
    // if (targetUserId) params.append('targetUserId', targetUserId);
    // if (startDate) params.append('startDate', startDate);
    // if (endDate) params.append('endDate', endDate);
    // params.append('page', page.toString());
    // params.append('limit', limit.toString());
    //
    // const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs?${params}`, {
    //   headers: this.getAuthHeaders(),
    // });
    // return await response.json();
  }

  // Helper to get action display label
  getActionLabel(action: AuditAction): string {
    const labels: Record<AuditAction, string> = {
      USER_LOGIN: 'User Login',
      USER_LOGOUT: 'User Logout',
      USER_CREATED: 'User Created',
      USER_UPDATED: 'User Updated',
      USER_DELETED: 'User Deleted',
      USER_ACTIVATED: 'User Activated',
      USER_DEACTIVATED: 'User Deactivated',
      USER_ROLE_CHANGED: 'Role Changed',
      PASSWORD_RESET: 'Password Reset',
      ADMIN_CREATED: 'Admin Created',
    };
    return labels[action] || action;
  }

  // Helper to get action severity
  getActionSeverity(action: AuditAction): 'info' | 'warning' | 'error' | 'success' {
    const severity: Record<AuditAction, 'info' | 'warning' | 'error' | 'success'> = {
      USER_LOGIN: 'info',
      USER_LOGOUT: 'info',
      USER_CREATED: 'success',
      USER_UPDATED: 'info',
      USER_DELETED: 'error',
      USER_ACTIVATED: 'success',
      USER_DEACTIVATED: 'warning',
      USER_ROLE_CHANGED: 'warning',
      PASSWORD_RESET: 'warning',
      ADMIN_CREATED: 'success',
    };
    return severity[action] || 'info';
  }
}

export const auditLogService = new AuditLogService();
