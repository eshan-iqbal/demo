'use client';

import { useState, useEffect, useCallback } from 'react';
import { AwsResourceScanScene } from '@/components/scenes/AwsResourceScanScene';
import { ResourceMappingScene } from '@/components/scenes/ResourceMappingScene';
import { SecurityIssuesScene } from '@/components/scenes/SecurityIssuesScene';
import { MetricsAndDiffScene } from '@/components/scenes/MetricsAndDiffScene';
import { GitHubPrScene } from '@/components/scenes/GitHubPrScene';
import type { SecurityIssue } from '@/lib/data';
import { RefreshCcw } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { Button } from '@/components/ui/button';
import { securityIssues } from '@/lib/data';
import { TimelineControls } from '@/components/ui/timeline-controls';

export type Scene = 'welcome' | 'scan' | 'mapping' | 'issues' | 'metrics' | 'github' | 'done';

export default function Home() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenes: { key: Scene, duration: number, title: string }[] = [
    { key: 'welcome', duration: 4000, title: 'Welcome' },
    { key: 'scan', duration: 8000, title: 'AWS Resource Scan' },
    { key: 'mapping', duration: 8000, title: 'Resource Mapping' },
    { key: 'issues', duration: 5000, title: 'Security Issues' },
    { key: 'metrics', duration: 9000, title: 'Analysis & Fix' },
    { key: 'github', duration: 10000, title: 'GitHub PR' },
    { key: 'done', duration: Infinity, title: 'Complete' },
  ];

  const scene = scenes[currentSceneIndex].key;

  const handleSceneComplete = useCallback(() => {
    setCurrentSceneIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < scenes.length) {
        if (scenes[nextIndex].key === 'issues') {
          const highSeverityIssue = securityIssues.find(i => i.severity === 'High');
          if (highSeverityIssue) {
            setSelectedIssue(highSeverityIssue);
          }
        }
        return nextIndex;
      }
      setIsPlaying(false);
      return prevIndex;
    });
  }, [scenes.length]);
  
  useEffect(() => {
    if (isPlaying && scene !== 'done') {
      const timer = setTimeout(handleSceneComplete, scenes[currentSceneIndex].duration);
      return () => clearTimeout(timer);
    }
  }, [currentSceneIndex, isPlaying, handleSceneComplete, scene, scenes]);

  const restartDemo = () => {
    setSelectedIssue(null);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
  }

  const handleSetScene = (index: number) => {
    if(index === 0) {
      restartDemo();
      return;
    }
    setCurrentSceneIndex(index);
    setIsPlaying(false);
  }

  const renderScene = () => {
    switch (scene) {
      case 'welcome':
        return (
          <div className="text-center animate-in fade-in-0 zoom-in-95 duration-1000">
            <h1 className="text-5xl font-bold">Welcome to Terraform Pilot</h1>
            <p className="text-xl text-muted-foreground mt-4">Automating infrastructure security, one commit at a time.</p>
          </div>
        );
      case 'scan':
        return <AwsResourceScanScene onComplete={handleSceneComplete} />;
      case 'mapping':
        return <ResourceMappingScene onComplete={handleSceneComplete} />;
      case 'issues':
        return <SecurityIssuesScene onComplete={handleSceneComplete} selectedIssue={selectedIssue} />;
      case 'metrics':
        if (!selectedIssue) return null;
        return <MetricsAndDiffScene issue={selectedIssue} onComplete={handleSceneComplete} />;
      case 'github':
        return <GitHubPrScene onComplete={handleSceneComplete} />;
      case 'done':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in-0 duration-1000">
            <h1 className="text-4xl font-bold mb-4">Demo Complete</h1>
            <p className="text-xl text-muted-foreground mb-8">Terraform Pilot has successfully secured your infrastructure.</p>
            <Button onClick={restartDemo}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Restart Demo
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 pt-20 pb-40 relative overflow-hidden">
      <GridBackground />
      
      <div className="w-full h-full flex-grow flex items-center justify-center">
        {renderScene()}
      </div>

      <TimelineControls
        scenes={scenes}
        currentSceneIndex={currentSceneIndex}
        isPlaying={isPlaying}
        onSetScene={handleSetScene}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onRestart={restartDemo}
        onNext={() => handleSetScene(Math.min(scenes.length - 1, currentSceneIndex + 1))}
        onPrev={() => handleSetScene(Math.max(0, currentSceneIndex - 1))}
      />
    </main>
  );
}
