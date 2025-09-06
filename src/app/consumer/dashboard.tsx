'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, ScanLine } from 'lucide-react';
import type { TimelineEvent, ProductDetails } from '@/lib/types';
import { ProductTimeline } from './product-timeline';
import { FarmerIcon, AgentIcon, ConsumerIcon } from '@/components/icons';
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
      image: 'https://storage.googleapis.com/maker-studio-project-files-prod/f7375a76-e137-4a49-9286-9d338f0d9128/images/edbc4b41-e945-4228-9a4f-5619114d23fd.jpeg',
      price: '₹35 / kg',
      farmer: 'Madurai AgriStorage',
      rating: 4.7,
      reviews: 152,
    },
    {
      name: 'Himalayan Potatoes',
      image: 'https://picsum.photos/seed/potato/600/400',
      price: '₹30 / kg',
      farmer: 'Nilgiri Growers',
      rating: 4.6,
      reviews: 110,
    },
    {
      name: 'Fresh Cauliflower',
      image: 'https://picsum.photos/seed/cauliflower-head/600/400',
      price: '₹25 / piece',
      farmer: 'Ooty Farms',
      rating: 4.8,
      reviews: 98,
    },
    {
      name: 'Glossy Brinjal (Eggplant)',
      image: 'https://picsum.photos/seed/eggplant/600/400',
      price: '₹40 / kg',
      farmer: 'Kovai Fields',
      rating: 4.5,
      reviews: 82,
    },
    {
      name: 'Organic Spinach Greens',
      image: 'https://picsum.photos/seed/greens/600/400',
      price: '₹20 / bunch',
      farmer: 'Cauvery Delta Farmers',
      rating: 4.9,
      reviews: 180,
    },
     {
      name: 'Fresh Red Onions',
      image: 'https://picsum.photos/seed/onions-red/600/400',
      price: '₹40 / kg',
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

const MOCK_PRODUCT_DETAILS: ProductDetails = {
    name: "Vine-Ripened Tomatoes",
    image: "https://storage.googleapis.com/maker-studio-project-files-prod/f7375a76-e137-4a49-9286-9d338f0d9128/images/edbc4b41-e945-4228-9a4f-5619114d23fd.jpeg",
    price: "₹35 / kg",
    quality: "Grade A",
    farmer: "Madurai AgriStorage",
    rating: 4.7,
    reviews: 152,
};


export default function ConsumerDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanModalOpen, setScanModalOpen] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setSelectedProduct(MOCK_PRODUCT_DETAILS);
      setIsScanning(false);
      setScanModalOpen(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedProduct(null);
  }

  const handleProductClick = (product: Omit<ProductDetails, 'quality'>) => {
    setSelectedProduct({
        ...MOCK_PRODUCT_DETAILS,
        ...product
    });
  }

  if (selectedProduct) {
    return <ProductTimeline product={selectedProduct} events={MOCK_PRODUCT_HISTORY} onReset={handleReset} />;
  }

  return (
    <div className="relative">
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
    </div>
  );
}
