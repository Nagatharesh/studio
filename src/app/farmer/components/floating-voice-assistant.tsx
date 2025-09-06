
'use client';

import { useState, useRef, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getVoiceAssistance } from '@/lib/actions';
import { Loader2, Mic, Send, Volume2, User, Bot } from 'lucide-react';

type Message = {
  id: number;
  type: 'user' | 'bot';
  text: string;
  audioSrc?: string;
}

export function FloatingVoiceAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleGetAssistance = async () => {
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'No question provided',
        description: 'Please type a question to ask the assistant.',
      });
      return;
    }
    
    const newUserMessage: Message = {
        id: Date.now(),
        type: 'user',
        text: query,
    }
    setMessages(prev => [...prev, newUserMessage]);
    setQuery('');
    setIsLoading(true);

    const result = await getVoiceAssistance({ query });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Assistant Error',
        description: result.error,
      });
    } else if (result.response) {
      const newBotMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: result.response.textResponse,
        audioSrc: result.response.audioDataUri,
      }
      setMessages(prev => [...prev, newBotMessage]);

      // Auto-play the response audio
      if (audioRef.current) {
        audioRef.current.src = result.response.audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
      }
    }
    setTimeout(scrollToBottom, 100);
  };
  
  const playAudio = (src: string) => {
    if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }

  return (
    <>
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center z-50 animate-pulse"
        >
          <Mic className="h-8 w-8 text-primary-foreground" />
          <span className="sr-only">Open Voice Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline flex items-center gap-3">
             <Mic className="w-7 h-7 text-primary" />
             AI Voice Assistant
          </SheetTitle>
          <SheetDescription>
            Type a question in English. The response will be in Tamil (text and audio).
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-4 py-4">
                    {messages.map(message => (
                        <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                             {message.type === 'bot' && (
                                <Avatar className="h-8 w-8 border bg-primary text-primary-foreground">
                                    <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                                </Avatar>
                             )}
                              <div className={`max-w-xs rounded-lg p-3 ${
                                    message.type === 'user'
                                        ? 'bg-muted'
                                        : 'bg-primary/10'
                                    }`}
                                >
                                 <p className="text-sm">{message.text}</p>
                                 {message.type === 'bot' && message.audioSrc && (
                                    <Button variant="ghost" size="icon" className="w-7 h-7 mt-2" onClick={() => playAudio(message.audioSrc)}>
                                        <Volume2 className="w-4 h-4 text-primary"/>
                                    </Button>
                                 )}
                             </div>
                             {message.type === 'user' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                                </Avatar>
                             )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs rounded-lg p-3 bg-primary/10 flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-primary"/>
                                <p className="text-sm text-primary">Thinking...</p>
                            </div>
                         </div>
                    )}
                </div>
            </ScrollArea>
        </div>
        <div className="border-t pt-4">
            <div className="flex items-center gap-2">
            <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGetAssistance()}
                placeholder="Ask a question in English..."
                disabled={isLoading}
            />
            <Button onClick={handleGetAssistance} disabled={isLoading || !query.trim()}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
    <audio ref={audioRef} className="hidden" />
    </>
  );
}
