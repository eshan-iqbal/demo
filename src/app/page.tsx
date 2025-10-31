'use client';

import { useState, useEffect } from 'react';
import { AwsResourceScanScene } from '@/components/scenes/AwsResourceScanScene';
import { ResourceMappingScene } from '@/components/scenes/ResourceMappingScene';
import { SecurityIssuesScene } from '@/components/scenes/SecurityIssuesScene';
import { MetricsAndDiffScene } from '@/components/scenes/MetricsAndDiffScene';
import { GitHubPrScene } from '@/components/scenes/GitHubPrScene';
import type { SecurityIssue } from '@/lib/data';
import { FileCode, RefreshCcw } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { Button } from '@/components/ui/button';

type Scene = 'welcome' | 'scan' | 'mapping' | 'issues' | 'metrics' | 'github' | 'done';

export default function Home() {
  const [scene, setScene] = useState<Scene>('welcome');
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(null);

  const handleIssueSelect = (issue: SecurityIssue) => {
    setSelectedIssue(issue);
    setScene('metrics');
  };
  
  const restartDemo = () => {
    setSelectedIssue(null);
    setScene('welcome');
  }
  
  useEffect(() => {
    if (scene === 'welcome') {
      const timer = setTimeout(() => setScene('scan'), 4000);
      return () => clearTimeout(timer);
    }
  }, [scene]);

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
        return <AwsResourceScanScene onComplete={() => setScene('mapping')} />;
      case 'mapping':
        return <ResourceMappingScene onComplete={() => setScene('issues')} />;
      case 'issues':
        return <SecurityIssuesScene onIssueSelect={handleIssueSelect} />;
      case 'metrics':
        if (!selectedIssue) return null;
        return <MetricsAndDiffScene issue={selectedIssue} onComplete={() => setScene('github')} />;
      case 'github':
        return <GitHubPrScene onComplete={() => setScene('done')} />;
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      <GridBackground />
      <header className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <FileCode className="w-8 h-8 text-accent"/>
          <h1 className="text-2xl font-bold font-headline">Terraform Pilot</h1>
        </div>
      </header>
      
      <div className="w-full h-[80vh] flex items-center justify-center">
        {renderScene()}
      </div>

      <footer className="absolute bottom-0 left-0 w-full p-4 text-center text-xs text-muted-foreground z-10">
        A demo application showcasing automated infrastructure security.
      </footer>
    </main>
  );
}
