import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, SlidersHorizontal } from 'lucide-react';
import { categoryFilterConfig, priceRanges } from '@/data/shopProducts';
import { supabase } from '@/integrations/supabase/client';

interface SubcategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface DynamicFilterSidebarProps {
  category: string;
  priceRange: string;
  subcategory: string;
  metadataFilters: Record<string, any>;
  onPriceRangeChange: (v: string) => void;
  onSubcategoryChange: (v: string) => void;
  onMetadataFilterChange: (key: string, value: any) => void;
  onClearAll: () => void;
}

export function DynamicFilterSidebar({
  category,
  priceRange,
  subcategory,
  metadataFilters,
  onPriceRangeChange,
  onSubcategoryChange,
  onMetadataFilterChange,
  onClearAll,
}: DynamicFilterSidebarProps) {
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const filters = categoryFilterConfig[category] || [];

  useEffect(() => {
    if (category === 'all') {
      setSubcategories([]);
      return;
    }
    supabase
      .from('shop_subcategories')
      .select('*')
      .eq('category_id', category)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setSubcategories(data as unknown as SubcategoryOption[]);
      });
  }, [category]);

  const activeFilterCount = Object.values(metadataFilters).filter(v => v !== undefined && v !== '' && v !== false).length
    + (priceRange !== 'all' ? 1 : 0)
    + (subcategory !== 'all' ? 1 : 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-7">
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price Range</Label>
        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map(r => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory */}
      {subcategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</Label>
          <Select value={subcategory} onValueChange={onSubcategoryChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {subcategories.map(s => (
                <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Dynamic metadata filters */}
      {filters.map((filter) => {
        if (filter.type === 'boolean') {
          return (
            <div key={filter.key} className="flex items-center justify-between">
              <Label className="text-sm">{filter.label}</Label>
              <Switch
                checked={metadataFilters[filter.key] || false}
                onCheckedChange={(v) => onMetadataFilterChange(filter.key, v || undefined)}
              />
            </div>
          );
        }

        if (filter.type === 'select') {
          return (
            <div key={filter.key} className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{filter.label}</Label>
              <Select
                value={metadataFilters[filter.key] || 'all'}
                onValueChange={(v) => onMetadataFilterChange(filter.key, v === 'all' ? undefined : v)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filter.options?.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (filter.type === 'multiselect') {
          const selected: string[] = metadataFilters[filter.key] || [];
          return (
            <div key={filter.key} className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{filter.label}</Label>
              <div className="flex flex-wrap gap-1.5">
                {filter.options?.map(opt => {
                  const isActive = selected.includes(opt);
                  return (
                    <Badge
                      key={opt}
                      variant={isActive ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        const next = isActive
                          ? selected.filter(s => s !== opt)
                          : [...selected, opt];
                        onMetadataFilterChange(filter.key, next.length > 0 ? next : undefined);
                      }}
                    >
                      {opt}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
