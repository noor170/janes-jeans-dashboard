import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const AppSidebar = ({ isCollapsed, setIsCollapsed }: AppSidebarProps) => {
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/inventory', icon: Package, label: t('inventory') },
    { path: '/orders', icon: ShoppingCart, label: t('orders') },
    { path: '/customers', icon: Users, label: t('customers') },
    { path: '/analytics', icon: BarChart3, label: t('analytics') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-primary">
              {t('janesJeans')}
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {t('adminDashboard')}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
