import { DashboardLayout } from '@/components/dashboard-layout';
import AgentDashboard from './dashboard';

export default function AgentPage() {
  return (
    <DashboardLayout>
       <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold text-accent">
          Agent Dashboard
        </h1>
        <p className="text-muted-foreground">
          Review, verify, and manage crop batches from farmers.
        </p>
      </div>
      <div className="mt-8">
        <AgentDashboard />
      </div>
    </DashboardLayout>
  );
}
