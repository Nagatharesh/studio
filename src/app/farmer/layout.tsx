'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold text-primary">
          Farmer Hub
        </h1>
        <p className="text-muted-foreground">
          Manage crops, get AI-powered advice, and connect with the community.
        </p>
      </div>

      <Tabs value={pathname} className="mt-6">
        <TabsList>
            <Link href="/farmer" passHref>
                <TabsTrigger value="/farmer">Dashboard</TabsTrigger>
            </Link>
            <Link href="/farmer/forum" passHref>
                <TabsTrigger value="/farmer/forum">Community Forum</TabsTrigger>
            </Link>
        </TabsList>
        <TabsContent value={pathname} className="mt-6">
            {children}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
