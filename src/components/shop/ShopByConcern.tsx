import { Card, CardContent } from '@/components/ui/card';
import { shopByConcernData } from '@/data/shopProducts';

interface ShopByConcernProps {
  onSelectConcern: (concerns: string[]) => void;
}

export function ShopByConcern({ onSelectConcern }: ShopByConcernProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Shop by Concern</h2>
        <p className="text-muted-foreground text-sm mt-1">Find the right products for your skin & hair needs</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {shopByConcernData.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group"
            onClick={() => onSelectConcern(item.concerns)}
          >
            <CardContent className="p-4 text-center">
              <span className="text-3xl block mb-2">{item.icon}</span>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{item.label}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
