
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.startsWith('/agent/map')) {
      return '/agent/map';
    }
    return '/agent';
  }

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

       <Tabs value={getActiveTab()} className="mt-6">
        <TabsList>
            <Link href="/agent" passHref>
                <TabsTrigger value="/agent">Incoming Batches</TabsTrigger>
            </Link>
            <Link href="/agent/map" passHref>
                <TabsTrigger value="/agent/map">Logistics Map</TabsTrigger>
            </Link>
        </TabsList>
        <TabsContent value={getActiveTab()} className="mt-6">
            {children}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
