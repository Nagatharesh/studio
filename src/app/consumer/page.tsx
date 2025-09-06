import { DashboardLayout } from '@/components/dashboard-layout';
import ConsumerDashboard from './dashboard';

export default function ConsumerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold text-consumer">
          Marketplace
        </h1>
        <p className="text-muted-foreground">
          Browse products with verified origins or scan a QR code to trace its journey.
        </p>
      </div>
      <div className="mt-8">
        <ConsumerDashboard />
      </div>
    </DashboardLayout>
  );
}
