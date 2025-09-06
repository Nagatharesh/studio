
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

       <Tabs value={pathname} className="mt-6">
        <TabsList>
            <Link href="/agent/dashboard" passHref>
                <TabsTrigger value="/agent/dashboard">Incoming Batches</TabsTrigger>
            </Link>
            <Link href="/agent/map" passHref>
                <TabsTrigger value="/agent/map">Logistics Map</TabsTrigger>
            </Link>
        </TabsList>
        <TabsContent value={pathname} className="mt-6">
            {children}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
