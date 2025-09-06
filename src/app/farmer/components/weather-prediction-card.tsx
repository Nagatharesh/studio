'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getWeatherForecast } from '@/lib/actions';
import { Loader2, Sparkles, Thermometer, Sun, Cloud, CloudRain } from 'lucide-react';

type Forecast = {
    forecast: string;
    temperature: string;
    recommendation: string;
}

export function WeatherPredictionCard() {
    const [forecast, setForecast] = useState<Forecast | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState('Erode'); // Default location
    const { toast } = useToast();

    const fetchWeather = async () => {
        setIsLoading(true);
        const result = await getWeatherForecast({ location });
        setIsLoading(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Weather Error', description: result.error });
            setForecast(null);
        } else if (result.forecast) {
            setForecast(result.forecast);
        }
    }

    useEffect(() => {
        fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Thermometer className="w-7 h-7 text-primary"/>
                    <div>
                        <CardTitle className="font-headline text-xl">AI Weather Forecast</CardTitle>
                        <CardDescription>3-day outlook for {location}.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : forecast ? (
                    <div className="space-y-3">
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
                    </div>
                ) : (
                     <div className="text-center text-muted-foreground p-4">
                        <p>Could not load weather forecast.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
