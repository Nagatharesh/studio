
'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getVoiceAssistance } from '@/lib/actions';
import { Loader2, Mic, Send } from 'lucide-react';

export function VoiceAssistantCard() {
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
        audioRef.current?.play();
      }, 100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mic className="w-7 h-7 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl">
              AI Voice Assistant (Tamil)
            </CardTitle>
            <CardDescription>
              Ask a question and get a spoken response in Tamil.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {audioSrc && (
          <div className="p-2 border rounded-md bg-muted">
            <audio ref={audioRef} src={audioSrc} controls className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
