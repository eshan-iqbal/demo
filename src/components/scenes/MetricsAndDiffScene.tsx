'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis } from "recharts";
import { BrainCircuit, Loader2, Wand2, BarChart } from 'lucide-react';
import type { SecurityIssue } from '@/lib/data';
import { generateTerraformFix } from '@/ai/flows/generate-terraform-fix';
import { explainTerraformFix } from '@/ai/flows/explain-terraform-fix';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MetricsAndDiffSceneProps {
  issue: SecurityIssue;
  onComplete: () => void;
}

const chartData = [
  { metric: 'Risk Score', before: 85, after: 15 },
  { metric: 'Compliance', before: 60, after: 100 },
  { metric: 'Cost Impact', before: 50, after: 50 },
];

const chartConfig = {
  before: { label: 'Before', color: 'hsl(var(--destructive))' },
  after: { label: 'After', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

function CodeDiff({ oldCode, newCode }: { oldCode: string; newCode: string }) {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-code text-sm">
      <div>
        <h3 className="font-semibold mb-2">Current Code</h3>
        <pre className="p-4 rounded-md bg-destructive/10 text-destructive-foreground/80 overflow-x-auto h-64">
          {oldLines.map((line, i) => (
            <div key={`old-${i}`} className="flex">
              <span className="w-8 select-none text-right pr-2 opacity-50">{i + 1}</span>
              <code className="flex-1">{line}</code>
            </div>
          ))}
        </pre>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Suggested Fix</h3>
        <pre className="p-4 rounded-md bg-green-500/10 text-green-300/80 overflow-x-auto h-64 animate-code-typewriter">
          {newLines.map((line, i) => (
            <div key={`new-${i}`} className="flex">
              <span className="w-8 select-none text-right pr-2 opacity-50">{i + 1}</span>
              <code className="flex-1">{line}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

export function MetricsAndDiffScene({ issue, onComplete }: MetricsAndDiffSceneProps) {
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setShow(true);
    const generateFix = async () => {
      try {
        setIsLoading(true);
        // Stagger the AI calls for a better perceived performance
        const fixResult = await generateTerraformFix({
          securityIssueDescription: issue.description,
          currentTerraformCode: issue.currentTerraformCode,
        });
        
        await new Promise(resolve => setTimeout(resolve, 500)); // artificial delay
        setFixedCode(fixResult.fixedTerraformCode);

        const explanationResult = await explainTerraformFix({
          terraformFix: fixResult.fixedTerraformCode,
        });
        setExplanation(explanationResult.explanation);

      } catch (error) {
        console.error('Error generating fix:', error);
        toast({
          variant: 'destructive',
          title: 'AI Error',
          description: 'Could not generate a fix for the issue.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    generateFix();
    
    const timer = setTimeout(() => onComplete(), 9000); // Increased duration
    return () => clearTimeout(timer);

  }, [issue, toast, onComplete]);

  return (
    <div className={cn("flex flex-col items-center justify-center h-full w-full p-8 text-foreground transition-opacity duration-1000", show ? "opacity-100" : "opacity-0")}>
      <div className="w-full max-w-6xl space-y-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
          <CardHeader>
            <CardTitle className="text-2xl font-headline font-semibold">Analysis & Suggested Fix</CardTitle>
            <CardDescription>{issue.title}</CardDescription>
          </CardHeader>
          <CardContent className="grid lg:grid-cols-2 gap-6 p-8">
            <div className="animate-in fade-in-0 duration-500 delay-200">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart className="w-5 h-5 text-accent"/> Impact Metrics</h3>
               <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <RechartsBarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="metric" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="before" stackId="a" fill="var(--color-before)" radius={[0, 4, 4, 0]} barSize={30} />
                  <Bar dataKey="after" stackId="a" fill="var(--color-after)" radius={[0, 4, 4, 0]} barSize={30} />
                </RechartsBarChart>
              </ChartContainer>
            </div>
            <div className="animate-in fade-in-0 duration-500 delay-400">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-accent" /> AI Explanation</h3>
              {isLoading && !explanation ? (
                <div className="space-y-2 h-full flex flex-col justify-center">
                   <div className="h-4 bg-muted/20 rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted/20 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-muted/20 rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted/20 rounded w-4/6 animate-pulse" />
                </div>
              ) : (
                <Alert className="h-full animate-in fade-in duration-500">
                  <Wand2 className="h-4 w-4" />
                  <AlertTitle>Explanation</AlertTitle>
                  <AlertDescription>
                    {explanation || 'No explanation available.'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-2xl animate-in fade-in-0 duration-500 delay-600">
          <CardHeader>
            <CardTitle>Code Diff</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !fixedCode ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="ml-4">Generating fix...</p>
              </div>
            ) : fixedCode ? (
              <CodeDiff oldCode={issue.currentTerraformCode} newCode={fixedCode} />
            ) : (
              <p>Could not generate a fix.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
