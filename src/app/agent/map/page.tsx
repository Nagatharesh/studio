
'use client';

import { useState } from 'react';
import { LogisticsMap } from './logistics-map';
import type { Batch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Truck, Sprout, Warehouse, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';


const MOCK_BATCHES: Batch[] = [
  {
    id: 'BATCH-1678886400000',
    cropType: 'Turmeric',
    location: 'Erode',
    soilProperties: 'Red Loam, pH 6.5',
    farmer: 'Tamil Farms',
    dateFarmed: '2023-03-15',
    status: 'IN_WAREHOUSE',
    price: 'Rs.81 / kg',
    transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
  },
  {
    id: 'BATCH-1678972800000',
    cropType: 'Rice',
    location: 'Thanjavur',
    soilProperties: 'Alluvial Soil, pH 6.8',
    farmer: 'Cauvery Delta Farmers',
    dateFarmed: '2023-03-16',
    status: 'IN_WAREHOUSE',
    price: 'Rs.52 / kg',
    transactionHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
  },
  {
    id: 'BATCH-1678999900000',
    cropType: 'Sugarcane',
    location: 'Cuddalore',
    soilProperties: 'Clay Loam, pH 7.0',
    farmer: 'Coromandel Sugars',
    dateFarmed: '2023-03-18',
    status: 'VERIFIED',
    quality: 'Grade A',
    price: 'Rs.40 / kg',
    warehouseConditions: 'Temp: 20°C, Humidity: 65%',
    agent: 'Simulated Agent Rajan',
    dateVerified: '2023-03-20',
    transactionHash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f',
  },
  {
    id: 'BATCH-1679100000000',
    cropType: 'Mangoes',
    location: 'Madurai',
    soilProperties: 'Sandy Loam, pH 6.7',
    farmer: 'Madurai Orchards',
    dateFarmed: '2023-03-21',
    status: 'VERIFIED',
    price: 'Rs.60 / kg',
    transactionHash: '0x9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i',
  }
];

const statusStyles = {
  IN_WAREHOUSE: { icon: Warehouse, color: 'bg-accent text-accent-foreground' },
  VERIFIED: { icon: CheckCircle, color: 'bg-green-500 text-white' },
  FARMED: { icon: Sprout, color: 'bg-primary text-primary-foreground' },
};


export default function AgentMapPage() {
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(MOCK_BATCHES[0].id);

    const getStatusInfo = (status: Batch['status']) => {
        return statusStyles[status] || { icon: Sprout, color: 'bg-gray-400' };
    }

    return (
        <Card className="h-[75vh] flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-accent" />
                    <div>
                        <CardTitle className="font-headline text-xl">Live Logistics Overview</CardTitle>
                        <CardDescription>Real-time locations and routes of incoming and verified batches.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
                <div className="md:col-span-2 h-full">
                    <LogisticsMap batches={MOCK_BATCHES} selectedBatchId={selectedBatchId} onSelectBatch={setSelectedBatchId} />
                </div>
                <div className="flex flex-col gap-2 h-full">
                    <h3 className="font-semibold text-base">Active Batches</h3>
                    <ScrollArea className="flex-1 border rounded-md">
                        <div className="p-2 space-y-2">
                        {MOCK_BATCHES.map((batch) => {
                            const statusInfo = getStatusInfo(batch.status);
                            return (
                                <div 
                                    key={batch.id} 
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer transition-all",
                                        selectedBatchId === batch.id ? 'bg-muted ring-2 ring-accent' : 'hover:bg-muted/50'
                                    )}
                                    onClick={() => setSelectedBatchId(batch.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm">{batch.cropType}</p>
                                        <Badge variant={batch.status === 'VERIFIED' ? 'default' : 'secondary'} className={batch.status === 'VERIFIED' ? 'bg-accent text-accent-foreground' : ''}>
                                             <statusInfo.icon className="mr-1.5 h-3 w-3"/>
                                            {batch.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{batch.id}</p>
                                    <p className="text-xs text-muted-foreground">From: {batch.location}</p>
                                </div>
                            )
                        })}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
