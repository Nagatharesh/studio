
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
import { useToast } from '@/hooks/use-toast';
import { getVoiceAssistance } from '@/lib/actions';
import { Loader2, Mic, Send } from 'lucide-react';

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
        title: 'Question Required',
        description: 'Please enter your question for the assistant.',
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
        description: 'The AI assistant has responded.',
      });
      // Auto-play the audio response
      setTimeout(() => {
        audioRef.current?.play().catch(e => console.error("Audio autoplay failed:", e));
      }, 100);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center z-50"
        >
          <Mic className="h-8 w-8 text-primary-foreground" />
          <span className="sr-only">Open Voice Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-headline flex items-center gap-3">
             <Mic className="w-7 h-7 text-primary" />
             AI Voice Assistant (Tamil)
          </SheetTitle>
          <SheetDescription>
            Ask a question and get a spoken response in Tamil. The response will play automatically.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 h-full flex flex-col">
            <div className="flex items-center gap-2">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask your question here..."
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && handleGetAssistance()}
                />
                <Button onClick={handleGetAssistance} disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="animate-spin" />
                    ) : (
                    <Send />
                    )}
                    <span className="sr-only">Send</span>
                </Button>
            </div>
            <div className="flex-grow flex items-center justify-center">
            {audioSrc ? (
              <div className="p-2 border rounded-md bg-muted w-full">
                <audio ref={audioRef} src={audioSrc} controls className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
             ) : (
                <div className="text-center text-muted-foreground p-4">
                    {isLoading ? (
                        <p>Assistant is thinking...</p>
                    ) : (
                        <p>Your audio response will appear here.</p>
                    )}
                </div>
             )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
