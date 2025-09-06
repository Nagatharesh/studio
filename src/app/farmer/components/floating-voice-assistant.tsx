
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
import { useToast } from '@/hooks/use-toast';
import { getVoiceAssistance } from '@/lib/actions';
import { Loader2, Mic, Square, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);

export function FloatingVoiceAssistant() {
  const [transcript, setTranscript] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Speech recognition is not supported in your browser.',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ta-IN'; // Set to Tamil

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
             toast({ variant: 'destructive', title: 'Permission Denied', description: 'Please allow microphone access.' });
        } else {
             toast({ variant: 'destructive', title: 'Recognition Error', description: `An error occurred: ${event.error}` });
        }
        setIsRecording(false);
    };
    
    recognition.onend = () => {
        setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [toast]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      // Logic to send transcript is now handled after recognition 'end' event
    } else {
      setTranscript('');
      setAudioSrc(null);
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            recognitionRef.current?.start();
            setIsRecording(true);
        })
        .catch(err => {
            toast({ variant: 'destructive', title: 'Microphone Error', description: 'Could not access the microphone. Please check permissions.' });
        });
    }
  };


  const handleGetAssistance = async (text: string) => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'No question recorded',
        description: 'Please say something to ask the assistant.',
      });
      return;
    }
    setIsProcessing(true);
    setIsLoading(true);
    setAudioSrc(null);

    const result = await getVoiceAssistance({ query: text });
    setIsLoading(false);
    setIsProcessing(false);

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
      setTimeout(() => {
        audioRef.current?.play().catch(e => console.error("Audio autoplay failed:", e));
      }, 100);
    }
  };
  
   useEffect(() => {
    if (!isRecording && transcript.trim()) {
      handleGetAssistance(transcript);
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isRecording]);


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
             AI Voice Assistant (Tamil)
          </SheetTitle>
          <SheetDescription>
            Press the microphone button to ask a question. The response will play automatically.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 h-full flex flex-col items-center justify-center">
            
            <Button 
                onClick={handleToggleRecording} 
                disabled={isLoading || !SpeechRecognition}
                size="lg"
                className={cn("h-24 w-24 rounded-full transition-all duration-300", 
                    isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90',
                    (isLoading || isProcessing) && 'bg-muted-foreground'
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-10 w-10 animate-spin" />
                ) : isProcessing ? (
                    <BrainCircuit className="h-10 w-10 animate-pulse" />
                ) : isRecording ? (
                    <Square className="h-10 w-10" />
                ) : (
                    <Mic className="h-10 w-10" />
                )}
            </Button>
            
            <p className="text-center text-muted-foreground min-h-[4em]">
                {isRecording ? 'Listening...' : (isLoading || isProcessing) ? 'Processing...' : 'Press the button to speak'}
            </p>

            <div className="w-full p-2 border rounded-md min-h-[6em] bg-muted/50">
                <p className="font-semibold text-sm">Your Question:</p>
                <p className="italic text-muted-foreground">{transcript || "..."}</p>
            </div>
            
            <div className="flex-grow w-full flex items-center justify-center">
            {audioSrc ? (
              <div className="p-2 border rounded-md bg-muted w-full">
                <audio ref={audioRef} src={audioSrc} controls className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
             ) : (
                <div className="text-center text-muted-foreground p-4">
                     {isLoading ? <p>Assistant is thinking...</p> : <p>Audio response will appear here.</p>}
                </div>
             )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
