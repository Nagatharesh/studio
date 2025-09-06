'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { checkWarehouseSpace } from '@/lib/actions';
import { Loader2, Sparkles, Warehouse, Search } from 'lucide-react';

type WarehouseStatus = {
    warehouseName: string;
    availability: string;
    suggestion?: string;
}

export function WarehouseAvailabilityCard() {
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<WarehouseStatus | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const { toast } = useToast();

    const handleCheck = async () => {
        if (!location) {
            toast({ variant: "destructive", title: "Location required", description: "Please enter a location to check." });
            return;
        }
        setIsChecking(true);
        const result = await checkWarehouseSpace({ location });
        setIsChecking(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Check Failed', description: result.error });
        } else if (result.status) {
            setStatus(result.status);
            toast({ title: 'Availability Checked!', description: `Status for ${result.status.warehouseName} updated.` });
        }
    }
    
    const handleReset = () => {
        setLocation('');
        setStatus(null);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Warehouse className="w-7 h-7 text-primary"/>
                    <div>
                        <CardTitle className="font-headline text-xl">Warehouse Availability</CardTitle>
                        <CardDescription>Check for storage space.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!status ? (
                    <div className="flex items-end gap-2">
                        <div className="flex-grow space-y-1">
                             <Label htmlFor="warehouse-location">Location</Label>
                             <Input 
                                id="warehouse-location" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Erode"
                            />
                        </div>
                        <Button onClick={handleCheck} disabled={isChecking}>
                            {isChecking ? <Loader2 className="animate-spin" /> : <Search />}
                            Check
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                            <h4 className="font-semibold">{status.warehouseName}</h4>
                            <p className={`font-bold text-lg ${
                                status.availability === 'Available' ? 'text-primary' : 
                                status.availability === 'Limited Space' ? 'text-yellow-600' : 'text-destructive'
                            }`}>
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
                        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                           Check Another Location
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
