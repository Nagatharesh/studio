import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FarmerIcon, AgentIcon, ConsumerIcon } from '@/components/icons';

export default function LoginPage() {
  const roles = [
    {
      name: 'Farmer',
      href: '/farmer',
      icon: FarmerIcon,
      color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    },
    {
      name: 'Agent',
      href: '/agent',
      icon: AgentIcon,
      color: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    },
    {
      name: 'Consumer',
      href: '/consumer',
      icon: ConsumerIcon,
      color: 'bg-consumer/10 text-consumer border-consumer/20 hover:bg-consumer/20',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold text-primary">AgriChain</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Farm-to-fork transparency, powered by simulated blockchain.
        </p>
      </div>

      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center font-headline text-2xl">Choose Your Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Link href={role.href} key={role.name} passHref>
                <Card
                  className={`flex flex-col items-center justify-center p-8 text-center transition-transform transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg cursor-pointer border-2 ${role.color}`}
                >
                  <role.icon className="w-16 h-16 mb-4" />
                  <h3 className="font-headline text-xl font-semibold">{role.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>This is a prototype application. All data and transactions are simulated.</p>
      </footer>
    </main>
  );
}
