export type AuditAction = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ACTIVATED'
  | 'USER_DEACTIVATED'
  | 'USER_ROLE_CHANGED'
  | 'PASSWORD_RESET'
  | 'ADMIN_CREATED';

export interface AuditLog {
  id: string;
  action: AuditAction;
  performedBy: {
    id: string;
    email: string;
    name: string;
  };
  targetUser?: {
    id: string;
    email: string;
    name: string;
  };
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogFilters {
  action?: AuditAction;
  performedById?: string;
  targetUserId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogs {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateAuditLogRequest {
  action: AuditAction;
  targetUserId?: string;
  details?: Record<string, unknown>;
}
