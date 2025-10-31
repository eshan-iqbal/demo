'use client';

import * as React from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SceneInfo = {
  key: string;
  duration: number;
  title: string;
};

interface TimelineControlsProps {
  scenes: SceneInfo[];
  currentSceneIndex: number;
  isPlaying: boolean;
  onSetScene: (index: number) => void;
  onPlayPause: () => void;
  onRestart: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function TimelineControls({
  scenes,
  currentSceneIndex,
  isPlaying,
  onSetScene,
  onPlayPause,
  onRestart,
  onNext,
  onPrev,
}: TimelineControlsProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isPlaying) {
      const currentSceneDuration = scenes[currentSceneIndex].duration;
      if (currentSceneDuration === Infinity) {
        setProgress(100);
        return;
      }
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = (elapsedTime / currentSceneDuration) * 100;
        setProgress(newProgress >= 100 ? 100 : newProgress);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [currentSceneIndex, isPlaying, scenes]);

  const currentScene = scenes[currentSceneIndex];
  const totalScenes = scenes.length - 1; // Exclude "Done" from numbered scenes

  return (
    <TooltipProvider>
      <div className="absolute bottom-0 left-0 w-full p-4 z-20">
        <div className="bg-background/80 dark:bg-neutral-900/80 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl p-3 w-full max-w-4xl mx-auto">
          <div className="w-full mb-3 px-1">
            <Progress value={progress} className="h-1.5" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {scenes.map((scene, index) => {
                if (scene.key === 'done') return null;
                return (
                  <Tooltip key={scene.key}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={
                          index === currentSceneIndex ? 'default' : 'outline'
                        }
                        className={cn(
                          'h-8 w-8 p-0 text-xs transition-all duration-300',
                          index === currentSceneIndex
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-background/50 hover:bg-muted'
                        )}
                        onClick={() => onSetScene(index)}
                      >
                        {index + 1}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{scene.title}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onPrev}
                    disabled={currentSceneIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 h-10 w-10"
                    onClick={onPlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? 'Pause' : 'Play'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onRestart}
                    className={cn(currentSceneIndex === 0 && "opacity-50 cursor-not-allowed")}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Restart</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onNext}
                    disabled={currentSceneIndex === scenes.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-4 w-[200px] justify-end">
              <div className="text-right">
                <p className="font-semibold text-sm">
                  Scene {currentSceneIndex + 1} of {totalScenes}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentScene.title}{' '}
                  {currentScene.duration !== Infinity &&
                    `(${(currentScene.duration / 1000).toFixed(0)}s)`}
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is an automated demo of Terraform Pilot.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
