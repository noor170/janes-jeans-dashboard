import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Activity,
  TrendingUp,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { authApi } from '@/lib/authApi';
import { auditLogService } from '@/lib/auditLogService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => authApi.getAllUsers(),
  });

  const { data: auditData, refetch: refetchLogs } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: () => auditLogService.getAuditLogs({ limit: 10 }),
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    inactiveUsers: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length,
    regularUsers: users.filter(u => u.role === 'USER').length,
    recentSignups: users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length,
  };

  const handleRefresh = () => {
    refetchUsers();
    refetchLogs();
  };

  const getActionBadge = (action: string) => {
    const severity = auditLogService.getActionSeverity(action as any);
    const variants: Record<string, string> = {
      info: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      warning: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      error: 'bg-red-500/10 text-red-500 border-red-500/30',
    };
    return (
      <Badge variant="outline" className={cn('text-xs', variants[severity])}>
        {auditLogService.getActionLabel(action as any)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of users and system activity
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="rounded-lg p-2 bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.recentSignups} new this week
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <div className="rounded-lg p-2 bg-emerald-500/10 text-emerald-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.inactiveUsers} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administrators
            </CardTitle>
            <div className="rounded-lg p-2 bg-blue-500/10 text-blue-500">
              <Shield className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins + stats.superAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.superAdmins} super admins
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regular Users
            </CardTitle>
            <div className="rounded-lg p-2 bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regularUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.regularUsers / (stats.totalUsers || 1)) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest admin actions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/audit-logs')}>
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {auditData?.logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Activity className="h-10 w-10 mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditData?.logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="mt-0.5">
                      {getActionBadge(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {log.performedBy.name}
                      </p>
                      {log.targetUser && (
                        <p className="text-xs text-muted-foreground truncate">
                          → {log.targetUser.name}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              User Distribution
            </CardTitle>
            <CardDescription>Breakdown by role and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Role Distribution */}
              <div>
                <h4 className="text-sm font-medium mb-3">By Role</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500" />
                      <span className="text-sm">Super Admins</span>
                    </div>
                    <span className="font-medium">{stats.superAdmins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Admins</span>
                    </div>
                    <span className="font-medium">{stats.admins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                      <span className="text-sm">Users</span>
                    </div>
                    <span className="font-medium">{stats.regularUsers}</span>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div>
                <h4 className="text-sm font-medium mb-3">By Status</h4>
                <div className="h-4 rounded-full overflow-hidden bg-muted flex">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${(stats.activeUsers / (stats.totalUsers || 1)) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 transition-all"
                    style={{ width: `${(stats.inactiveUsers / (stats.totalUsers || 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active ({stats.activeUsers})
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Inactive ({stats.inactiveUsers})
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
                    <Users className="h-4 w-4 mr-1" />
                    Manage Users
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin/audit-logs')}>
                    <Activity className="h-4 w-4 mr-1" />
                    View Logs
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
