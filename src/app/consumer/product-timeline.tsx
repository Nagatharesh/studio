
'use client';

import type { TimelineEvent, ProductDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Check, ArrowLeft, Star, Leaf, MessageSquare, ShoppingCart, MapPin, DollarSign, Truck } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapView } from './components/map-view';
import { FarmerIcon, AgentIcon, ConsumerIcon } from '@/components/icons';
import Link from 'next/link';


function TimelineItem({ event, isLast }: { event: TimelineEvent, isLast: boolean }) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const icons = {
        Farmer: FarmerIcon,
        Agent: AgentIcon,
        Consumer: ConsumerIcon
    }

    const Icon = icons[event.icon] || Leaf;


    const copyHash = () => {
        navigator.clipboard.writeText(event.hash);
        setCopied(true);
        toast({ title: "Copied!", description: "Transaction hash copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {!isLast && <div className="w-0.5 flex-grow bg-border mt-2"></div>}
      </div>

      <div className="flex-1 pb-10">
        <p className="text-sm text-muted-foreground -mt-1 mb-1">{event.timestamp}</p>
        <h3 className="font-headline text-lg font-semibold">{event.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{event.description}</p>
        
        <Card className="mt-3 bg-card/50 text-sm">
            <CardContent className="p-3 space-y-1">
                {Object.entries(event.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                        <span className="font-semibold text-muted-foreground">{key}:</span>
                        <span className="text-right">{value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
        <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <p className="truncate pr-4">Hash: {event.hash}</p>
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={copyHash}>
                {copied ? <Check className="w-3.5 h-3.5 text-green-500"/> : <ClipboardCopy className="w-3.5 h-3.5"/>}
            </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductTimeline({ product, events }: { product: ProductDetails, events: TimelineEvent[] }) {
  const { toast } = useToast();

  const handleBuyNow = () => {
    toast({
        title: "Purchase Successful!",
        description: `You have purchased ${product.name}. Thank you for your trust in GreenLedger.`,
    });
  }
  
  const getProductHint = (name: string) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('tomato')) return 'vine tomatoes';
    if (lowerCaseName.includes('potato')) return 'potatoes';
    if (lowerCaseName.includes('cauliflower')) return 'cauliflower head';
    if (lowerCaseName.includes('brinjal') || lowerCaseName.includes('eggplant')) return 'eggplant';
    if (lowerCaseName.includes('spinach') || lowerCaseName.includes('greens')) return 'spinach greens';
    if (lowerCaseName.includes('onion')) return 'red onions';
    return 'vegetable product';
  }

  const locations = events
    .filter(e => e.icon === 'Farmer' || e.icon === 'Agent')
    .map(e => ({
        name: e.icon === 'Farmer' ? e.data['Origin']?.split(',')[0] || 'Unknown Farm' : 'Central Warehouse',
        role: e.icon as 'Farmer' | 'Agent'
    }));

  const priceHistory = events
    .flatMap(event => Object.entries(event.data))
    .filter(([key]) => key.toLowerCase().includes('price from') || key.toLowerCase().includes('transportation cost'))
    .map(([label, value]) => ({ label, value }));


  return (
    <Card>
       <CardHeader className="flex flex-row justify-between items-center sticky top-0 bg-background/95 z-10 py-4">
        <div className="flex-1">
             <Button variant="outline" asChild>
                <Link href="/consumer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Marketplace
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Image & Map */}
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <div className="aspect-video relative">
                        <Image 
                            data-ai-hint={getProductHint(product.name)}
                            src={product.image}
                            alt={product.name}
                            fill
                            className="w-full object-cover"
                        />
                    </div>
                </Card>
                 <div>
                    <h3 className="font-headline text-lg font-semibold flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-primary"/> Product Journey Map</h3>
                    <MapView locations={locations} />
                </div>
            </div>

            {/* Right Column: Actions & Quick Info */}
            <div className="space-y-6">
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-3xl font-bold font-headline text-consumer">{product.price}</span>
                            <Badge variant="outline" className="text-base py-1 px-3 border-green-600 bg-green-50 text-green-700">
                                <Leaf className="mr-2 h-4 w-4" /> {product.quality.includes('Organic') ? 'Organic' : 'Verified'}
                            </Badge>
                        </div>
                         <div className="space-y-2">
                            <h1 className="font-headline text-2xl font-bold">{product.name}</h1>
                            <p className="text-muted-foreground">Sold by: <span className="font-semibold text-foreground">{product.farmer}</span></p>
                             <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${product.rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}/>
                                    ))}
                                </div>
                                <span className="font-semibold">{product.rating}</span>
                                <span className="text-muted-foreground">({product.reviews} ratings)</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="font-semibold">Quality Grade: <span className="font-normal text-muted-foreground">{product.quality} (Verified)</span></p>
                            <p className="font-semibold">Origin: <span className="font-normal text-muted-foreground">{events[0].data['Origin']}</span></p>
                        </div>
                        <Button size="lg" className="w-full bg-consumer hover:bg-consumer/90" onClick={handleBuyNow}>
                            <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                        </Button>
                         <Button size="lg" variant="outline" className="w-full">
                            <Star className="mr-2 h-5 w-5" /> Add to Favorites
                        </Button>
                        <Button size="lg" variant="outline" className="w-full">
                            <MessageSquare className="mr-2 h-5 w-5" /> Write a Review
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Separator className="my-8" />
        
        {priceHistory.length > 0 && <div>
            <h2 className="font-headline text-xl font-semibold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600"/> Price History</h2>
            <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-3">
                    {priceHistory.map((item, index) => (
                       <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                                {item.label.toLowerCase().includes('transport') && <Truck className="w-4 h-4" />}
                                {item.label}:
                            </span>
                            <span className="font-semibold">{item.value}</span>
                        </div>
                    ))}
                    <Separator />
                     <div className="flex justify-between items-center text-base">
                        <span className="font-bold">Final Consumer Price:</span>
                        <span className="font-bold text-lg text-consumer">{product.price}</span>
                    </div>
                </CardContent>
            </Card>
        </div>}


        <Separator className="my-8" />
        
        {/* Bottom Section: Timeline */}
        <div>
            <h2 className="font-headline text-xl font-semibold mb-4">Blockchain-Verified Journey</h2>
             {events.map((event, index) => (
                <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
