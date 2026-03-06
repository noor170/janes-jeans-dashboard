import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ShopCategory } from '@/data/shopProducts';
import { Briefcase, Droplets, Scissors, Palette, Gem, Heart, Shirt, Package } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Briefcase, Droplets, Scissors, Palette, Gem, Heart, Shirt, Package,
};

interface CategoryNavProps {
  selected: string;
  onSelect: (categorySlug: string) => void;
}

export function CategoryNav({ selected, onSelect }: CategoryNavProps) {
  const [categories, setCategories] = useState<ShopCategory[]>([]);

  useEffect(() => {
    supabase
      .from('shop_categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as unknown as ShopCategory[]);
      });
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors',
          selected === 'all'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-card text-foreground border-border hover:bg-accent'
        )}
      >
        <Package className="h-4 w-4" />
        All
      </button>
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] || Package;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors',
              selected === cat.slug
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:bg-accent'
            )}
          >
            <Icon className="h-4 w-4" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
