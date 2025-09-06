
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { Batch } from '@/lib/types';
import { CheckCircle, Truck, Building, FilePenLine, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SingleBatchMapView } from '../components/single-batch-map-view';

const MOCK_BATCHES: Batch[] = [
  {
    id: 'BATCH-1678886400000',
    cropType: 'Turmeric',
    location: 'Erode, Tamil Nadu',
    soilProperties: 'Red Loam, pH 6.5',
    farmer: 'Tamil Farms',
    dateFarmed: '2023-03-15',
    status: 'IN_WAREHOUSE',
    price: 'Rs.81 / kg', // Farmer's asking price
    transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
  },
  {
    id: 'BATCH-1678972800000',
    cropType: 'Rice',
    location: 'Thanjavur, Tamil Nadu',
    soilProperties: 'Alluvial Soil, pH 6.8',
    farmer: 'Cauvery Delta Farmers',
    dateFarmed: '2023-03-16',
    status: 'IN_WAREHOUSE',
    price: 'Rs.52 / kg', // Farmer's asking price
    transactionHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
  },
  {
    id: 'BATCH-1678999900000',
    cropType: 'Sugarcane',
    location: 'Cuddalore, Tamil Nadu',
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
];

export default function AgentDashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const { toast } = useToast();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isMapOpen, setMapOpen] = useState(false);
  const [agentPrices, setAgentPrices] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Simulate fetching data
    setBatches(MOCK_BATCHES);
  }, []);

  const handleUpdate = (batchId: string, field: keyof Batch, value: string) => {
    setBatches(
      batches.map((b) => (b.id === batchId ? { ...b, [field]: value } : b))
    );
  };
  
  const handleApprove = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    const agentPrice = agentPrices[batchId];

    if (!batch?.quality || !agentPrice || !batch?.warehouseConditions) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill all fields, including agent price, before approving.',
      });
      return;
    }

    setBatches(batches.map(b => 
        b.id === batchId ? {
            ...b,
            status: 'VERIFIED',
            price: agentPrice, // Set the batch price to the agent's price upon approval
            agent: 'Simulated Agent Rajan',
            dateVerified: new Date().toISOString().split('T')[0],
            transactionHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        } : b
    ));
    toast({
        title: 'Batch Approved!',
        description: `${batchId} has been verified and updated on the ledger.`,
      });
  };

  const handleViewOnMap = (batch: Batch) => {
    setSelectedBatch(batch);
    setMapOpen(true);
  }

  return (
    <div>
      <h2 className="font-headline text-2xl font-semibold mb-6">Incoming Batches</h2>
      {batches.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <Card key={batch.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">{batch.cropType}</CardTitle>
                        <CardDescription>{batch.id}</CardDescription>
                    </div>
                    <Badge variant={batch.status === 'VERIFIED' ? 'default' : 'secondary'} className={batch.status === 'VERIFIED' ? 'bg-accent text-accent-foreground' : ''}>
                        {batch.status === 'IN_WAREHOUSE' && <Building className="mr-2 h-3 w-3"/>}
                        {batch.status === 'VERIFIED' && <CheckCircle className="mr-2 h-3 w-3"/>}
                        {batch.status.replace('_', ' ')}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Farmer:</strong> {batch.farmer}</p>
                    <p><strong>Location:</strong> {batch.location}</p>
                    <p><strong>Farmed Date:</strong> {batch.dateFarmed}</p>
                    {batch.status === 'IN_WAREHOUSE' && batch.price && <p><strong>Farmer's Price:</strong> {batch.price}</p>}
                </div>
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold flex items-center gap-2"><FilePenLine className="w-4 h-4 text-accent"/>Verification Details</h4>
                    <div className="space-y-2">
                        <Label htmlFor={`quality-${batch.id}`}>Quality Check</Label>
                        <Input id={`quality-${batch.id}`} value={batch.quality || ''} onChange={(e) => handleUpdate(batch.id, 'quality', e.target.value)} placeholder="e.g., Grade A" disabled={batch.status === 'VERIFIED'} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`price-${batch.id}`}>Set Agent Price (per kg)</Label>
                        <Input id={`price-${batch.id}`} value={agentPrices[batch.id] || ''} onChange={(e) => setAgentPrices({...agentPrices, [batch.id]: e.target.value})} placeholder="e.g., Rs.85 / kg" disabled={batch.status === 'VERIFIED'} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`warehouse-${batch.id}`}>Warehouse Conditions</Label>
                        <Input id={`warehouse-${batch.id}`} value={batch.warehouseConditions || ''} onChange={(e) => handleUpdate(batch.id, 'warehouseConditions', e.target.value)} placeholder="e.g., Temp: 20°C, Humidity: 65%" disabled={batch.status === 'VERIFIED'} />
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2">
                 <Button variant="outline" className="w-full" onClick={() => handleViewOnMap(batch)}>
                    <MapPin className="mr-2 h-4 w-4" /> View on Map
                 </Button>
                 {batch.status === 'IN_WAREHOUSE' ? (
                    <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => handleApprove(batch.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve & Sign
                    </Button>
                ) : (
                    <div className="text-center p-2 bg-muted rounded-md">
                        <p className="font-semibold">Ready for Consumer at {batch.price}</p>
                    </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6 flex flex-col items-center justify-center py-20 text-center bg-muted/50 border-dashed">
            <Building className="w-16 h-16 text-muted-foreground mb-4"/>
            <h3 className="font-headline text-xl font-semibold">No Incoming Batches</h3>
            <p className="text-muted-foreground mt-1">Batches from farmers will appear here for verification.</p>
        </Card>
      )}

        <Dialog open={isMapOpen} onOpenChange={setMapOpen}>
            <DialogContent className="max-w-3xl">
                {selectedBatch && (
                    <>
                    <DialogHeader>
                        <DialogTitle className="font-headline flex items-center gap-2">
                            <MapPin className="text-accent w-6 h-6"/>
                            Location for {selectedBatch.cropType} - {selectedBatch.id}
                        </DialogTitle>
                        <DialogDescription>
                           This map shows the current location of the selected batch.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video">
                       <SingleBatchMapView batch={selectedBatch} />
                    </div>
                    </>
                )}
            </DialogContent>
        </Dialog>

    </div>
  );
}
