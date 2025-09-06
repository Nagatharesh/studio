import { DashboardLayout } from '@/components/dashboard-layout';
import ConsumerDashboard from './dashboard';

export default function ConsumerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold text-consumer">
          Consumer Dashboard
        </h1>
        <p className="text-muted-foreground">
          Scan a product's QR code to view its full journey from farm to shelf.
        </p>
      </div>
      <div className="mt-8">
        <ConsumerDashboard />
      </div>
    </DashboardLayout>
  );
}
