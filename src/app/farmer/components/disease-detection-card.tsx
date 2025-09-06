'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getDiseaseDiagnosis } from '@/lib/actions';
import { Upload, Leaf, ShieldCheck, Bug, Camera, RefreshCw, Loader2, Sparkles } from 'lucide-react';

type Diagnosis = {
  disease: string;
  remedy: string;
}

export function DiseaseDetectionCard() {
    const [preview, setPreview] = useState<string | null>(null);
    const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
    const [isDiagnosing, setIsDiagnosing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isCameraMode, setIsCameraMode] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        let stream: MediaStream | null = null;
        const getCameraPermission = async () => {
          if (isCameraMode) {
              try {
                stream = await navigator.mediaDevices.getUserMedia({video: true});
                setHasCameraPermission(true);
        
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                  variant: 'destructive',
                  title: 'Camera Access Denied',
                  description: 'Please enable camera permissions in your browser settings.',
                });
              }
          }
        };
    
        getCameraPermission();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, [isCameraMode, toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setDiagnosis(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDiagnose = async () => {
        if (!preview) {
            toast({ variant: "destructive", title: "No image provided", description: "Please upload or capture a photo of a crop leaf." });
            return;
        }
        setIsDiagnosing(true);
        const result = await getDiseaseDiagnosis({ photoDataUri: preview });
        setIsDiagnosing(false);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Diagnosis Failed', description: result.error });
        } else if (result.diagnosis) {
            setDiagnosis(result.diagnosis);
            toast({ title: 'Diagnosis Complete!', description: 'AI has analyzed the leaf image.' });
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            setPreview(dataUri);
            setDiagnosis(null);
            setIsCameraMode(false);
        }
    }

    const handleReset = () => {
        setPreview(null);
        setDiagnosis(null);
        setIsCameraMode(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <Card className="w-full">
             <CardHeader>
                <div className="flex items-center gap-3">
                    <Leaf className="w-7 h-7 text-primary"/>
                    <div>
                        <CardTitle className="font-headline text-xl">AI Disease Detection</CardTitle>
                        <CardDescription>Upload a leaf photo or use your camera.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden relative">
                        {isCameraMode ? (
                             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        ) : preview ? (
                             <Image src={preview} alt="Crop leaf preview" width={200} height={200} className="w-auto h-full object-cover"/>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <Upload className="mx-auto h-8 w-8 mb-2"/>
                                <p>Image preview will appear here.</p>
                            </div>
                        )}
                        {isCameraMode && hasCameraPermission === false && (
                             <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                                <Alert variant="destructive" className="max-w-sm">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera access in your browser to use this feature.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                   
                    {preview && !diagnosis && (
                        <div className="w-full grid grid-cols-2 gap-2">
                             <Button variant="outline" onClick={handleReset} className="w-full">
                                <RefreshCw /> Reset
                            </Button>
                             <Button onClick={handleDiagnose} disabled={isDiagnosing} className="w-full">
                                {isDiagnosing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                {isDiagnosing ? 'Analyzing...' : 'Diagnose Leaf'}
                            </Button>
                        </div>
                    )}

                    {!preview && !isCameraMode &&
                        <div className="w-full grid grid-cols-2 gap-2">
                            <Button variant="outline" onClick={handleUploadClick} className="w-full">
                                <Upload/> Upload Image
                            </Button>
                            <Button variant="outline" onClick={() => setIsCameraMode(true)} className="w-full">
                                <Camera/> Use Camera
                            </Button>
                        </div>
                    }

                    {isCameraMode && (
                        <div className="w-full grid grid-cols-2 gap-2">
                            <Button variant="outline" onClick={() => setIsCameraMode(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCapture} disabled={hasCameraPermission === false}>
                                <Camera /> Capture
                            </Button>
                        </div>
                    )}


                     {diagnosis && (
                        <div className="w-full space-y-4 text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex flex-col items-center">
                                {diagnosis.disease !== 'Healthy' ? <Bug className="w-8 h-8 text-destructive"/> : <ShieldCheck className="w-8 h-8 text-primary"/>}
                                <h3 className="font-headline text-lg font-semibold mt-2">{diagnosis.disease}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{diagnosis.remedy}</p>
                            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">Start New Diagnosis</Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
