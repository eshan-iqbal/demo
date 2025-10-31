'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mappedResources, type MappedResource } from '@/lib/data';
import { cn } from '@/lib/utils';
import { FileCode, GitBranch } from 'lucide-react';

interface ResourceMappingSceneProps {
  onComplete: () => void;
}

const ItemCard = ({ item, isVisible }: { item: MappedResource; isVisible: boolean }) => (
  <div className={cn(
      "transition-all duration-700 ease-in-out",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    )}>
    <Card className="bg-primary/10">
      <CardContent className="p-4 flex items-center gap-4">
        <item.Icon className="w-6 h-6 text-accent" />
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.type}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const StatusCard = ({ title, status, isVisible, children }: { title: string; status: string; isVisible: boolean; children: React.ReactNode }) => (
  <div className={cn(
      "flex flex-col items-center transition-all duration-700 ease-in-out",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
    {children}
    <p className="mt-2 text-sm font-semibold">{title}</p>
    <p className="text-xs text-muted-foreground">{status}</p>
  </div>
);

const ConnectingLine = ({ isVisible, finalGlow }: { isVisible: boolean, finalGlow: boolean }) => (
  <div className="flex-1 min-w-16 h-0.5 bg-border relative">
    <div
      className={cn(
        "absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-out",
        isVisible ? "w-full" : "w-0",
        finalGlow && "animate-glow shadow-accent"
      )}
    />
  </div>
);

export function ResourceMappingScene({ onComplete }: ResourceMappingSceneProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const [finalGlow, setFinalGlow] = useState(false);

  useEffect(() => {
    setShow(true);
    const totalDuration = 10000;
    const itemDuration = totalDuration / mappedResources.length;

    mappedResources.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * itemDuration);
    });

    setTimeout(() => {
      setFinalGlow(true);
    }, totalDuration);

    setTimeout(onComplete, totalDuration + 2000); // 2s glow
  }, [onComplete]);

  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-8 text-foreground transition-opacity duration-1000", show ? "opacity-100" : "opacity-0")}>
      <div className="w-full max-w-6xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline font-semibold">Resource Mapping</CardTitle>lng>
          </CardHeader>
          <CardContent className="p-8 space-y-12">
            {mappedResources.map((item, index) => {
              const isItemVisible = visibleItems.includes(index);
              const isStateVisible = visibleItems.length > index;
              const isCodeVisible = visibleItems.length > index;

              return (
                <div key={item.id} className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4">
                  {/* Cloud Resource */}
                  <ItemCard item={item} isVisible={isItemVisible} />

                  <ConnectingLine isVisible={isStateVisible} finalGlow={finalGlow} />

                  {/* Terraform State */}
                  <StatusCard title="Terraform State" status={`${item.match}% Match`} isVisible={isStateVisible}>
                    <div className={cn("transition-transform duration-500 delay-500", isStateVisible ? 'scale-100' : 'scale-0')}>
                      <GitBranch className="w-10 h-10 text-accent" />
                    </div>
                  </StatusCard>

                  <ConnectingLine isVisible={isCodeVisible} finalGlow={finalGlow} />

                  {/* Terraform Code */}
                  <StatusCard title="Terraform Code" status="✓ Mapped" isVisible={isCodeVisible}>
                    <div className={cn("relative transition-transform duration-500 delay-1000", isCodeVisible ? 'scale-100' : 'scale-0')}>
                      <FileCode className="w-10 h-10 text-accent" />
                      <div className={cn(
                        "absolute -bottom-2 -right-2 transition-all duration-500 delay-[1500ms]",
                        isCodeVisible ? 'opacity-100' : 'opacity-0'
                      )}>
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded font-mono">{item.terraformFile}</span>
                      </div>
                    </div>
                  </StatusCard>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
