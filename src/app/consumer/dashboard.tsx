
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, ScanLine } from 'lucide-react';
import { ProductCard } from './components/product-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MOCK_PRODUCTS_LIST } from '@/lib/mock-data';

const SCAN_PRODUCT_ID = 'PROD-TOM-001'; // Which product to show on QR scan

export default function ConsumerDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const router = useRouter();

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setScanModalOpen(false);
      router.push(`/consumer/product/${SCAN_PRODUCT_ID}`);
    }, 1500);
  };

  return (
    <div className="relative container py-8">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-3xl font-bold text-consumer">
            Marketplace
            </h1>
            <p className="text-muted-foreground">
            Browse products with verified origins or scan a QR code to trace its journey.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS_LIST.map((product) => (
                <Link key={product.id} href={`/consumer/product/${product.id}`} className="cursor-pointer">
                    <ProductCard product={product} />
                </Link>
            ))}
        </div>
        
        <Button
            onClick={() => setScanModalOpen(true)}
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-consumer hover:bg-consumer/90 flex items-center justify-center z-50"
        >
            <QrCode className="h-8 w-8" />
            <span className="sr-only">Scan QR Code</span>
        </Button>

        <Dialog open={isScanModalOpen} onOpenChange={setScanModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center">Scan Product QR Code</DialogTitle>
                    <DialogDescription className="text-center">
                        Hold the product's QR code in front of the camera to see its journey.
                    </DialogDescription>
                </DialogHeader>
                <Card className="overflow-hidden border-0 shadow-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                            <QrCode className="w-full h-full text-muted-foreground/20" />
                            {isScanning && <ScanLine className="absolute w-full h-1 bg-consumer/70 animate-pulse" style={{ animation: 'scan 1.5s ease-in-out infinite' }}/>}
                        </div>
                        <style jsx>{`
                            @keyframes scan {
                                0% { top: 0; }
                                50% { top: 100%; }
                                100% { top: 0; }
                            }
                        `}</style>
                        
                        <Button onClick={handleScan} className="bg-consumer hover:bg-consumer/90" size="lg" disabled={isScanning}>
                        {isScanning ? (
                            <>
                            <ScanLine className="mr-2 h-5 w-5 animate-pulse" />
                            Scanning...
                            </>
                        ) : (
                            <>
                            <QrCode className="mr-2 h-5 w-5" />
                            Simulate Scan
                            </>
                        )}
                        </Button>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    </div>
  );
}
