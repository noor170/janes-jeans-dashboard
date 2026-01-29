import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RefreshControlsProps {
  queryKeys: string[][];
  className?: string;
}

const REFRESH_INTERVALS = [
  { value: 0, label: { en: 'Off', bn: 'বন্ধ' } },
  { value: 15, label: { en: '15 seconds', bn: '১৫ সেকেন্ড' } },
  { value: 30, label: { en: '30 seconds', bn: '৩০ সেকেন্ড' } },
  { value: 60, label: { en: '1 minute', bn: '১ মিনিট' } },
  { value: 300, label: { en: '5 minutes', bn: '৫ মিনিট' } },
];

const RefreshControls = ({ queryKeys, className }: RefreshControlsProps) => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all(
        queryKeys.map(key => queryClient.invalidateQueries({ queryKey: key }))
      );
      setLastRefresh(new Date());
      toast.success(language === 'en' ? 'Data refreshed' : 'ডেটা রিফ্রেশ হয়েছে');
    } catch (error) {
      toast.error(language === 'en' ? 'Refresh failed' : 'রিফ্রেশ ব্যর্থ');
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, queryKeys, language]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefreshInterval === 0) return;

    const intervalId = setInterval(() => {
      handleRefresh();
    }, autoRefreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefreshInterval, handleRefresh]);

  const formatLastRefresh = () => {
    if (!lastRefresh) return null;
    const seconds = Math.floor((Date.now() - lastRefresh.getTime()) / 1000);
    if (seconds < 60) {
      return language === 'en' ? `${seconds}s ago` : `${seconds} সেকেন্ড আগে`;
    }
    const minutes = Math.floor(seconds / 60);
    return language === 'en' ? `${minutes}m ago` : `${minutes} মিনিট আগে`;
  };

  const currentInterval = REFRESH_INTERVALS.find(i => i.value === autoRefreshInterval);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Last refresh indicator */}
      {lastRefresh && (
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {formatLastRefresh()}
        </span>
      )}

      {/* Manual Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="gap-2"
      >
        <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
        <span className="hidden sm:inline">
          {language === 'en' ? 'Refresh' : 'রিফ্রেশ'}
        </span>
      </Button>

      {/* Auto-refresh Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={autoRefreshInterval > 0 ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            {autoRefreshInterval > 0 ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {language === 'en' ? 'Auto' : 'স্বয়ংক্রিয়'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {language === 'en' ? 'Auto-refresh interval' : 'স্বয়ংক্রিয় রিফ্রেশ'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {REFRESH_INTERVALS.map((interval) => (
            <DropdownMenuItem
              key={interval.value}
              onClick={() => setAutoRefreshInterval(interval.value)}
              className={cn(
                autoRefreshInterval === interval.value && 'bg-accent'
              )}
            >
              {autoRefreshInterval === interval.value && (
                <span className="mr-2">✓</span>
              )}
              {interval.label[language === 'bn' ? 'bn' : 'en']}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Auto-refresh active indicator */}
      {autoRefreshInterval > 0 && (
        <span className="text-xs text-primary hidden md:inline">
          {language === 'en' ? 
            `Every ${currentInterval?.label.en}` : 
            `প্রতি ${currentInterval?.label.bn}`
          }
        </span>
      )}
    </div>
  );
};

export default RefreshControls;
