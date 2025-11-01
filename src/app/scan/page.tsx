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
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function ScanPage() {
  const router = useRouter();
  const [scanningService, setScanningService] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanningService((prev) => {
        if (prev < services.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setScanComplete(true);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

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

      <div className="relative flex flex-col items-center justify-center text-center w-[600px] h-[600px]">
        {/* Central Hub */}
        <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-primary/5 border border-primary/10 animate-[fade-in_1s_ease-out]">
           <div className="absolute w-full h-full rounded-full border border-primary/20 animate-ping"></div>
          {scanComplete ? (
            <CheckCircle2 className="w-16 h-16 text-green-400 animate-[fade-in_0.5s_ease-out]" />
          ) : (
            <Loader className="w-12 h-12 text-primary animate-spin" />
          )}
           <p className="absolute bottom-4 text-sm text-primary/70">
            {scanComplete ? 'Scan Complete' : `Scanning: ${services[scanningService].name}`}
           </p>
        </div>

        {/* Service Icons and connection lines */}
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
              {/* Connection Line */}
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
                  className={cn("absolute h-full bg-primary/80 transition-all duration-1000", isScanned && index === scanningService ? 'w-full' : 'w-0')}
                  style={{
                    boxShadow: '0 0 5px hsl(var(--primary))'
                  }}
                />
              </div>

              {/* Icon */}
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center bg-card border border-border transition-all duration-300',
                  isScanned && 'border-primary/50 shadow-lg scale-110',
                   isScanned && index === scanningService && 'shadow-primary/20 animate-[pulse_1s_infinite]'
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
    </div>
  );
}