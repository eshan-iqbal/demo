'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { securityIssues, type SecurityIssue } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface SecurityIssuesSceneProps {
  onComplete: () => void;
  selectedIssue: SecurityIssue | null;
}

const severityStyles = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export function SecurityIssuesScene({ onComplete, selectedIssue }: SecurityIssuesSceneProps) {
  const [visibleIssues, setVisibleIssues] = useState<SecurityIssue[]>([]);
  const [show, setShow] = useState(false);
  const [isIssueSelected, setIsIssueSelected] = useState(false);

  useEffect(() => {
    setShow(true);
    const timers = securityIssues.map((issue, index) => {
      return setTimeout(() => {
        setVisibleIssues(prev => [...prev, issue]);
      }, index * 200);
    });
    
    let selectTimeout: NodeJS.Timeout;
    if (selectedIssue) {
        selectTimeout = setTimeout(() => {
            setIsIssueSelected(true);
        }, securityIssues.length * 200 + 1000);
    }

    const completeTimeout = setTimeout(() => {
        onComplete();
    }, securityIssues.length * 200 + 2500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(selectTimeout);
      clearTimeout(completeTimeout);
    }
  }, [onComplete, selectedIssue]);


  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-8 text-foreground transition-opacity duration-1000", show ? "opacity-100" : "opacity-0")}>
      <div className="w-full max-w-6xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline font-semibold">Security Issues Detected</CardTitle>
            <CardDescription>An issue will be automatically selected to generate a fix.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityIssues.map((issue, index) => {
                const isVisible = visibleIssues.some(i => i.id === issue.id);
                const isTheSelectedIssue = selectedIssue?.id === issue.id;

                return (
                  <div
                    key={issue.id}
                    className={cn(
                      "transition-all duration-500 [transform-style:preserve-3d]",
                      isVisible ? "opacity-100 translate-y-0 rotate-x-0" : "opacity-0 translate-y-10 rotate-x-[-45deg]",
                      "origin-bottom"
                    )}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <Card
                      className={cn(
                        "group transition-all duration-300 hover:shadow-2xl relative overflow-hidden h-full flex flex-col",
                        severityStyles[issue.severity],
                        isIssueSelected && isTheSelectedIssue ? 'border-accent scale-105 shadow-2xl' : 'hover:-translate-y-2'
                      )}
                    >
                      {isTheSelectedIssue && <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-glow" />}
                      <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <issue.Icon className="w-8 h-8" />
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </CardContent>
                      <CardFooter className="flex-wrap gap-2 text-xs">
                        <Badge variant="secondary" className="font-mono">{issue.resourceName}</Badge>
                        <Badge variant="outline" className="font-mono">{issue.scanId}</Badge>
                        <Badge variant="outline" className="font-mono">{issue.policy}</Badge>
                      </CardFooter>
                       {isTheSelectedIssue && (
                          <div className="absolute inset-0 bg-gradient-to-t from-accent/0 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       )}
                       {isIssueSelected && isTheSelectedIssue && (
                         <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in-0 duration-500">
                           <CheckCircle className="w-12 h-12 text-accent" />
                         </div>
                       )}
                    </Card>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
