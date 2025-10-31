'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { awsResources, type AwsResource } from '@/lib/data';
import { Cloud, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AwsResourceScanSceneProps {
  onComplete: () => void;
}

export function AwsResourceScanScene({ onComplete }: AwsResourceScanSceneProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Scanning...');
  const [discovered, setDiscovered] = useState<AwsResource[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const sceneDuration = 8000;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (sceneDuration / 100);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setStatus('Complete');
          return 100;
        }
        return newProgress;
      });
    }, 100);

    const discoveryTimers = awsResources.map((resource, index) => {
      return setTimeout(() => {
        setDiscovered((prev) => [...prev, resource]);
      }, (index + 1) * 1500);
    });

    const completeTimeout = setTimeout(onComplete, sceneDuration);

    return () => {
      clearInterval(progressInterval);
      discoveryTimers.forEach(clearTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-8 text-foreground transition-opacity duration-1000", show ? "opacity-100" : "opacity-0")}>
        <div className="w-full max-w-4xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-2xl">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-headline font-semibold">Scanning AWS Environment</h1>
                        <div className="flex items-center gap-2 text-lg font-medium">
                        {status === 'Scanning...' ? (
                            <Cloud className="w-6 h-6 animate-pulse text-accent" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        )}
                        <span>{status}</span>
                        </div>
                    </div>
                    <Progress value={progress} className="w-full mb-8 h-3" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[180px]">
                        {awsResources.map((resource, index) => {
                          const isDiscovered = discovered.some(d => d.id === resource.id);
                          return (
                            <div
                              key={resource.id}
                              className={cn(
                                "relative transition-all duration-500",
                                isDiscovered ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-90"
                              )}
                            >
                                <Card className="p-6 flex flex-col items-center justify-center gap-4 hover:bg-accent/10 transition-colors duration-300 h-full">
                                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }} />
                                <div className="p-3 bg-accent/20 rounded-full">
                                    <resource.Icon className="w-8 h-8 text-accent" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-lg">{resource.type}</p>
                                    <p className="text-muted-foreground text-sm font-mono">{resource.name}</p>
                                </div>
                                </Card>
                                { isDiscovered &&
                                  <div className={cn(
                                    "absolute inset-0 rounded-lg border-2 border-accent pointer-events-none animate-in fade-in zoom-in-95",
                                    "duration-500 delay-200"
                                  )} />
                                }
                            </div>
                          )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
