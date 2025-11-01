'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GridBackground } from '@/components/ui/grid-background';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function VerificationPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.issueId as string;
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus('Changes Applied Successfully!');
    }, 2500);

    const timer2 = setTimeout(() => {
      router.push(`/score?fixed=${issueId}`);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router, issueId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-md animate-[fade-in-up_0.5s_ease-out]">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                   Terraform Fixes Verification
                </CardTitle>
                 <CardDescription>Verifying Infrastructure-as-Code changes applied successfully.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
                {status === 'Verifying...' ? (
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                ) : (
                    <ShieldCheck className="w-16 h-16 text-green-500 animate-[fade-in_0.5s_ease-out]" />
                )}
                <p className="text-lg font-medium text-muted-foreground animate-[fade-in_0.5s_1s_ease-out_forwards] opacity-0">
                    {status}
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
