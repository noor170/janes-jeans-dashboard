import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const placeholderText = language === 'en' ? 'Filter by date' : 'তারিখ অনুসারে ফিল্টার';
  
  const formatDateRange = () => {
    if (!dateRange?.from) return placeholderText;
    if (!dateRange.to) return format(dateRange.from, 'MMM dd, yyyy');
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
  };

  const hasDateRange = dateRange?.from || dateRange?.to;

  return (
    <div className="flex items-center gap-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal gap-2',
              !hasDateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{formatDateRange()}</span>
            <span className="sm:hidden">
              {hasDateRange ? format(dateRange!.from!, 'MM/dd') : <CalendarIcon className="h-4 w-4" />}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              onDateRangeChange(range);
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {hasDateRange && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDateRangeChange(undefined)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
