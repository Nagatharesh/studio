import { DashboardLayout } from '@/components/dashboard-layout';
import FarmerDashboard from './dashboard';

export default function FarmerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold text-primary">
          Farmer Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your crops, get suggestions, and record your harvest on the chain.
        </p>
      </div>
      <div className="mt-8">
        <FarmerDashboard />
      </div>
    </DashboardLayout>
  );
}
