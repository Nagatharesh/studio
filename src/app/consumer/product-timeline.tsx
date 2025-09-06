'use client';

import type { TimelineEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, ClipboardCopy, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      {/* Icon and line */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${event.color}`}>
          <event.icon className="w-6 h-6 text-white" />
        </div>
        {!isLast && <div className="w-0.5 flex-grow bg-border mt-2"></div>}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <p className="text-sm text-muted-foreground -mt-1 mb-1">{event.timestamp}</p>
        <h3 className="font-headline text-xl font-semibold">{event.title}</h3>
        <p className="text-muted-foreground mt-1">{event.description}</p>
        
        <Card className="mt-4 bg-card/50">
            <CardContent className="p-4 space-y-2">
                {Object.entries(event.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                        <span className="font-semibold text-muted-foreground">{key}:</span>
                        <span className="text-right">{value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
        <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
            <p className="truncate pr-4">Hash: {event.hash}</p>
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={copyHash}>
                {copied ? <Check className="w-4 h-4 text-green-500"/> : <ClipboardCopy className="w-4 h-4"/>}
            </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductTimeline({ events, onReset }: { events: TimelineEvent[], onReset: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Product Journey</CardTitle>
                <CardDescription>
                    Tracing {events[0].data['Product'] || 'the product'} from farm to you.
                </CardDescription>
            </div>
            <Button variant="outline" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Another
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {events.map((event, index) => (
            <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
