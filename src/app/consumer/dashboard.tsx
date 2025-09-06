
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, ScanLine } from 'lucide-react';
import type { TimelineEvent, ProductDetails } from '@/lib/types';
import { ProductTimeline } from './product-timeline';
import { ProductCard } from './components/product-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MOCK_PRODUCTS = [
    {
      name: 'Vine-Ripened Tomatoes',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.40 / kg',
      farmer: 'Madurai AgriStorage',
      rating: 4.7,
      reviews: 152,
    },
    {
      name: 'Ooty Potatoes',
      image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.35 / kg',
      farmer: 'Nilgiri Growers',
      rating: 4.6,
      reviews: 110,
    },
    {
      name: 'Fresh Cauliflower',
      image: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYXVsaWZsb3dlcnxlbnwwfHx8fDE3NTcxNTk3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 'Rs.30 / piece',
      farmer: 'Ooty Farms',
      rating: 4.8,
      reviews: 98,
    },
    {
      name: 'Glossy Brinjal (Eggplant)',
      image: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.45 / kg',
      farmer: 'Kovai Fields',
      rating: 4.5,
      reviews: 82,
    },
    {
      name: 'Organic Palak (Spinach)',
      image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.25 / bunch',
      farmer: 'Cauvery Delta Farmers',
      rating: 4.9,
      reviews: 180,
    },
     {
      name: 'Small Onions (Shallots)',
      image: 'https://images.unsplash.com/photo-1600807644626-fb3c8c8ba40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8c21hbGwlMjBvbmlvbnN8ZW58MHx8fHwxNzU3MTU5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 'Rs.50 / kg',
      farmer: 'Erode Growers',
      rating: 4.6,
      reviews: 89,
    },
  ];

const MOCK_PRODUCT_HISTORY: TimelineEvent[] = [
    {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Turmeric was harvested by Tamil Farms.',
        timestamp: '2023-03-15',
        icon: 'Farmer',
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
        icon: 'Agent',
        color: 'bg-accent',
        data: {
            'Quality': 'Grade A',
            'Price Paid to Farmer': 'Rs.8,100/quintal',
            'Warehouse': 'Temp: 20°C, Humidity: 65%',
        },
        hash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f'
    },
    {
        id: '3',
        title: 'Ready for Consumer',
        description: 'Product available at your local retailer.',
        timestamp: '2023-03-22',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Retail Price': 'Rs.95 / 100g',
            'Status': 'Available in stores',
        },
        hash: '0x3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i0j1k2l'
    },
];

const MOCK_PRODUCT_DETAILS: ProductDetails = {
    name: "Vine-Ripened Tomatoes",
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: "Rs.40 / kg",
    quality: "Grade A",
    farmer: "Madurai AgriStorage",
    rating: 4.7,
    reviews: 152,
};


export default function ConsumerDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const [isTimelineModalOpen, setTimelineModalOpen] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setSelectedProduct(MOCK_PRODUCT_DETAILS);
      setIsScanning(false);
      setScanModalOpen(false);
      setTimelineModalOpen(true);
    }, 1500);
  };

  const handleProductClick = (product: Omit<ProductDetails, 'quality'>) => {
    setSelectedProduct({
        ...MOCK_PRODUCT_DETAILS,
        ...product
    });
    setTimelineModalOpen(true);
  }

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
            {MOCK_PRODUCTS.map((product) => (
                <div key={product.name} onClick={() => handleProductClick(product)} className="cursor-pointer">
                    <ProductCard product={product} />
                </div>
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

        <Dialog open={isTimelineModalOpen} onOpenChange={setTimelineModalOpen}>
            <DialogContent className="max-w-4xl">
                 {selectedProduct && <ProductTimeline product={selectedProduct} events={MOCK_PRODUCT_HISTORY} onReset={() => setTimelineModalOpen(false)} />}
            </DialogContent>
        </Dialog>
    </div>
  );
}
