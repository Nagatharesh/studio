'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, ScanLine, Info, Leaf } from 'lucide-react';
import type { TimelineEvent } from '@/lib/types';
import { ProductTimeline } from './product-timeline';
import { FarmerIcon, AgentIcon, ConsumerIcon } from '@/components/icons';
import Image from 'next/image';

const MOCK_PRODUCT_HISTORY: TimelineEvent[] = [
    {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Turmeric was harvested by Tamil Farms.',
        timestamp: '2023-03-15',
        icon: FarmerIcon,
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-1678886400000',
            'Origin': 'Erode, Tamil Nadu',
            'Soil Info': 'Red Loam, pH 6.5',
            'Product': 'Turmeric Powder',
        },
        hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f'
    },
    {
        id: '2',
        title: 'Agent Verified',
        description: 'Batch quality and pricing confirmed by Agent Rajan.',
        timestamp: '2023-03-20',
        icon: AgentIcon,
        color: 'bg-accent',
        data: {
            'Quality': 'Grade A',
            'Price Paid to Farmer': '₹3,200/ton',
            'Warehouse': 'Temp: 20°C, Humidity: 65%',
        },
        hash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f'
    },
    {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available at your local retailer.',
        timestamp: '2023-03-22',
        icon: ConsumerIcon,
        color: 'bg-consumer',
        data: {
            'Retail Price': '₹55 / 100g',
            'Status': 'Available in stores',
        },
        hash: '0x3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i0j1k2l'
    },
];

const MOCK_PRODUCT_DETAILS = {
    name: "Organically Grown Turmeric Powder",
    image: "https://picsum.photos/600/400",
    price: "₹55 / 100g",
    quality: "Grade A",
    farmer: "Tamil Farms",
};


export default function ConsumerDashboard() {
  const [scannedData, setScannedData] = useState<TimelineEvent[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setScannedData(MOCK_PRODUCT_HISTORY);
      setIsScanning(false);
    }, 1500);
  };

  const handleReset = () => {
    setScannedData(null);
  }

  if (scannedData) {
    return <ProductTimeline product={MOCK_PRODUCT_DETAILS} events={scannedData} onReset={handleReset} />;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-10 flex flex-col items-center justify-center text-center">
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
        
        <h2 className="font-headline text-2xl font-semibold">Ready to Scan</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Click the button below to simulate scanning a product's QR code and trace its journey.
        </p>
        <Button onClick={handleScan} className="mt-8 bg-consumer hover:bg-consumer/90" size="lg" disabled={isScanning}>
          {isScanning ? (
            <>
              <ScanLine className="mr-2 h-5 w-5 animate-pulse" />
              Scanning...
            </>
          ) : (
            <>
              <QrCode className="mr-2 h-5 w-5" />
              Scan Product QR Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
