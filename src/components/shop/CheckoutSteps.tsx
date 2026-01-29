import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutStep {
  id: number;
  name: string;
  path: string;
}

const steps: CheckoutStep[] = [
  { id: 1, name: 'Cart', path: '/shop/cart' },
  { id: 2, name: 'Shipping', path: '/shop/checkout' },
  { id: 3, name: 'Payment', path: '/shop/payment' },
  { id: 4, name: 'Confirm', path: '/shop/order-success' },
];

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Checkout progress" className="py-4">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  step.id < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.id === currentStep
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'hidden sm:inline text-sm font-medium',
                  step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'ml-2 sm:ml-4 h-0.5 w-8 sm:w-12',
                  step.id < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
