'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { securityIssues, MappedResource, awsResources } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileText, Loader } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';

export default function MappingPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;
  const [issue, setIssue] = useState<any>(null);
  const [resource, setResource] = useState<any>(null);
  const [mappedFile, setMappedFile] = useState<string | null>(null);

  useEffect(() => {
    const foundIssue = securityIssues.find((i) => i.id === issueId);
    if (foundIssue) {
      setIssue(foundIssue);
      const foundResource = awsResources.find(r => r.name === foundIssue.resourceName);
      setResource(foundResource);
      const vulnerableFile = topVulnerabilities.find(v => v.id === issueId)?.file;
      
      setTimeout(() => {
        setMappedFile(vulnerableFile || 'main.tf');
      }, 1000);
      
      setTimeout(() => {
        router.push(`/fix/${issueId}`);
      }, 3000);
    }
  }, [issueId, router]);
  
  const topVulnerabilities = [
    { id: 'issue-2', file: 'main.tf' },
    { id: 'issue-1', file: 's3.tf' },
    { id: 'issue-3', file: 'db.tf' },
    { id: 'issue-4', file: 'iam.tf' },
    { id: 'issue-5', file: 'lambda.tf' },
  ];

  if (!issue || !resource) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <GridBackground />
      <div className="relative z-10 flex items-center justify-center gap-8 md:gap-16">
        {/* Resource Card */}
        <Card className="w-72 animate-[fade-in-right_0.5s_ease-out]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <resource.Icon className="w-6 h-6 text-accent" />
              Vulnerable Resource
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{issue.resourceName}</p>
            <p className="text-xs text-muted-foreground">{resource.type}</p>
          </CardContent>
        </Card>

        {/* Mapping Animation */}
        <div className="flex flex-col items-center justify-center animate-[fade-in_0.5s_0.5s_ease-out_forwards] opacity-0">
           <p className="text-sm text-muted-foreground mb-2">Mapping to file...</p>
           <div className="w-24 h-px bg-border relative">
                <ArrowRight className="w-5 h-5 text-primary absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 animate-[pulse_2s_infinite]" />
           </div>
        </div>

        {/* File Card */}
        <div className="w-72">
        {mappedFile ? (
            <Card className="animate-[fade-in-left_0.5s_1s_ease-out_forwards] opacity-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-6 h-6 text-accent" />
                Terraform File
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-mono text-sm">{mappedFile}</p>
                <p className="text-xs text-muted-foreground">Infrastructure-as-Code</p>
            </CardContent>
            </Card>
        ) : (
            <Card className="w-72 bg-muted/50 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-muted-foreground">
                        <Loader className="w-6 h-6 animate-spin" />
                        Scanning...
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[2.25rem]"/>
                </CardContent>
            </Card>
        )}
        </div>
      </div>
    </div>
  );
}
