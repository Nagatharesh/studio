'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AppLogo, FarmerIcon, AgentIcon, ConsumerIcon } from '@/components/icons';
import { LogOut } from 'lucide-react';

const roleConfig = {
  '/farmer': { name: 'Farmer', Icon: FarmerIcon, color: 'text-primary' },
  '/agent': { name: 'Agent', Icon: AgentIcon, color: 'text-accent' },
  '/consumer': { name: 'Consumer', Icon: ConsumerIcon, color: 'text-consumer' },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentRole = Object.entries(roleConfig).find(([path]) =>
    pathname.startsWith(path)
  );

  const roleInfo = currentRole ? currentRole[1] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <AppLogo />
          <div className="flex flex-1 items-center justify-end space-x-4">
            {roleInfo && (
              <div className={`flex items-center gap-2 font-semibold ${roleInfo.color}`}>
                <roleInfo.Icon className="h-5 w-5" />
                <span>{roleInfo.name}</span>
              </div>
            )}
            <Link href="/" passHref>
              <Button variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
