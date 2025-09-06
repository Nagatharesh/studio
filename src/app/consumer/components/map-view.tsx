
'use client';

import { MapPin, Sprout, Building2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Location {
  name: string;
  role: 'Farmer' | 'Agent' | 'Consumer';
}

interface MapViewProps {
  locations: Location[];
}

const roleStyles = {
  Farmer: { icon: Sprout, color: 'bg-primary' },
  Agent: { icon: Building2, color: 'bg-accent' },
  Consumer: { icon: ShoppingCart, color: 'bg-consumer' },
};

const positionMap: { [key: number]: { top: string; left: string } } = {
  0: { top: '20%', left: '15%' },
  1: { top: '50%', left: '50%' },
  2: { top: '30%', left: '85%' },
};

export function MapView({ locations }: MapViewProps) {
  return (
    <div className="relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border">
      <Image
        data-ai-hint="map tamil nadu"
        src="https://images.pexels.com/photos/16839369/pexels-photo-16839369/free-photo-of-a-map-of-the-world-with-a-red-arrow-pointing-to-the-bottom.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Map of Tamil Nadu"
        fill
        className="object-cover opacity-20"
      />
      
      {/* Connection path */}
      <svg width="100%" height="100%" className="absolute inset-0" style={{ zIndex: 1 }}>
        <defs>
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
        </defs>
        <path 
            d="M 15% 20% C 35% 35%, 35% 65%, 50% 50% S 65% 35%, 85% 30%" 
            stroke="hsl(var(--foreground) / 0.5)" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="8"
            className="animate-path-draw"
        />
      </svg>

      {/* Location markers */}
      {locations.map((loc, index) => {
        const Icon = roleStyles[loc.role].icon;
        const color = roleStyles[loc.role].color;
        const position = positionMap[index];
        return (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ top: position.top, left: position.left, zIndex: 2 }}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="px-2 py-0.5 bg-card border rounded-md shadow-sm text-center">
              <p className="text-xs font-semibold">{loc.name}</p>
              <p className="text-[10px] text-muted-foreground">{loc.role}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
