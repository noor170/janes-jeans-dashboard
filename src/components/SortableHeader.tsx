import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { SortDirection } from '@/hooks/useSorting';
import { cn } from '@/lib/utils';

interface SortableHeaderProps {
  children: React.ReactNode;
  sortDirection: SortDirection;
  onClick: () => void;
  className?: string;
}

const SortableHeader = ({ children, sortDirection, onClick, className }: SortableHeaderProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 hover:text-foreground transition-colors group',
        className
      )}
    >
      {children}
      <span className="inline-flex">
        {sortDirection === 'asc' ? (
          <ArrowUp className="h-4 w-4 text-primary" />
        ) : sortDirection === 'desc' ? (
          <ArrowDown className="h-4 w-4 text-primary" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </span>
    </button>
  );
};

export default SortableHeader;
