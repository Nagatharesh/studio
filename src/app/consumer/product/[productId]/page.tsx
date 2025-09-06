
'use client';

import { ProductTimeline } from '../../product-timeline';
import { MOCK_DATA } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const productData = MOCK_DATA[productId];

  if (!productData) {
    return (
      <div className="container py-8 text-center">
         <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-destructive"/>
                    Product Not Found
                </CardTitle>
                <CardDescription>
                    The product ID you're looking for does not exist in our records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">It might have been moved, or the ID is incorrect.</p>
                <Button asChild>
                    <Link href="/consumer">Back to Marketplace</Link>
                </Button>
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ProductTimeline product={productData.details} events={productData.history} />
    </div>
  );
}

