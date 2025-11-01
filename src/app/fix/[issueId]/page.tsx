'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { securityIssues } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wand2, FileText, GitPullRequest, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
  const [fixMethods, setFixMethods] = useState<{[key: string]: 'ai' | 'cli'}>({});
  const [isFixingCLI, setIsFixingCLI] = useState(false);
  const [isFixingAI, setIsFixingAI] = useState(false);
  const [currentlyFixing, setCurrentlyFixing] = useState<string | null>(null);
  const [isCreatingPr, setIsCreatingPr] = useState(false);

  useEffect(() => {
    // Show all 5 issues for demo
    const demoIssues = securityIssues.slice(0, 5);
    setIssues(demoIssues);
  }, [issueId]);

  // Separate issues into unmanaged (AI Fix) and managed (CLI Fix)
  const unmanagedIssues = issues.filter(i => i.id === 'issue-4' || i.id === 'issue-5');
  const managedIssues = issues.filter(i => i.id === 'issue-1' || i.id === 'issue-2' || i.id === 'issue-3');

  const handleCLIFix = async () => {
    setIsFixingCLI(true);
    
    const explanationMap: {[key: string]: string} = {
      'issue-1': 'Changed S3 bucket ACL from public-read to private to prevent unintended data exposure.',
      'issue-2': 'Updated EC2 instance AMI to the latest version to patch known vulnerabilities.',
      'issue-3': 'Enabled storage encryption on RDS instance to ensure data is encrypted at rest.',
    };

    // Fix managed Terraform resources (issue-1, 2, 3)
    const managedIssues = issues.filter(i => i.id === 'issue-1' || i.id === 'issue-2' || i.id === 'issue-3');
    
    for (const issue of managedIssues) {
      setCurrentlyFixing(issue.id);
      setFixMethods(prev => ({...prev, [issue.id]: 'cli'}));
      
      // Simulate CLI fix
      await new Promise(resolve => setTimeout(resolve, 1500));
      const { fixedTerraformCode } = {
          fixedTerraformCode: issue.currentTerraformCode.replace(/public-read/g, 'private').replace(/storage_encrypted    = false/g, 'storage_encrypted    = true').replace(/ami-0c55b159cbfafe1f0/g, 'ami-0c55b159cbfafe1f1' /* fake updated ami */)
      };
      setFixedCodes(prev => ({...prev, [issue.id]: fixedTerraformCode}));
      setExplanations(prev => ({...prev, [issue.id]: explanationMap[issue.id] || 'Security fix applied.'}));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentlyFixing(null);
    setIsFixingCLI(false);
  };

  const handleAIFix = async () => {
    setIsFixingAI(true);
    
    const explanationMap: {[key: string]: string} = {
      'issue-4': 'Restricted SSH access from 0.0.0.0/0 to internal network (10.0.0.0/8) to prevent unauthorized access. Since this is unmanaged, the fix includes importing the resource into Terraform.',
      'issue-5': 'Enabled S3 bucket versioning to protect against accidental deletion and provide data recovery options. Since this is unmanaged, the fix includes importing the resource into Terraform.'
    };

    // Fix unmanaged resources (issue-4, 5)
    const unmanagedIssues = issues.filter(i => i.id === 'issue-4' || i.id === 'issue-5');
    
    for (const issue of unmanagedIssues) {
      setCurrentlyFixing(issue.id);
      setFixMethods(prev => ({...prev, [issue.id]: 'ai'}));
      
      // Simulate AI fix and import
      await new Promise(resolve => setTimeout(resolve, 1500));
      const { fixedTerraformCode } = {
          fixedTerraformCode: issue.currentTerraformCode.replace(/cidr_blocks = \["0.0.0.0\/0"\]  # VULNERABLE: Open to internet/g, 'cidr_blocks = ["10.0.0.0/8"]  # FIXED: Restricted to internal network').replace(/status = "Disabled"  # VULNERABLE: Should be Enabled/g, 'status = "Enabled"  # FIXED: Versioning enabled')
      };
      setFixedCodes(prev => ({...prev, [issue.id]: fixedTerraformCode}));
      setExplanations(prev => ({...prev, [issue.id]: explanationMap[issue.id] || 'Security fix applied.'}));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentlyFixing(null);
    setIsFixingAI(false);
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Issues - Demo Fix</h1>
            <p className="text-muted-foreground">First import unmanaged resources with AI Fix, then fix Terraform files with CLI Fix.</p>
          </div>
        </header>

        {/* Section 1: Unmanaged Resources - AI Fix */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-purple-400" />
                Unmanaged Resources - AI Fix
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Resources not in Terraform - AI will import and fix them
              </p>
            </div>
            {!fixedCodes['issue-4'] && !fixedCodes['issue-5'] && (
              <Button 
                onClick={handleAIFix} 
                disabled={isFixingAI || isFixingCLI}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                {isFixingAI ? 'Running AI Fix...' : 'AI Fix'}
              </Button>
            )}
          </div>

          <div className="space-y-8">
            {unmanagedIssues.map((issue, index) => (
            <div key={issue.id} className="animate-[fade-in-up_0.5s_ease-out]" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <issue.Icon className="w-8 h-8 text-destructive" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{issue.title}</h2>
                      {(issue.id === 'issue-4' || issue.id === 'issue-5') && (
                        <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                          Unmanaged
                        </Badge>
                      )}
                    </div>
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
                      Misconfigured Resources
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
                      {(issue.id === 'issue-4' || issue.id === 'issue-5') ? (
                        <>
                          <Wand2 className="text-purple-400" />
                          AI Fix
                        </>
                      ) : (
                        <>
                          <Terminal className="text-green-400" />
                          CLI AI Fix
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {!fixedCodes[issue.id] && !currentlyFixing && (
                        (issue.id === 'issue-4' || issue.id === 'issue-5') 
                          ? 'Unmanaged resource - will use AI to import and fix...'
                          : 'Waiting for CLI AI Fix to run...'
                      )}
                      {currentlyFixing === issue.id && (
                        (issue.id === 'issue-4' || issue.id === 'issue-5')
                          ? 'AI is importing and generating secure configuration...'
                          : 'Generating secure Terraform configuration...'
                      )}
                      {fixedCodes[issue.id] && 'Fix applied successfully'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentlyFixing === issue.id && (
                      <div className={cn(
                        "flex items-center gap-3 p-4 border rounded-lg",
                        (issue.id === 'issue-4' || issue.id === 'issue-5')
                          ? "bg-purple-500/10 border-purple-500/20"
                          : "bg-green-500/10 border-green-500/20"
                      )}>
                        <div className={cn(
                          "w-5 h-5 border-2 border-t-transparent rounded-full animate-spin",
                          (issue.id === 'issue-4' || issue.id === 'issue-5')
                            ? "border-purple-400"
                            : "border-green-400"
                        )}></div>
                        <div className="flex-1">
                          <div className={cn(
                            "flex items-center gap-2 text-sm font-mono",
                            (issue.id === 'issue-4' || issue.id === 'issue-5')
                              ? "text-purple-400"
                              : "text-green-400"
                          )}>
                            {(issue.id === 'issue-4' || issue.id === 'issue-5') ? (
                              <>
                                <Wand2 className="w-4 h-4" />
                                <span>AI analyzing and importing resource...</span>
                              </>
                            ) : (
                              <>
                                <Terminal className="w-4 h-4" />
                                <span>$ terraform-pilot fix --issue {issue.id}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(issue.id === 'issue-4' || issue.id === 'issue-5')
                              ? 'Running AI Fix...'
                              : 'Running CLI AI Fix...'}
                          </p>
                        </div>
                      </div>
                    )}
                    {!fixedCodes[issue.id] && !currentlyFixing && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {(issue.id === 'issue-4' || issue.id === 'issue-5')
                              ? 'Click "AI Fix" button above - AI will import and fix this unmanaged resource'
                              : (!fixedCodes['issue-4'] && !fixedCodes['issue-5'])
                                ? 'Waiting for AI Fix to complete first (import unmanaged resources)'
                                : 'Click "CLI AI Fix" button above to fix this managed resource'}
                          </p>
                        </div>
                      </div>
                    )}
                    {fixedCodes[issue.id] && (
                      <div className="space-y-4">
                        <div className={cn(
                          "flex items-center gap-2 text-sm",
                          (issue.id === 'issue-4' || issue.id === 'issue-5')
                            ? "text-purple-400"
                            : "text-green-400"
                        )}>
                          {(issue.id === 'issue-4' || issue.id === 'issue-5') ? (
                            <>
                              <Wand2 className="w-4 h-4" />
                              <span className="font-mono">AI Fix Applied - Resource Imported</span>
                            </>
                          ) : (
                            <>
                              <Terminal className="w-4 h-4" />
                              <span className="font-mono">$ terraform-pilot fix --issue {issue.id}</span>
                            </>
                          )}
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
              
              {index < unmanagedIssues.length - 1 && <Separator className="mt-8" />}
            </div>
          ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Section 2: Managed Resources - CLI Fix Terraform */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Terminal className="w-6 h-6 text-green-400" />
                Managed Resources - CLI Fix Terraform
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Resources already in Terraform - fix misconfigurations
              </p>
            </div>
            {(fixedCodes['issue-4'] || fixedCodes['issue-5']) && Object.keys(fixedCodes).length < issues.length && (
              <Button 
                onClick={handleCLIFix} 
                disabled={isFixingCLI || isFixingAI}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Terminal className="mr-2 h-5 w-5" />
                {isFixingCLI ? 'Running CLI AI Fix...' : 'CLI AI Fix'}
              </Button>
            )}
          </div>

          <div className="space-y-8">
            {managedIssues.map((issue, index) => (
            <div key={issue.id} className="animate-[fade-in-up_0.5s_ease-out]" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <issue.Icon className="w-8 h-8 text-destructive" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold">{issue.title}</h2>
                      {(issue.id === 'issue-4' || issue.id === 'issue-5') && (
                        <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                          Unmanaged
                        </Badge>
                      )}
                    </div>
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
                      Misconfigured Resources
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
                      {(issue.id === 'issue-4' || issue.id === 'issue-5') ? (
                        <>
                          <Wand2 className="text-purple-400" />
                          AI Fix
                        </>
                      ) : (
                        <>
                          <Terminal className="text-green-400" />
                          CLI AI Fix
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {!fixedCodes[issue.id] && !currentlyFixing && (
                        (issue.id === 'issue-4' || issue.id === 'issue-5') 
                          ? 'Unmanaged resource - will use AI to import and fix...'
                          : 'Waiting for CLI AI Fix to run...'
                      )}
                      {currentlyFixing === issue.id && (
                        (issue.id === 'issue-4' || issue.id === 'issue-5')
                          ? 'AI is importing and generating secure configuration...'
                          : 'Generating secure Terraform configuration...'
                      )}
                      {fixedCodes[issue.id] && 'Fix applied successfully'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentlyFixing === issue.id && (
                      <div className={cn(
                        "flex items-center gap-3 p-4 border rounded-lg",
                        (issue.id === 'issue-4' || issue.id === 'issue-5')
                          ? "bg-purple-500/10 border-purple-500/20"
                          : "bg-green-500/10 border-green-500/20"
                      )}>
                        <div className={cn(
                          "w-5 h-5 border-2 border-t-transparent rounded-full animate-spin",
                          (issue.id === 'issue-4' || issue.id === 'issue-5')
                            ? "border-purple-400"
                            : "border-green-400"
                        )}></div>
                        <div className="flex-1">
                          <div className={cn(
                            "flex items-center gap-2 text-sm font-mono",
                            (issue.id === 'issue-4' || issue.id === 'issue-5')
                              ? "text-purple-400"
                              : "text-green-400"
                          )}>
                            {(issue.id === 'issue-4' || issue.id === 'issue-5') ? (
                              <>
                                <Wand2 className="w-4 h-4" />
                                <span>AI analyzing and importing resource...</span>
                              </>
                            ) : (
                              <>
                                <Terminal className="w-4 h-4" />
                                <span>$ terraform-pilot fix --issue {issue.id}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(issue.id === 'issue-4' || issue.id === 'issue-5')
                              ? 'Running AI Fix...'
                              : 'Running CLI AI Fix...'}
                          </p>
                        </div>
                      </div>
                    )}
                    {!fixedCodes[issue.id] && !currentlyFixing && (
                      <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {(issue.id === 'issue-4' || issue.id === 'issue-5')
                              ? 'Click "AI Fix" button above - AI will import and fix this unmanaged resource'
                              : (!fixedCodes['issue-4'] && !fixedCodes['issue-5'])
                                ? 'Waiting for AI Fix to complete first (import unmanaged resources)'
                                : 'Click "CLI AI Fix" button above to fix this managed resource'}
                          </p>
                        </div>
                      </div>
                    )}
                    {fixedCodes[issue.id] && (
                      <div className="space-y-4">
                        <div className={cn(
                          "flex items-center gap-2 text-sm",
                          (issue.id === 'issue-4' || issue.id === 'issue-5')
                            ? "text-purple-400"
                            : "text-green-400"
                        )}>
                          {(issue.id === 'issue-4' || issue.id === 'issue-5') ? (
                            <>
                              <Wand2 className="w-4 h-4" />
                              <span className="font-mono">AI Fix Applied - Resource Imported</span>
                            </>
                          ) : (
                            <>
                              <Terminal className="w-4 h-4" />
                              <span className="font-mono">$ terraform-pilot fix --issue {issue.id}</span>
                            </>
                          )}
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
              
              {index < managedIssues.length - 1 && <Separator className="mt-8" />}
            </div>
          ))}
          </div>
        </div>

        {/* Create PR Button - Shows when all fixes are done */}
        {Object.keys(fixedCodes).length === issues.length && (
          <div className="flex justify-center mt-12">
            <Button 
              onClick={handleCreatePR} 
              disabled={isCreatingPr}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <GitPullRequest className="mr-2 h-5 w-5" />
              {isCreatingPr ? 'Creating PR...' : 'Create Pull Request'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
