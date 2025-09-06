
'use client';

import { useState, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getVoiceAssistance } from '@/lib/actions';
import { Loader2, Mic, BrainCircuit, Send, Volume2 } from 'lucide-react';

export function FloatingVoiceAssistant() {
  const [query, setQuery] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleGetAssistance = async () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'No question provided',
        description: 'Please type a question to ask the assistant.',
      });
      return;
    }
    setIsLoading(true);
    setAudioSrc(null);

    const result = await getVoiceAssistance({ query });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Assistant Error',
        description: result.error,
      });
    } else if (result.audioDataUri) {
      setAudioSrc(result.audioDataUri);
      toast({
        title: 'Response Ready!',
        description: 'The AI assistant has responded in Tamil.',
      });
      setTimeout(() => {
        audioRef.current?.play().catch(e => console.error("Audio autoplay failed:", e));
      }, 100);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center z-50 animate-pulse"
        >
          <Mic className="h-8 w-8 text-primary-foreground" />
          <span className="sr-only">Open Voice Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-headline flex items-center gap-3">
             <Mic className="w-7 h-7 text-primary" />
             AI Voice Assistant (English to Tamil)
          </SheetTitle>
          <SheetDescription>
            Type a question in English below. The response will be spoken in Tamil.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 h-full flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="question-input">Your Question (in English)</Label>
              <div className="flex items-center gap-2">
                <Input 
                    id="question-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGetAssistance()}
                    placeholder="e.g., How to treat yellow leaves?"
                    disabled={isLoading}
                />
                <Button onClick={handleGetAssistance} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
              </div>
            </div>
            
            <div className="flex-grow w-full flex items-center justify-center border-t pt-4">
            {isLoading ? (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                    <BrainCircuit className="w-10 h-10 animate-pulse text-primary"/>
                    <p>Assistant is thinking...</p>
                </div>
            ) : audioSrc ? (
              <div className="p-4 border rounded-md bg-muted w-full space-y-2 text-center">
                 <Label className="flex items-center justify-center gap-2">
                    <Volume2 className="w-4 h-4"/> 
                    Tamil Audio Response
                 </Label>
                <audio ref={audioRef} src={audioSrc} controls className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
             ) : (
                <div className="text-center text-muted-foreground p-4">
                     <p>Audio response will appear here.</p>
                </div>
             )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
