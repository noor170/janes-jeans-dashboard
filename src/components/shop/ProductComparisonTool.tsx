import { useState } from 'react';
import { ShopProduct } from '@/data/shopProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, GitCompareArrows } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductComparisonToolProps {
  products: ShopProduct[];
}

export function ProductComparisonTool({ products }: ProductComparisonToolProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const compared = products.filter(p => selected.includes(p.id));

  // Collect all unique ingredients from compared products
  const allIngredients = new Set<string>();
  compared.forEach(p => {
    const ings: string[] = p.metadata?.ingredients || [];
    ings.forEach(i => allIngredients.add(i));
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <GitCompareArrows className="h-4 w-4" />
          Compare ({selected.length}/3)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Compare Products</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh]">
          {/* Product selector */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-muted-foreground">Select up to 3 products to compare:</p>
            <div className="flex flex-wrap gap-2">
              {products.map(p => (
                <Badge
                  key={p.id}
                  variant={selected.includes(p.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggle(p.id)}
                >
                  {p.name}
                  {selected.includes(p.id) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          {compared.length >= 2 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground">Attribute</th>
                    {compared.map(p => (
                      <th key={p.id} className="text-left p-2 font-semibold">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 text-muted-foreground">Price</td>
                    {compared.map(p => <td key={p.id} className="p-2 font-medium">${p.price.toFixed(2)}</td>)}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 text-muted-foreground">Rating</td>
                    {compared.map(p => <td key={p.id} className="p-2">{p.rating} ⭐ ({p.reviews})</td>)}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 text-muted-foreground">Skin Type</td>
                    {compared.map(p => <td key={p.id} className="p-2">{p.metadata?.skin_type || '—'}</td>)}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 text-muted-foreground">Sizes</td>
                    {compared.map(p => <td key={p.id} className="p-2">{p.sizes.join(', ') || '—'}</td>)}
                  </tr>
                  {/* Ingredient comparison */}
                  {Array.from(allIngredients).map(ing => (
                    <tr key={ing} className="border-b">
                      <td className="p-2 text-muted-foreground">{ing}</td>
                      {compared.map(p => {
                        const has = (p.metadata?.ingredients || []).includes(ing);
                        return (
                          <td key={p.id} className="p-2">
                            {has ? <Badge variant="secondary" className="text-xs">✓</Badge> : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {compared.length < 2 && (
            <p className="text-center text-muted-foreground py-8">Select at least 2 products to compare ingredients</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
