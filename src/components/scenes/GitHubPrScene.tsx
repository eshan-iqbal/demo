'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CheckCircle, GitCommit, GitPullRequest } from 'lucide-react';
import { commits, timelineSteps } from '@/lib/data';

interface GitHubPrSceneProps {
  onComplete: () => void;
}

const GithubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 fill-current">
    <title>GitHub</title>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export function GitHubPrScene({ onComplete }: GitHubPrSceneProps) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  useEffect(() => {
    setShow(true);
    const stepInterval = setInterval(() => {
      setStep(prev => (prev < timelineSteps.length -1 ? prev + 1 : prev));
    }, 2000);

    const mergeTimeout = setTimeout(() => {
        setIsMerged(true);
    }, 8000);

    const completeTimeout = setTimeout(() => {
        onComplete();
    }, 10000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(mergeTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-8 text-foreground transition-opacity duration-1000", show ? "opacity-100" : "opacity-0")}>
      <div className="w-full max-w-3xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 relative">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-2xl overflow-hidden">
          <CardHeader className="flex-row items-center gap-4 border-b">
            <GithubIcon/>
            <div>
              <CardTitle className="text-2xl font-headline font-semibold">my-infra-repo</CardTitle>
              <CardDescription>Pull Request #42</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold mb-4 animate-typewriter whitespace-nowrap overflow-hidden border-r-2 border-r-accent">Automated Infrastructure PR</h2>
            </div>
            
            <div className="space-y-3">
              {commits.map((commit, index) => (
                <div key={commit.id} className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-left-5 duration-500" style={{animationDelay: `${2000 + index * 300}ms`}}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/github.png" alt="bot avatar" />
                    <AvatarFallback>🤖</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-sm">
                    <span className="text-muted-foreground">{commit.message}</span>
                  </div>
                  <GitCommit className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs">f3a1b2c</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 animate-in fade-in-0 duration-1000 delay-[5000ms]">
                <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5 animate-bounce delay-[5500ms]" />
                    <span className="font-semibold">All checks have passed</span>
                </div>
            </div>

            <div className="pt-4 animate-in zoom-in-95 duration-500 delay-[6000ms]">
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white animate-glow" disabled={isMerged}>
                {isMerged ? <><CheckCircle className="w-5 h-5 mr-2"/> Merged</> : <><GitPullRequest className="w-5 h-5 mr-2"/> Merge Pull Request</> }
              </Button>
            </div>
            
            <div className="relative pt-6">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2" />
              <div className="flex justify-between relative">
                {timelineSteps.map((s, index) => (
                  <div key={s} className="z-10 flex flex-col items-center">
                    <div className={cn("w-4 h-4 rounded-full bg-border transition-colors duration-500", step >= index && "bg-accent")}></div>
                    <p className={cn("mt-2 text-xs transition-colors duration-500", step >= index ? "text-foreground" : "text-muted-foreground")}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {isMerged && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in-0 duration-500">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">All changes merged successfully!</h2>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
