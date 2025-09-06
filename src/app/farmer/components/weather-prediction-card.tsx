
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getWeatherForecast } from '@/lib/actions';
import { Loader2, Sparkles, Thermometer, Sun, Cloud, CloudRain, Search } from 'lucide-react';

type Forecast = {
    forecast: string;
    temperature: string;
    recommendation: string;
}

export function WeatherPredictionCard() {
    const [forecast, setForecast] = useState<Forecast | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState('');
    const { toast } = useToast();

    const fetchWeather = async () => {
        if (!location) {
            toast({ variant: "destructive", title: "Location Required", description: "Please enter a location to get the forecast." });
            return;
        }
        setIsLoading(true);
        setForecast(null);
        const result = await getWeatherForecast({ location });
        setIsLoading(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Weather Error', description: result.error });
            setForecast(null);
        } else if (result.forecast) {
            toast({ title: 'Forecast Loaded!', description: `Weather for ${location} is now displayed.` });
            setForecast(result.forecast);
        }
    }

    const getWeatherIcon = (forecast: string = '') => {
        const lowerForecast = forecast.toLowerCase();
        if (lowerForecast.includes('rain') || lowerForecast.includes('thunderstorm')) {
            return <CloudRain className="w-8 h-8 text-blue-500" />;
        }
        if (lowerForecast.includes('cloud')) {
            return <Cloud className="w-8 h-8 text-gray-500" />;
        }
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
    
    const handleReset = () => {
        setLocation('');
        setForecast(null);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Thermometer className="w-7 h-7 text-primary"/>
                    <div>
                        <CardTitle className="font-headline text-xl">AI Weather Forecast</CardTitle>
                        <CardDescription>Get a 3-day outlook for any location.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!forecast ? (
                     <div className="space-y-2">
                        <div className="flex items-end gap-2">
                            <div className="flex-grow space-y-1">
                                <Label htmlFor="weather-location">Location</Label>
                                <Input 
                                    id="weather-location" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Thanjavur"
                                    disabled={isLoading}
                                />
                            </div>
                            <Button onClick={fetchWeather} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                                Get Forecast
                            </Button>
                        </div>
                         {isLoading && (
                            <div className="flex items-center justify-center h-24">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                             <p className="text-sm font-semibold text-muted-foreground">3-Day Forecast for {location}</p>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                            <div className="flex items-center justify-center gap-4">
                                {getWeatherIcon(forecast.forecast)}
                                <div>
                                    <h4 className="font-semibold">{forecast.forecast}</h4>
                                    <p className="font-bold text-lg text-primary">{forecast.temperature}</p>
                                </div>
                            </div>
                        </div>
                        
                         <Alert>
                            <Sparkles className="h-4 w-4" />
                            <AlertTitle>Farming Tip</AlertTitle>
                            <AlertDescription>
                                {forecast.recommendation}
                            </AlertDescription>
                        </Alert>

                         <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                           Check Another Location
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
