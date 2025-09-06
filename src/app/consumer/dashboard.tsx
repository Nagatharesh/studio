
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

type MockProduct = {
  details: ProductDetails;
  history: TimelineEvent[];
}

const MOCK_DATA: {[key: string]: MockProduct} = {
  'tomatoes': {
    details: {
      id: 'PROD-TOM-001',
      name: 'Vine-Ripened Tomatoes',
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.39 / kg',
      quality: 'Grade A',
      farmer: 'Madurai AgriStorage',
      rating: 4.7,
      reviews: 152,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Tomatoes were harvested by Madurai AgriStorage.',
        timestamp: '2023-03-15',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-TOM-001',
            'Origin': 'Madurai, Tamil Nadu',
            'Soil Info': 'Red Loam, pH 6.5',
            'Price from Farmer': 'Rs.32 / kg',
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
              'Transportation Cost': 'Rs.2 / kg',
              'Price from Agent': 'Rs.39 / kg',
          },
          hash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f'
      },
    ]
  },
  'potatoes': {
    details: {
      id: 'PROD-POT-002',
      name: 'Ooty Potatoes',
      image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.30 / kg',
      quality: 'Grade B',
      farmer: 'Nilgiri Growers',
      rating: 4.6,
      reviews: 110,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Potatoes were harvested by Nilgiri Growers.',
        timestamp: '2023-04-01',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-POT-002',
            'Origin': 'Ooty, Tamil Nadu',
            'Soil Info': 'Laterite, pH 5.5',
            'Price from Farmer': 'Rs.25 / kg',
        },
        hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Priya.',
          timestamp: '2023-04-05',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade B',
              'Transportation Cost': 'Rs.1 / kg',
              'Price from Agent': 'Rs.30 / kg',
          },
          hash: '0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g'
      },
    ]
  },
  'cauliflower': {
    details: {
      id: 'PROD-CAU-003',
      name: 'Fresh Cauliflower',
      image: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYXVsaWZsb3dlcnxlbnwwfHx8fDE3NTcxNTk3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 'Rs.26 / piece',
      quality: 'Grade A',
      farmer: 'Ooty Farms',
      rating: 4.8,
      reviews: 98,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Cauliflower was harvested by Ooty Farms.',
        timestamp: '2023-05-10',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-CAU-003',
            'Origin': 'Ooty, Tamil Nadu',
            'Soil Info': 'Alluvial, pH 6.2',
            'Price from Farmer': 'Rs.22 / piece',
        },
        hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Kumar.',
          timestamp: '2023-05-12',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade A',
              'Transportation Cost': 'Rs.1 / piece',
              'Price from Agent': 'Rs.26 / piece',
          },
          hash: '0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h'
      },
    ]
  },
  'eggplant': {
    details: {
      id: 'PROD-EGG-004',
      name: 'Glossy Brinjal (Eggplant)',
      image: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.40 / kg',
      quality: 'Grade A',
      farmer: 'Kovai Fields',
      rating: 4.5,
      reviews: 82,
    },
    history: [
       {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Brinjal was harvested by Kovai Fields.',
        timestamp: '2023-06-01',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-EGG-004',
            'Origin': 'Coimbatore, Tamil Nadu',
            'Soil Info': 'Clay Loam, pH 6.8',
            'Price from Farmer': 'Rs.35 / kg',
        },
        hash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Deepa.',
          timestamp: '2023-06-03',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Grade A',
              'Transportation Cost': 'Rs.2 / kg',
              'Price from Agent': 'Rs.40 / kg',
          },
          hash: '0x0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i'
      },
    ]
  },
  'spinach': {
    details: {
      id: 'PROD-SPI-005',
      name: 'Organic Palak (Spinach)',
      image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 'Rs.25 / bundle',
      quality: 'Organic Grade',
      farmer: 'Cauvery Delta Farmers',
      rating: 4.9,
      reviews: 180,
    },
    history: [
      {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Spinach was harvested by Cauvery Delta Farmers.',
        timestamp: '2023-07-01',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-SPI-005',
            'Origin': 'Thanjavur, Tamil Nadu',
            'Soil Info': 'Alluvial, pH 7.0',
            'Price from Farmer': 'Rs.20 / bundle',
        },
        hash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d'
      },
      {
        id: '2',
        title: 'Ready for Consumer',
        description: 'Product available for purchase.',
        timestamp: '2023-07-02',
        icon: 'Consumer',
        color: 'bg-consumer',
        data: {
            'Final Price': 'Rs.25 / bundle',
            'Status': 'Available',
        },
        hash: '0x1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i0j'
    },
    ]
  },
  'onions': {
    details: {
      id: 'PROD-ONI-006',
      name: 'Small Onions (Shallots)',
      image: 'https://images.unsplash.com/photo-1600807644626-fb3c8c8ba40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8c21hbGwlMjBvbmlvbnN8ZW58MHx8fHwxNzU3MTU5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 'Rs.45 / kg',
      quality: 'Export Grade',
      farmer: 'Erode Growers',
      rating: 4.6,
      reviews: 89,
    },
    history: [
      {
        id: '1',
        title: 'Farmed & Harvested',
        description: 'Shallots were harvested by Erode Growers.',
        timestamp: '2023-08-10',
        icon: 'Farmer',
        color: 'bg-primary',
        data: {
            'Batch ID': 'BATCH-ONI-006',
            'Origin': 'Erode, Tamil Nadu',
            'Soil Info': 'Red Loam, pH 6.7',
            'Price from Farmer': 'Rs.40 / kg',
        },
        hash: '0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e'
      },
      {
          id: '2',
          title: 'Agent Verified',
          description: 'Batch quality and pricing confirmed by Agent Saravanan.',
          timestamp: '2023-08-12',
          icon: 'Agent',
          color: 'bg-accent',
          data: {
              'Quality': 'Export Grade',
              'Transportation Cost': 'Rs.1 / kg',
              'Price from Agent': 'Rs.45 / kg',
          },
          hash: '0x2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f7g8h9i0j1k'
      },
    ]
  },
};

const MOCK_PRODUCTS_LIST = Object.values(MOCK_DATA).map(item => item.details);
const SCAN_PRODUCT_ID = 'tomatoes'; // Which product to show on QR scan

export default function ConsumerDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const [isTimelineModalOpen, setTimelineModalOpen] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setSelectedProduct(MOCK_DATA[SCAN_PRODUCT_ID]);
      setIsScanning(false);
      setScanModalOpen(false);
      setTimelineModalOpen(true);
    }, 1500);
  };

  const handleProductClick = (productId: string) => {
    const productKey = Object.keys(MOCK_DATA).find(key => MOCK_DATA[key].details.id === productId);
    if (productKey) {
        setSelectedProduct(MOCK_DATA[productKey]);
        setTimelineModalOpen(true);
    }
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
            {MOCK_PRODUCTS_LIST.map((product) => (
                <div key={product.id} onClick={() => handleProductClick(product.id)} className="cursor-pointer">
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
                 <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Product Details</DialogTitle>
                        <DialogDescription>
                        Complete journey from farm to you, verified by GreenLedger.
                    </DialogDescription>
                </DialogHeader>
                {selectedProduct && (
                    <ProductTimeline product={selectedProduct.details} events={selectedProduct.history} onReset={() => setTimelineModalOpen(false)} />
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}

    
