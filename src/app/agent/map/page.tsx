import { AgentMapView } from './agent-map-view';
import type { Batch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';


const MOCK_BATCHES: Batch[] = [
  {
    id: 'BATCH-1678886400000',
    cropType: 'Turmeric',
    location: 'Erode',
    soilProperties: 'Red Loam, pH 6.5',
    farmer: 'Tamil Farms',
    dateFarmed: '2023-03-15',
    status: 'IN_WAREHOUSE',
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
    price: '₹3,200/ton',
    warehouseConditions: 'Temp: 20°C, Humidity: 65%',
    agent: 'Simulated Agent Rajan',
    dateVerified: '2023-03-20',
    transactionHash: '0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f',
  },
   {
    id: 'BATCH-1679000000000',
    cropType: 'Cotton',
    location: 'Coimbatore',
    soilProperties: 'Black Soil, pH 7.2',
    farmer: 'Kongu Farms',
    dateFarmed: '2023-03-19',
    status: 'IN_WAREHOUSE',
    transactionHash: '0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f1a2b3c4d5e6f',
  },
];


export default function AgentMapPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-accent" />
                    <div>
                        <CardTitle className="font-headline text-xl">Live Logistics Overview</CardTitle>
                        <CardDescription>Real-time locations of incoming and verified batches.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AgentMapView batches={MOCK_BATCHES} />
            </CardContent>
        </Card>
    )
}
