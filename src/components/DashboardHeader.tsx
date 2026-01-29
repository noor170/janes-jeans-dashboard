import GenderToggle from '@/components/GenderToggle';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

const DashboardHeader = ({ onMenuClick, isSidebarCollapsed }: DashboardHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {isSidebarCollapsed && (
          <span className="hidden text-lg font-bold text-primary lg:block">
            {t('janesJeans')}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <GenderToggle />
        <ThemeToggle />
        <div className="hidden md:block">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
