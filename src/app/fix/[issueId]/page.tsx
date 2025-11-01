'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { securityIssues } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wand2, FileText, CheckCircle, GitPullRequest } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const CodeBlock = ({ code, animated = false }: { code: string, animated?: boolean }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  
  useEffect(() => {
    if (animated) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedCode(code.substring(0, i));
        i++;
        if (i > code.length) {
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    } else {
      setDisplayedCode(code);
    }
  }, [code, animated]);

  return (
    <pre className="bg-muted/50 p-4 rounded-md text-sm font-code overflow-x-auto">
      <code>{displayedCode}</code>
      <span className="animate-pulse">|</span>
    </pre>
  );
};


export default function FixPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;
  const [issue, setIssue] = useState<any>(null);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isPrCreated, setIsPrCreated] = useState(false);

  useEffect(() => {
    const foundIssue = securityIssues.find((i) => i.id === issueId);
    if (foundIssue) {
      setIssue(foundIssue);
    }
  }, [issueId]);

  const handleGenerateFix = async () => {
    if (!issue) return;
    setIsFixing(true);

    // Simulate AI generating fix
    await new Promise(resolve => setTimeout(resolve, 1500));
    const { fixedTerraformCode } = {
        fixedTerraformCode: issue.currentTerraformCode.replace(/public-read/g, 'private').replace(/storage_encrypted    = false/g, 'storage_encrypted    = true').replace(/ami-0c55b159cbfafe1f0/g, 'ami-0c55b159cbfafe1f1' /* fake updated ami */)
    };
    setFixedCode(fixedTerraformCode);

    // Simulate AI generating explanation
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { explanation: generatedExplanation } = {
        explanation: `The public read access on the S3 bucket has been changed to private to prevent unintended data exposure. The RDS instance has been configured with storage_encrypted = true to ensure data is encrypted at rest. The EC2 instance AMI has been updated to the latest version to patch known vulnerabilities.`
    };
    setExplanation(generatedExplanation);

    setIsFixing(false);
  };
  
  const handleCreatePR = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPrCreated(true);
  }

  if (!issue) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Issue not found</h2>
          <p className="text-muted-foreground mb-4">
            The security issue you are looking for does not exist.
          </p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 md:p-10">
        <header className="mb-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-1">
                <issue.Icon className="w-8 h-8 text-destructive" />
                <h1 className="text-3xl font-bold">{issue.title}</h1>
              </div>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>
            <Badge variant={issue.severity === 'High' ? 'destructive' : 'secondary'}>
              {issue.severity} Severity
            </Badge>
          </div>
        </header>

        <Separator className="my-8" />

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="animate-[fade-in-up_0.5s_ease-out]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Vulnerable Code
              </CardTitle>
              <CardDescription>
                This is the current Terraform configuration that has a security misconfiguration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={issue.currentTerraformCode} />
            </CardContent>
          </Card>

          <div className="space-y-8">
             <Card className="animate-[fade-in-up_0.7s_ease-out]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="text-purple-400" />
                    AI-Powered Fix
                  </CardTitle>
                  <CardDescription>
                    Generate a secure Terraform configuration using AI.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!fixedCode && (
                    <Button onClick={handleGenerateFix} disabled={isFixing} className="w-full bg-purple-600 hover:bg-purple-700">
                      {isFixing ? 'Generating Fix...' : 'Generate Fix'}
                    </Button>
                  )}
                  {fixedCode && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Suggested Fix:</h3>
                      <CodeBlock code={fixedCode} animated={true} />
                      <h3 className="font-semibold text-lg pt-4">Explanation:</h3>
                      <p className="text-sm text-muted-foreground animate-[fade-in_1s_ease-out_2s_forwards] opacity-0">
                        {explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
            </Card>

            {fixedCode && !isPrCreated && (
                 <Card className="animate-[fade-in-up_0.9s_ease-out]">
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <GitPullRequest />
                            Create Pull Request
                         </CardTitle>
                         <CardDescription>
                            Commit the fix and create a pull request on GitHub.
                         </CardDescription>
                     </CardHeader>
                     <CardContent>
                         <Button onClick={handleCreatePR} className="w-full bg-green-600 hover:bg-green-700">
                             Create PR
                         </Button>
                     </CardContent>
                 </Card>
            )}

            {isPrCreated && (
                <Card className="bg-green-900/50 border-green-500/50 animate-[fade-in_0.5s_ease-out]">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-green-300">
                            <CheckCircle />
                            Pull Request Created!
                         </CardTitle>
                         <CardDescription className="text-green-400/80">
                           The fix has been committed and a pull request is ready for review.
                         </CardDescription>
                     </CardHeader>
                </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
