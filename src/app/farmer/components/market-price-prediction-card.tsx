
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getMarketPricePrediction } from '@/lib/actions';
import { Loader2, TrendingUp, Sparkles, BarChart, ArrowUp, ArrowDown, Minus } from 'lucide-react';

type Prediction = {
    predictedPriceRange: string;
    trend: string;
    recommendation: string;
}

export function MarketPricePredictionCard() {
    const [cropName, setCropName] = useState('');
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const { toast } = useToast();

    const handlePredict = async () => {
        if (!cropName) {
            toast({ variant: "destructive", title: "Crop Name Required", description: "Please enter a crop name to predict its price." });
            return;
        }
        setIsPredicting(true);
        const result = await getMarketPricePrediction({ cropName });
        setIsPredicting(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Prediction Failed', description: result.error });
            setPrediction(null);
        } else if (result.prediction) {
            setPrediction(result.prediction);
            toast({ title: 'Prediction Complete!', description: `Market forecast for ${cropName} is ready.` });
        }
    }
    
    const handleReset = () => {
        setCropName('');
        setPrediction(null);
    }

    const getTrendInfo = (trend: string) => {
        if (trend.includes('Increase')) {
            return { icon: ArrowUp, color: 'text-primary' };
        }
        if (trend.includes('Decrease')) {
            return { icon: ArrowDown, color: 'text-destructive' };
        }
        return { icon: Minus, color: 'text-yellow-600' };
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BarChart className="w-7 h-7 text-primary"/>
                    <div>
                        <CardTitle className="font-headline text-xl">Market Price Prediction</CardTitle>
                        <CardDescription>Forecast crop prices with AI.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!prediction ? (
                    <div className="flex items-end gap-2">
                        <div className="flex-grow space-y-1">
                             <Label htmlFor="crop-name">Crop Name</Label>
                             <Input 
                                id="crop-name" 
                                value={cropName}
                                onChange={(e) => setCropName(e.target.value)}
                                placeholder="e.g., Turmeric"
                            />
                        </div>
                        <Button onClick={handlePredict} disabled={isPredicting}>
                            {isPredicting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            Predict
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                            <h4 className="font-semibold text-muted-foreground">Predicted Price for {cropName}</h4>
                            <p className="font-bold text-lg text-primary">
                                {prediction.predictedPriceRange}
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm mt-1">
                                {(() => {
                                    const { icon: Icon, color } = getTrendInfo(prediction.trend);
                                    return <Icon className={`w-4 h-4 ${color}`} />;
                                })()}
                                <span className="font-semibold">{prediction.trend}</span>
                            </div>
                        </div>
                        
                         <Alert>
                            <TrendingUp className="h-4 w-4" />
                            <AlertTitle>Analyst Recommendation</AlertTitle>
                            <AlertDescription>
                                {prediction.recommendation}
                            </AlertDescription>
                        </Alert>
                        
                        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                           Check Another Crop
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
