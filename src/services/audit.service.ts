/**
 * Audit Log Service Layer
 * Handles audit log creation and retrieval.
 */

import { AuditLog, AuditLogFilters, PaginatedAuditLogs, CreateAuditLogRequest, AuditAction } from '@/types/auditLog';
import { apiPost, API_BASE_URL, getAuthHeaders, jwtService } from './util';

class AuditService {
  private getCurrentUser(): { id: string; email: string; name: string } | null {
    const user = jwtService.getStoredUser<{ id: string; email: string; firstName: string; lastName: string }>();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      };
    }
    return null;
  }

  async logAction(request: CreateAuditLogRequest): Promise<AuditLog | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: currentUser.id,
          userEmail: currentUser.email,
          action: request.action,
          details: request.details ? JSON.stringify(request.details) : null,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to log audit action:', request.action);
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        action: data.action as AuditAction,
        performedBy: {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        },
        targetUser: request.details?.targetUser as AuditLog['targetUser'],
        details: request.details,
        timestamp: data.createdAt,
        userAgent: data.userAgent,
      };
    } catch (error) {
      console.warn('Failed to log audit action:', error);
      return null;
    }
  }

  async getAuditLogs(filters: AuditLogFilters = {}): Promise<PaginatedAuditLogs> {
    const { action, performedById, page = 1, limit = 20 } = filters;

    const params = new URLSearchParams();
    if (action) params.append('action', action);
    if (performedById) params.append('userId', performedById);
    params.append('page', String(page - 1));
    params.append('limit', String(limit));

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        return { logs: [], total: 0, page, limit, totalPages: 0 };
      }

      const data = await response.json();

      const logs: AuditLog[] = (data.logs || []).map((log: any) => ({
        id: log.id,
        action: log.action as AuditAction,
        performedBy: {
          id: log.userId || '',
          email: log.userEmail || '',
          name: log.userEmail || '',
        },
        targetUser: undefined,
        details: log.details ? JSON.parse(log.details) : undefined,
        timestamp: log.createdAt,
        userAgent: log.userAgent,
      }));

      return {
        logs,
        total: data.total || 0,
        page: data.page || page,
        limit: data.limit || limit,
        totalPages: data.totalPages || 0,
      };
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return { logs: [], total: 0, page, limit, totalPages: 0 };
    }
  }

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

export const auditService = new AuditService();
