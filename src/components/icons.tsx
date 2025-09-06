import { Sprout, Building2, ShoppingCart, Tractor } from 'lucide-react';

export const FarmerIcon = ({ className }: { className?: string }) => (
  <Sprout className={className} />
);
export const AgentIcon = ({ className }: { className?: string }) => (
  <Building2 className={className} />
);
export const ConsumerIcon = ({ className }: { className?: string }) => (
  <ShoppingCart className={className} />
);

export const AppLogo = ({ className }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <Tractor className="w-7 h-7 text-primary" />
        <span className="font-headline text-2xl font-bold">AgriChain</span>
    </div>
);
