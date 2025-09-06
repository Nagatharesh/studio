'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCropSuggestions } from '@/lib/actions';
import type { Batch } from '@/lib/types';
import { PlusCircle, Cpu, Loader2, Sparkles, Download, QrCode } from 'lucide-react';
import Image from 'next/image';
import { DiseaseDetectionCard } from './components/disease-detection-card';
import { WarehouseAvailabilityCard } from './components/warehouse-availability-card';
import { MarketPricePredictionCard } from './components/market-price-prediction-card';

const addCropSchema = z.object({
  cropType: z.string().min(2, { message: 'Crop type is required.' }),
  location: z.string().min(3, { message: 'Location is required.' }),
  soilProperties: z.string().min(10, { message: 'Soil properties are required.' }),
});

export default function FarmerDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addCropSchema>>({
    resolver: zodResolver(addCropSchema),
    defaultValues: { cropType: '', location: '', soilProperties: '' },
  });

  const handleGetSuggestions = async () => {
    const { location, soilProperties } = form.getValues();
    if (!location || !soilProperties) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in Location and Soil Properties to get suggestions.',
      });
      return;
    }
    setSuggesting(true);
    const result = await getCropSuggestions({ location, soilProperties });
    setSuggesting(false);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
      setSuggestions(result.suggestions || []);
      toast({ title: 'Success!', description: 'Received crop suggestions from AI.' });
    }
  };

  const onSubmit = (values: z.infer<typeof addCropSchema>) => {
    const newBatch: Batch = {
      id: `BATCH-${Date.now()}`,
      cropType: values.cropType,
      location: values.location,
      soilProperties: values.soilProperties,
      farmer: 'Simulated Tamil Farmer',
      dateFarmed: new Date().toISOString().split('T')[0],
      status: 'FARMED',
      transactionHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };
    setBatches((prev) => [newBatch, ...prev]);
    toast({
      title: 'Batch Created!',
      description: `${newBatch.cropType} batch has been added to the ledger.`,
    });
    setDialogOpen(false);
    form.reset();
    setSuggestions([]);
  };

  const downloadQrCode = async (batchId: string) => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        batchId
      )}`;
      const response = await fetch(qrUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${batchId}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not download the QR code.',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="font-headline text-2xl font-semibold">Your Batches</h2>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Crop Batch
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Add New Crop Batch</DialogTitle>
                <DialogDescription>
                    Fill in the details for your new harvest. Use the AI assistant to get crop suggestions based on your soil and location.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Erode, Tamil Nadu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="soilProperties"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Soil Properties</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Red Loam, pH 6.5" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>

                    <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-lg">AI Crop Suggestions</CardTitle>
                        </div>
                        <Button type="button" size="sm" onClick={handleGetSuggestions} disabled={isSuggesting}>
                            {isSuggesting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Get Suggestions
                        </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {suggestions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                            <Button key={i} variant="outline" size="sm" onClick={() => form.setValue('cropType', s)}>
                            {s}
                            </Button>
                            ))}
                        </div>
                        ) : (
                        <p className="text-sm text-muted-foreground">
                            Enter location and soil info to get AI-powered suggestions.
                        </p>
                        )}
                    </CardContent>
                    </Card>

                    <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Crop Type</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Turmeric, Rice, Sugarcane" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <DialogFooter>
                    <Button type="submit">Submit Batch</Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>

        {batches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
            {batches.map((batch) => (
                <Card key={batch.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">{batch.cropType}</CardTitle>
                        <CardDescription>{batch.id}</CardDescription>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">{batch.status}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                        <Image
                            data-ai-hint="qr code"
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(batch.id)}`}
                            alt={`QR Code for ${batch.id}`}
                            width={150}
                            height={150}
                        />
                    </div>
                    <div className="text-sm space-y-1">
                        <p><strong>Location:</strong> {batch.location}</p>
                        <p><strong>Farmed:</strong> {batch.dateFarmed}</p>
                    </div>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button variant="outline" className="w-full" onClick={() => downloadQrCode(batch.id)}>
                        <Download className="mr-2 h-4 w-4"/> Download QR
                    </Button>
                </div>
                </Card>
            ))}
            </div>
        ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center bg-muted/50 border-dashed">
                <QrCode className="w-16 h-16 text-muted-foreground mb-4"/>
                <h3 className="font-headline text-xl font-semibold">No Batches Yet</h3>
                <p className="text-muted-foreground mt-1">Click "Add New Crop Batch" to get started.</p>
            </Card>
        )}
      </div>

      <div className="space-y-6">
        <DiseaseDetectionCard />
        <WarehouseAvailabilityCard />
        <MarketPricePredictionCard />
      </div>

    </div>
  );
}
