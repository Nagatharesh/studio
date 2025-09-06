
'use client';

import type { TimelineEvent, ProductDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Check, RefreshCw, Star, Leaf, MessageSquare, ShoppingCart, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from './components/product-card';
import { MapView } from './components/map-view';

function TimelineItem({ event, isLast }: { event: TimelineEvent, isLast: boolean }) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

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
          <event.icon className="w-5 h-5 text-white" />
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

const similarProducts = [
    {
      name: 'Himalayan Potatoes',
      image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: '₹30 / kg',
      farmer: 'Nilgiri Growers',
      rating: 4.6,
      reviews: 110,
    },
    {
      name: 'Fresh Cauliflower',
      image: 'https://images.pexels.com/photos/162875/cauliflower-white-healthy-vegetables-162875.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: '₹25 / piece',
      farmer: 'Ooty Farms',
      rating: 4.8,
      reviews: 98,
    },
    {
      name: 'Organic Spinach Greens',
      image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: '₹20 / bunch',
      farmer: 'Cauvery Delta Farmers',
      rating: 4.9,
      reviews: 180,
    },
  ];

export function ProductTimeline({ product, events, onReset }: { product: ProductDetails, events: TimelineEvent[], onReset: () => void }) {
  const { toast } = useToast();

  const handleBuyNow = () => {
    toast({
        title: "Purchase Successful!",
        description: `You have purchased ${product.name}. Thank you for your trust in AgriChain.`,
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

  const locations = [
      { name: events[0].data['Origin'], role: 'Farmer' },
      { name: 'Erode Warehouse', role: 'Agent' },
      { name: 'Coimbatore Retail', role: 'Consumer' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Product Details</CardTitle>
                <CardDescription>
                    Complete journey from farm to you, verified by AgriChain.
                </CardDescription>
            </div>
            <Button variant="outline" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Another
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Image & Map */}
            <div className="space-y-4">
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
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Product Journey Map</h3>
                <MapView locations={locations} />
            </div>

            {/* Right Column: Actions & Quick Info */}
            <div className="space-y-6">
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-3xl font-bold font-headline text-consumer">{product.price}</span>
                            <Badge variant="outline" className="text-base py-1 px-3 border-green-600 bg-green-50 text-green-700">
                                <Leaf className="mr-2 h-4 w-4" /> Organic
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
                            <p className="font-semibold">Quality Grade: <span className="font-normal text-muted-foreground">{product.quality} (Verified by Agent)</span></p>
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
        
        {/* Bottom Section: Timeline */}
        <div>
            <h2 className="font-headline text-xl font-semibold mb-4">Blockchain-Verified Journey</h2>
             {events.map((event, index) => (
                <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
            ))}
        </div>

        <Separator className="my-12" />

         {/* You Might Also Like Section */}
         <div>
            <h2 className="font-headline text-xl font-semibold mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarProducts.map((p) => (
                   <ProductCard key={p.name} product={p} />
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
