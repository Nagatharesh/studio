
'use client';

import { Sprout, Warehouse, CheckCircle } from 'lucide-react';
import type { Batch } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from 'next/image';

interface SingleBatchMapViewProps {
  batch: Batch;
}

const locationPositions: { [key: string]: { top: string; left: string } } = {
  'Erode': { top: '35%', left: '40%' },
  'Thanjavur': { top: '75%', left: '65%' },
  'Cuddalore': { top: '60%', left: '85%' },
  'Coimbatore': { top: '55%', left: '20%' },
  'Madurai': { top: '80%', left: '40%' },
  'Default': { top: '50%', left: '50%' },
};

const statusStyles = {
  IN_WAREHOUSE: { icon: Warehouse, color: 'bg-accent text-accent-foreground' },
  VERIFIED: { icon: CheckCircle, color: 'bg-green-500 text-white' },
  FARMED: { icon: Sprout, color: 'bg-primary text-primary-foreground' },
  RETAIL: { icon: CheckCircle, color: 'bg-green-500 text-white' }
};

export function SingleBatchMapView({ batch }: SingleBatchMapViewProps) {
  const Icon = statusStyles[batch.status]?.icon || Sprout;
  const color = statusStyles[batch.status]?.color || 'bg-gray-400 text-white';
  const position = locationPositions[batch.location.split(',')[0]] || locationPositions['Default'];
  
  return (
    <TooltipProvider>
    <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden border">
      <Image
        data-ai-hint="map tamil nadu"
        src="https://images.pexels.com/photos/16839369/pexels-photo-16839369/free-photo-of-a-map-of-the-world-with-a-red-arrow-pointing-to-the-bottom.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Map of Tamil Nadu"
        fill
        className="object-cover opacity-30"
      />
      
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer"
                style={{ top: position.top, left: position.left, zIndex: 2 }}
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background animate-pulse ${color}`}>
                <Icon className="w-6 h-6" />
                </div>
            </div>
        </TooltipTrigger>
        <TooltipContent>
             <div className="p-1 text-sm">
                <p className="font-bold">{batch.cropType}</p>
                <p className="text-muted-foreground">{batch.id}</p>
                <p className="text-xs">{batch.location}</p>
                <p className="text-xs capitalize">Status: {batch.status.replace('_', ' ').toLowerCase()}</p>
             </div>
        </TooltipContent>
      </Tooltip>
    </div>
    </TooltipProvider>
  );
}
