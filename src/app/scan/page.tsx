'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GridBackground } from '@/components/ui/grid-background';
import {
  Server,
  Archive,
  Database,
  KeyRound,
  Network,
  Shield,
  Loader,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const services = [
  { name: 'EC2', Icon: Server, position: 'translate-x-0 -translate-y-48' },
  { name: 'S3', Icon: Archive, position: 'translate-x-48 translate-y-0' },
  { name: 'RDS', Icon: Database, position: 'translate-x-0 translate-y-48' },
  { name: 'IAM', Icon: KeyRound, position: '-translate-x-48 translate-y-0' },
  {
    name: 'VPC',
    Icon: Network,
    position: 'translate-x-32 -translate-y-32',
  },
  {
    name: 'Security Groups',
    Icon: Shield,
    position: '-translate-x-32 translate-y-32',
  },
];

const streamServices = [
  { name: 'EC2', Icon: Server },
  { name: 'S3', Icon: Archive },
  { name: 'RDS', Icon: Database },
  { name: 'IAM', Icon: KeyRound },
  { name: 'VPC', Icon: Network },
  { name: 'Lambda', Icon: GitBranch },
];

function HubAndSpokeScanner({ onComplete }: { onComplete: () => void }) {
  const [scanningService, setScanningService] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanningService((prev) => {
        if (prev < services.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          onComplete();
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center text-center w-[600px] h-[600px]">
      <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-primary/5 border border-primary/10 animate-[fade-in_1s_ease-out]">
        <div className="absolute w-full h-full rounded-full border border-primary/20 animate-ping"></div>
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="absolute bottom-4 text-sm text-primary/70">
          Scanning: {services[scanningService].name}
        </p>
      </div>

      {services.map((service, index) => {
        const isScanned = index <= scanningService;
        return (
          <div
            key={service.name}
            className={cn(
              'absolute transform transition-all duration-500',
              service.position,
              isScanned ? 'opacity-100' : 'opacity-30'
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-48 h-px bg-gradient-to-l from-primary/30 to-transparent"
              style={{
                transform: `rotate(${index * 60}deg) translateX(-50%)`,
                transformOrigin: 'left center',
                opacity: isScanned ? 1 : 0,
                transition: 'opacity 0.5s',
              }}
            >
              <div
                className={cn(
                  'absolute h-full bg-primary/80 transition-all duration-1000',
                  isScanned && index === scanningService ? 'w-full' : 'w-0'
                )}
                style={{
                  boxShadow: '0 0 5px hsl(var(--primary))',
                }}
              />
            </div>
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center bg-card border border-border transition-all duration-300',
                isScanned && 'border-primary/50 shadow-lg scale-110',
                isScanned &&
                  index === scanningService &&
                  'shadow-primary/20 animate-[pulse_1s_infinite]'
              )}
            >
              <service.Icon
                className={cn(
                  'w-8 h-8 text-muted-foreground transition-colors duration-300',
                  isScanned && 'text-primary'
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DigitalStreamScanner({ onComplete }: { onComplete: () => void }) {
  const [scanningIndex, setScanningIndex] = useState(-1);
  const [streamPosition, setStreamPosition] = useState(-110);

  useEffect(() => {
    const serviceInterval = setInterval(() => {
      setScanningIndex((prev) => {
        if (prev < streamServices.length - 1) {
          return prev + 1;
        }
        clearInterval(serviceInterval);
        onComplete();
        return prev;
      });
    }, 1000);
    return () => clearInterval(serviceInterval);
  }, [onComplete]);

  useEffect(() => {
    const streamInterval = setInterval(() => {
        setStreamPosition(p => p > 110 ? -110 : p + 0.5);
    }, 10);
    return () => clearInterval(streamInterval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center text-center w-full h-96 p-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/50 to-transparent">
             <div className="absolute w-full h-24 bg-gradient-to-t from-green-500 to-transparent blur-xl" style={{ top: `${streamPosition}%` }} />
        </div>
      </div>

      <div className="relative w-full max-w-sm space-y-4">
        {streamServices.map((service, index) => {
          const isScanning = index === scanningIndex;
          const isScanned = index < scanningIndex;
          return (
            <div
              key={service.name}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg border bg-card transition-all duration-500',
                isScanning ? 'border-green-400/50 shadow-lg shadow-green-500/10 scale-105' : 'border-border',
                isScanned ? 'opacity-50' : 'opacity-90'
              )}
            >
              <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                  isScanning ? 'border-green-400/50 bg-green-500/10' : 'border-border',
                  isScanned ? 'bg-muted' : ''
              )}>
                 <service.Icon className={cn('w-6 h-6 transition-colors', isScanning ? 'text-green-400' : 'text-muted-foreground')} />
              </div>
              <p className="font-mono text-lg">{service.name}</p>
              <div className="flex-1 text-right">
                  {isScanning && <p className="text-sm text-green-400 animate-pulse">Scanning...</p>}
                  {isScanned && <CheckCircle2 className="w-5 h-5 text-primary inline-block" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ScanPage() {
  const router = useRouter();
  const [scanComplete, setScanComplete] = useState(false);
  const [theme, setTheme] = useState<'hub' | 'stream'>('hub');

  const handleScanComplete = () => {
    setScanComplete(true);
  };

  useEffect(() => {
    if (scanComplete) {
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  }, [scanComplete, router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      <GridBackground />
      <div className="absolute inset-0 bg-gradient-to-radial from-transparent via-background/50 to-background"></div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setTheme(theme === 'hub' ? 'stream' : 'hub')}
        className="absolute top-6 right-6 z-20"
      >
        Toggle Theme
      </Button>

      {scanComplete ? (
        <div className="relative flex flex-col items-center justify-center text-center w-[600px] h-[600px]">
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-primary/5 border border-primary/10">
                <CheckCircle2 className="w-16 h-16 text-green-400 animate-[fade-in_0.5s_ease-out]" />
                <p className="absolute bottom-4 text-sm text-primary/70">Scan Complete</p>
            </div>
        </div>
      ) : (
        <>
            {theme === 'hub' && <HubAndSpokeScanner onComplete={handleScanComplete} />}
            {theme === 'stream' && <DigitalStreamScanner onComplete={handleScanComplete} />}
        </>
      )}
    </div>
  );
}

    