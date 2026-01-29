import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'lg:block',
          isMobileOpen ? 'block' : 'hidden'
        )}
      >
        <AppSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <DashboardHeader
          onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
          isSidebarCollapsed={isCollapsed}
        />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
