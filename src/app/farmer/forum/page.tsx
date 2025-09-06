'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { getForumResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'other';
  author: string;
  avatar: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Has anyone tried the new drought-resistant paddy variety near Thanjavur? Seeing good results here.",
    sender: 'other',
    author: 'Ravi K.',
    avatar: 'https://i.pravatar.cc/150?u=ravi',
  },
  {
    id: 2,
    text: "I'm having trouble with pests on my tomato plants. Any organic suggestions?",
    sender: 'other',
    author: 'Anjali P.',
    avatar: 'https://i.pravatar.cc/150?u=anjali',
  },
];

export default function ForumPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?u=me',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    const result = await getForumResponse({ message: input });
    setIsSending(false);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else if (result.response) {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: result.response.response,
        sender: 'bot',
        author: 'Agri Officer Bot',
        avatar: '',
      };
      setMessages((prev) => [...prev, botMessage]);
    }
     setTimeout(scrollToBottom, 100);
  };

  return (
    <Card className="flex flex-col h-[70vh]">
        <CardContent className="flex-1 flex flex-col p-4 md:p-6">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message) => (
                    <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'justify-end' : ''
                    }`}
                    >
                    {message.sender !== 'user' && (
                        <Avatar className="h-9 w-9 border">
                        <AvatarImage src={message.avatar} alt={message.author} />
                        <AvatarFallback>
                            {message.sender === 'bot' ? <Bot /> : <User />}
                        </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                    >
                        <p className="text-sm font-semibold mb-1">{message.author}</p>
                        <p className="text-sm">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                        <Avatar className="h-9 w-9 border">
                        <AvatarImage src={message.avatar} alt={message.author} />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                </div>
            </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
            <div className="flex items-center gap-2">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question or share an update..."
                disabled={isSending}
            />
            <Button onClick={handleSend} disabled={isSending}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
            </div>
        </div>
    </Card>
  );
}
