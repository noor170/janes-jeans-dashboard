import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { priceRanges } from '@/data/shopProducts';

interface ProductFiltersProps {
  selectedPriceRange: string;
  onPriceRangeChange: (range: string) => void;
}

export function ProductFilters({
  selectedPriceRange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
      <div className="flex-1 space-y-2">
        <Label htmlFor="price">Price Range</Label>
        <Select value={selectedPriceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger id="price">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
