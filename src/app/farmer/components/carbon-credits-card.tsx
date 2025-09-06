'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getCarbonCreditInfo } from '@/lib/actions';
import type { Batch } from '@/lib/types';
import { Loader2, Sparkles, RefreshCw, Leaf } from 'lucide-react';

type CarbonInfo = {
    creditsEarned: number;
    explanation: string;
}

interface CarbonCreditsCardProps {
  batches: Batch[];
}

export function CarbonCreditsCard({ batches }: CarbonCreditsCardProps) {
    const [info, setInfo] = useState<CarbonInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchCarbonInfo = async () => {
        setIsLoading(true);
        const cropTypes = batches.map(b => b.cropType);
        const result = await getCarbonCreditInfo({ cropTypes });
        setIsLoading(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Carbon Credit Error', description: result.error });
            setInfo(null);
        } else if (result.info) {
            setInfo(result.info);
        }
    }

    useEffect(() => {
        fetchCarbonInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [batches]);
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Leaf className="w-7 h-7 text-green-600"/>
                    <div>
                        <CardTitle className="font-headline text-xl">Carbon Credits</CardTitle>
                        <CardDescription>Your estimated sustainability score.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : info ? (
                    <div className="space-y-3">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                            <h4 className="font-semibold text-muted-foreground">Estimated Credits Earned</h4>
                            <p className="font-bold text-2xl text-green-700">
                                {info.creditsEarned}
                            </p>
                        </div>
                        
                         <Alert className="border-green-200 text-green-800">
                            <Sparkles className="h-4 w-4 !text-green-700" />
                            <AlertTitle className="text-green-900">How it Works</AlertTitle>
                            <AlertDescription>
                                {info.explanation}
                            </AlertDescription>
                        </Alert>
                        
                        <Button variant="outline" size="sm" onClick={fetchCarbonInfo} className="w-full">
                           <RefreshCw className="mr-2 h-4 w-4"/> Refresh
                        </Button>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <p>No credit information available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
