
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import type { ProductDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: ProductDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  
  const getProductHint = (name: string) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('tomato')) return 'vine tomatoes';
    if (lowerCaseName.includes('potato')) return 'potatoes';
    if (lowerCaseName.includes('cauliflower')) return 'cauliflower head';
    if (lowerCaseName.includes('brinjal') || lowerCaseName.includes('eggplant')) return 'eggplant';
    if (lowerCaseName.includes('palak') || lowerCaseName.includes('spinach') || lowerCaseName.includes('greens')) return 'spinach greens';
    if (lowerCaseName.includes('onion') || lowerCaseName.includes('shallots')) return 'red onions';
    return 'vegetable product';
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "Purchase Successful!",
        description: `You have purchased ${product.name}.`,
    });
  }

  return (
    <Card className="group overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative aspect-video">
          <Image
            data-ai-hint={getProductHint(product.name)}
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4 space-y-2 flex flex-col flex-grow">
          <h3 className="font-headline font-semibold text-base truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">by {product.farmer}</p>
          <div className="flex-grow"></div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews})</span>
            </div>
            <p className="font-semibold text-primary">{product.price}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" /> View
            </Button>
             <Button className="w-full bg-consumer hover:bg-consumer/90" onClick={handleBuyNow}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
