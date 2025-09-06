
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

interface LogisticsMapProps {
  batches: Batch[];
  selectedBatchId: string | null;
  onSelectBatch: (id: string) => void;
}

const locationPositions: { [key: string]: { top: string; left: string } } = {
  'Erode': { top: '35%', left: '40%' },
  'Thanjavur': { top: '75%', left: '65%' },
  'Cuddalore': { top: '60%', left: '85%' },
  'Coimbatore': { top: '55%', left: '20%' },
  'Madurai': { top: '80%', left: '40%' },
  'Warehouse': {top: '50%', left: '50%'},
  'Default': { top: '50%', left: '50%' },
};

const statusStyles = {
  IN_WAREHOUSE: { icon: Warehouse, color: 'bg-accent text-accent-foreground' },
  VERIFIED: { icon: CheckCircle, color: 'bg-green-500 text-white' },
  FARMED: { icon: Sprout, color: 'bg-primary text-primary-foreground' },
  RETAIL: { icon: CheckCircle, color: 'bg-green-500 text-white' }
};

export function LogisticsMap({ batches, selectedBatchId, onSelectBatch }: LogisticsMapProps) {
  const warehousePosition = locationPositions['Warehouse'];

  return (
    <TooltipProvider>
    <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden border">
      <style>
        {`
            @keyframes draw {
                to {
                    stroke-dashoffset: 0;
                }
            }
            .animate-path-draw {
                stroke-dashoffset: 1000;
                animation: draw 3s ease-out forwards;
            }
        `}
      </style>
      <Image
        data-ai-hint="map tamil nadu"
        src="https://images.pexels.com/photos/208535/pexels-photo-208535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Map of Tamil Nadu"
        fill
        className="object-cover opacity-30"
      />
      
      {/* Route lines */}
      <svg width="100%" height="100%" className="absolute inset-0" style={{ zIndex: 1 }}>
        {batches.filter(b => b.status === 'IN_WAREHOUSE').map(batch => {
            const startPos = locationPositions[batch.location] || locationPositions['Default'];
            return (
                <path 
                    key={`line-${batch.id}`}
                    d={`M ${startPos.left} ${startPos.top} C ${startPos.left} ${warehousePosition.top}, ${warehousePosition.left} ${startPos.top}, ${warehousePosition.left} ${warehousePosition.top}`}
                    stroke="hsl(var(--accent) / 0.6)" 
                    strokeWidth="2.5"
                    fill="none" 
                    strokeDasharray="5"
                    className="animate-path-draw"
                />
            )
        })}
      </svg>
      
      {/* Batch markers */}
      {batches.map((batch) => {
        const Icon = statusStyles[batch.status]?.icon || Sprout;
        const color = statusStyles[batch.status]?.color || 'bg-gray-400 text-white';
        const position = locationPositions[batch.location.split(',')[0]] || locationPositions['Default'];
        const isSelected = batch.id === selectedBatchId;
        
        return (
          <Tooltip key={batch.id}>
            <TooltipTrigger asChild>
                <div
                    onClick={() => onSelectBatch(batch.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer"
                    style={{ top: position.top, left: position.left, zIndex: 10 }}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${color} ${isSelected ? 'ring-4 ring-offset-2 ring-accent ring-offset-background' : 'ring-2 ring-background'}`}>
                    <Icon className="w-5 h-5" />
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
        );
      })}

      {/* Warehouse Marker */}
       <Tooltip>
        <TooltipTrigger asChild>
            <div
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={{ top: warehousePosition.top, left: warehousePosition.left, zIndex: 5 }}
            >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg bg-card border-2 border-primary">
                    <Warehouse className="w-7 h-7 text-primary" />
                </div>
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p className="font-bold">Central Warehouse</p>
        </TooltipContent>
       </Tooltip>

    </div>
    </TooltipProvider>
  );
}
