'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { securityIssues } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wand2, FileText, GitPullRequest, Terminal } from 'lucide-react';
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
  const [issues, setIssues] = useState<any[]>([]);
  const [fixedCodes, setFixedCodes] = useState<{[key: string]: string}>({});
  const [explanations, setExplanations] = useState<{[key: string]: string}>({});
  const [isFixingAll, setIsFixingAll] = useState(false);
  const [currentlyFixing, setCurrentlyFixing] = useState<string | null>(null);
  const [isCreatingPr, setIsCreatingPr] = useState(false);

  useEffect(() => {
    // Show multiple issues for demo - get the first 3 issues
    const demoIssues = securityIssues.slice(0, 3);
    setIssues(demoIssues);
  }, [issueId]);

  const handleFixAllIssues = async () => {
    setIsFixingAll(true);
    
    const explanationMap: {[key: string]: string} = {
      'issue-1': 'Changed S3 bucket ACL from public-read to private to prevent unintended data exposure.',
      'issue-2': 'Updated EC2 instance AMI to the latest version to patch known vulnerabilities.',
      'issue-3': 'Enabled storage encryption on RDS instance to ensure data is encrypted at rest.',
      'issue-4': 'Restricted SSH access from 0.0.0.0/0 to internal network (10.0.0.0/8) to prevent unauthorized access.',
      'issue-5': 'Enabled S3 bucket versioning to protect against accidental deletion and provide data recovery options.'
    };

    // Fix each issue sequentially
    for (const issue of issues) {
      setCurrentlyFixing(issue.id);
      
      // Simulate AI generating fix
      await new Promise(resolve => setTimeout(resolve, 1500));
      const { fixedTerraformCode } = {
          fixedTerraformCode: issue.currentTerraformCode.replace(/public-read/g, 'private').replace(/storage_encrypted    = false/g, 'storage_encrypted    = true').replace(/ami-0c55b159cbfafe1f0/g, 'ami-0c55b159cbfafe1f1' /* fake updated ami */).replace(/cidr_blocks = \["0.0.0.0\/0"\]  # VULNERABLE: Open to internet/g, 'cidr_blocks = ["10.0.0.0/8"]  # FIXED: Restricted to internal network').replace(/status = "Disabled"  # VULNERABLE: Should be Enabled/g, 'status = "Enabled"  # FIXED: Versioning enabled')
      };
      setFixedCodes(prev => ({...prev, [issue.id]: fixedTerraformCode}));
      setExplanations(prev => ({...prev, [issue.id]: explanationMap[issue.id] || 'Security fix applied.'}));
      
      // Small delay before next issue
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentlyFixing(null);
    setIsFixingAll(false);
  };
  
  const handleCreatePR = async () => {
    setIsCreatingPr(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push(`/pr/${issueId}`);
  }

  if (issues.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading issues...</h2>
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
              <h1 className="text-3xl font-bold mb-2">Security Issues - Demo Fix</h1>
              <p className="text-muted-foreground">Multiple security issues detected. Use CLI AI to fix them automatically.</p>
            </div>
            {Object.keys(fixedCodes).length === 0 && (
              <Button 
                onClick={handleFixAllIssues} 
                disabled={isFixingAll}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Terminal className="mr-2 h-5 w-5" />
                {isFixingAll ? 'Running CLI AI Fix...' : 'CLI AI Fix All Issues'}
              </Button>
            )}
            {Object.keys(fixedCodes).length > 0 && Object.keys(fixedCodes).length === issues.length && (
              <Button 
                onClick={handleCreatePR} 
                disabled={isCreatingPr}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <GitPullRequest className="mr-2 h-5 w-5" />
                {isCreatingPr ? 'Creating PR...' : 'Create Pull Request'}
              </Button>
            )}
          </div>
        </header>

        <Separator className="my-8" />

        <div className="space-y-12">
          {issues.map((issue, index) => (
            <div key={issue.id} className="animate-[fade-in-up_0.5s_ease-out]" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <issue.Icon className="w-8 h-8 text-destructive" />
                  <div>
                    <h2 className="text-2xl font-bold">{issue.title}</h2>
                    <p className="text-muted-foreground text-sm">{issue.description}</p>
                  </div>
                </div>
                <Badge variant={issue.severity === 'High' ? 'destructive' : 'secondary'}>
                  {issue.severity} Severity
                </Badge>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText />
                      Vulnerable Code
                    </CardTitle>
                    <CardDescription>
                      Current Terraform configuration with security misconfiguration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={issue.currentTerraformCode} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="text-green-400" />
                      CLI AI Fix
                    </CardTitle>
                    <CardDescription>
                      {!fixedCodes[issue.id] && !currentlyFixing && 'Waiting for CLI AI Fix to run...'}
                      {currentlyFixing === issue.id && 'Generating secure Terraform configuration...'}
                      {fixedCodes[issue.id] && 'Fix applied successfully'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentlyFixing === issue.id && (
                      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                            <Terminal className="w-4 h-4" />
                            <span>$ terraform-pilot fix --issue {issue.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Running CLI AI Fix...</p>
                        </div>
                      </div>
                    )}
                    {!fixedCodes[issue.id] && !currentlyFixing && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Click "CLI AI Fix All Issues" button above to fix this issue</p>
                        </div>
                      </div>
                    )}
                    {fixedCodes[issue.id] && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <Terminal className="w-4 h-4" />
                          <span className="font-mono">$ terraform-pilot fix --issue {issue.id}</span>
                        </div>
                        <h3 className="font-semibold text-lg">Suggested Fix:</h3>
                        <CodeBlock code={fixedCodes[issue.id]} animated={true} />
                        <h3 className="font-semibold text-lg pt-4">Explanation:</h3>
                        <p className="text-sm text-muted-foreground animate-[fade-in_1s_ease-out_2s_forwards] opacity-0">
                          {explanations[issue.id]}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {index < issues.length - 1 && <Separator className="mt-12" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
