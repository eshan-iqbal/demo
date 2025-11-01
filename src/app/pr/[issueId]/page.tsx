'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { securityIssues } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, GitMerge, GitPullRequest, Github, Loader2 } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function PRPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;
  const [issue, setIssue] = useState<any>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  useEffect(() => {
    const foundIssue = securityIssues.find((i) => i.id === issueId);
    setIssue(foundIssue);
  }, [issueId]);

  const handleMerge = async () => {
    setIsMerging(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsMerged(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push(`/verify/${issueId}`);
  };
  
  if (!issue) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GridBackground />
       <div className="relative container mx-auto p-6 md:p-10 z-10">
        <Button variant="ghost" onClick={() => router.push('/')} className="absolute top-6 left-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-2xl animate-[fade-in-up_0.5s_ease-out] shadow-2xl">
                <CardHeader className="p-4 border-b">
                    <div className="flex items-center space-x-4">
                        <GitPullRequest className="w-8 h-8 text-green-500" />
                        <div>
                            <CardTitle className="text-xl">Fix for: {issue.title}</CardTitle>
                            <CardDescription>Pull request #12 opened by Terraform Pilot</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/github.png" alt="GitHub" />
                            <AvatarFallback>TP</AvatarFallback>
                        </Avatar>
                        <div className="border rounded-lg p-4 flex-1 bg-muted/30">
                            <p className="font-semibold">Terraform Pilot</p>
                            <p className="text-sm text-muted-foreground mt-1">This PR addresses the <span className="font-medium text-foreground">{issue.title}</span> security vulnerability by applying the recommended Terraform configuration changes.</p>
                        </div>
                    </div>
                    
                     <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-2 border-b font-mono text-sm">main.tf</div>
                        <pre className="p-4 text-xs font-code overflow-x-auto">
                            <code className="text-red-400/80">-   {issue.currentTerraformCode.split('\n').join('\n-   ')}</code>
                            <br />
                            <code className="text-green-400/80">+   {issue.currentTerraformCode.replace(/public-read/g, 'private').replace(/storage_encrypted    = false/g, 'storage_encrypted    = true').replace(/ami-0c55b159cbfafe1f0/g, 'ami-0c55b159cbfafe1f1').split('\n').join('\n+   ')}</code>
                        </pre>
                    </div>

                     <div className="flex items-center justify-between p-4 border-t rounded-b-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                           <Check className="w-5 h-5 text-green-500"/>
                           <p className="text-sm font-medium text-green-400">All checks have passed</p>
                        </div>
                        {!isMerged ? (
                            <Button onClick={handleMerge} disabled={isMerging} className="bg-purple-600 hover:bg-purple-700">
                                {isMerging ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Merging...
                                    </>
                                ) : (
                                    <>
                                        <GitMerge className="mr-2 h-4 w-4" /> Approve & Merge
                                    </>
                                )}
                            </Button>
                        ) : (
                             <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                                <Check className="mr-2 h-4 w-4" /> Merged
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
