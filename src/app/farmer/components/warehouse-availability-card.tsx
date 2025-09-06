'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { checkWarehouseSpace } from '@/lib/actions';
import { Loader2, Sparkles, Warehouse, Search, XCircle } from 'lucide-react';

type WarehouseStatus = {
    warehouseName: string;
    availability: string;
    suggestion?: string;
}

export function WarehouseAvailabilityCard() {
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<WarehouseStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const { toast } = useToast();

    const handleCheck = async () => {
        if (!location) {
            toast({ variant: "destructive", title: "Location required", description: "Please enter a location to check." });
            return;
        }
        setIsChecking(true);
        setError(null);
        setStatus(null);

        const result = await checkWarehouseSpace({ location });
        
        setIsChecking(false);
        
        if (result.error) {
            toast({ variant: 'destructive', title: 'Check Failed', description: result.error });
            setError(result.error);
            setStatus(null);
        } else if (result.status) {
            setStatus(result.status);
            toast({ title: 'Availability Checked!', description: `Status for ${result.status.warehouseName} updated.` });
        }
    }
    
    const handleReset = () => {
        setLocation('');
        setStatus(null);
        setError(null);
        setIsChecking(false);
    }

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'Available':
                return 'text-primary';
            case 'Limited Space':
                return 'text-yellow-600';
            case 'Full':
                return 'text-destructive';
            default:
                return 'text-muted-foreground';
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Warehouse className="w-7 h-7 text-primary"/>
                    <div>
                        <CardTitle className="font-headline text-xl">Warehouse Availability</CardTitle>
                        <CardDescription>Check for storage space in real-time.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!status && !error ? (
                    <div className="flex items-end gap-2">
                        <div className="flex-grow space-y-1">
                             <Label htmlFor="warehouse-location">Location</Label>
                             <Input 
                                id="warehouse-location" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Erode, Madurai"
                                disabled={isChecking}
                            />
                        </div>
                        <Button onClick={handleCheck} disabled={isChecking}>
                            {isChecking ? <Loader2 className="animate-spin" /> : <Search />}
                            Check
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                       {status && (
                         <>
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                                <h4 className="font-semibold">{status.warehouseName}</h4>
                                <p className={`font-bold text-lg ${getAvailabilityColor(status.availability)}`}>
                                    {status.availability}
                                </p>
                            </div>
                            {status.suggestion && (
                                <Alert>
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle>Alternative Suggested</AlertTitle>
                                    <AlertDescription>
                                        {status.suggestion}
                                    </AlertDescription>
                                </Alert>
                            )}
                         </>
                       )}
                       {error && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                       )}
                        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                           Check Another Location
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
