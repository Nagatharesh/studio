
'use client';

import { Sprout, Warehouse, CheckCircle } from 'lucide-react';
import type { Batch } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AgentMapViewProps {
  batches: Batch[];
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

export function AgentMapView({ batches }: AgentMapViewProps) {
  return (
    <TooltipProvider>
    <div className="relative w-full h-[500px] bg-muted/30 rounded-lg overflow-hidden border">
      {/* Background grid */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"></path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
         <text x="50%" y="50" textAnchor="middle" className="font-headline text-lg fill-muted-foreground/50">Tamil Nadu Region</text>
      </svg>
      

      {/* Batch markers */}
      {batches.map((batch) => {
        const Icon = statusStyles[batch.status]?.icon || Sprout;
        const color = statusStyles[batch.status]?.color || 'bg-gray-400 text-white';
        const position = locationPositions[batch.location] || locationPositions['Default'];
        
        return (
          <Tooltip key={batch.id}>
            <TooltipTrigger asChild>
                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer"
                    style={{ top: position.top, left: position.left, zIndex: 2 }}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background ${color}`}>
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
    </div>
    </TooltipProvider>
  );
}
