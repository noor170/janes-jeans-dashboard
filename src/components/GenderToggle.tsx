import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { GenderFilter } from '@/types';
import { cn } from '@/lib/utils';

const GenderToggle = () => {
  const { t } = useLanguage();
  const { genderFilter, setGenderFilter } = useGenderFilter();

  const options: { value: GenderFilter; label: string }[] = [
    { value: 'Men', label: t('men') },
    { value: 'Women', label: t('women') },
    { value: 'All', label: t('all') },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">{t('filterBy')}:</span>
      </div>
      <div className="flex rounded-lg border bg-muted p-1">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => setGenderFilter(option.value)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition-all',
              genderFilter === option.value
                ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground'
                : 'text-muted-foreground hover:bg-transparent hover:text-foreground'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenderToggle;
