
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck, TrendingUp, Check } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { useRouter } from 'next/navigation';

const ScoreCard = ({ title, subtitle, icon: Icon, score, scoreColor, scoreText, children, animated = false }) => {
    const [displayScore, setDisplayScore] = useState(animated ? 42 : score);

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                let currentScore = 42;
                const interval = setInterval(() => {
                    currentScore++;
                    if (currentScore >= score) {
                        clearInterval(interval);
                        setDisplayScore(score);
                    } else {
                        setDisplayScore(currentScore);
                    }
                }, 20);
                return () => clearInterval(interval);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [animated, score]);

    return (
        <Card className={`w-full max-w-lg bg-card/50 backdrop-blur-sm flex flex-col animate-[fade-in-up_0.5s_ease-out] ${animated ? 'animate-delay-500' : ''}`}>
            <CardHeader className="flex flex-row items-center gap-4">
                <Icon className={`w-8 h-8 ${scoreColor}`} />
                <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                <Card className="text-center bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-muted-foreground font-medium">Security Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-6xl font-bold ${scoreColor}`}>
                            {displayScore}<span className="text-4xl text-muted-foreground">/100</span>
                            {animated && displayScore === score && <TrendingUp className="inline-block w-8 h-8 ml-2 animate-[fade-in_0.5s_ease-out]" />}
                        </div>
                        <p className="text-muted-foreground mt-2">{scoreText}</p>
                    </CardContent>
                </Card>
                {children}
            </CardContent>
        </Card>
    );
};

export default function ScorePage() {
    const router = useRouter();

    const issuesBySeverity = [
        { name: 'Critical', count: 2, color: 'text-red-500' },
        { name: 'High', count: 2, color: 'text-orange-400' },
        { name: 'Medium', count: 2, color: 'text-yellow-400' },
        { name: 'Low', count: 1, color: 'text-green-500' },
    ];

    const resolutionMethods = [
        { name: '5 via Terraform (IaC)', icon: Check },
        { name: '2 via AWS CLI (Direct)', icon: Check },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 space-y-8">
            <GridBackground />
            <div className="relative z-10 w-full flex flex-col md:flex-row items-stretch justify-center gap-8">
                <ScoreCard
                    title="Before"
                    subtitle="Initial scan"
                    icon={ShieldAlert}
                    score={42}
                    scoreColor="text-red-500"
                    scoreText="7 vulnerabilities found"
                >
                    <div className="animate-[fade-in_0.5s_0.2s_ease-out_forwards] opacity-0">
                        <h3 className="font-semibold mb-3">Issues by severity:</h3>
                        <ul className="space-y-2 text-sm">
                            {issuesBySeverity.map((issue) => (
                                <li key={issue.name} className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${issue.color.replace('text-', 'bg-')}`}></span>
                                    <span className="text-muted-foreground">{issue.count}</span>
                                    <span>{issue.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScoreCard>
                <ScoreCard
                    title="After"
                    subtitle="Complete remediation"
                    icon={ShieldCheck}
                    score={100}
                    scoreColor="text-green-500"
                    scoreText="All vulnerabilities resolved!"
                    animated
                >
                     <div className="animate-[fade-in_0.5s_2.5s_ease-out_forwards] opacity-0">
                        <h3 className="font-semibold mb-3">Resolution methods:</h3>
                        <ul className="space-y-2 text-sm">
                            {resolutionMethods.map((method) => (
                                <li key={method.name} className="flex items-center gap-2">
                                    <method.icon className="w-4 h-4 text-green-500" />
                                    <span>{method.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScoreCard>
            </div>
             <Button 
                onClick={() => router.push('/')} 
                className="relative z-10 animate-[fade-in-up_0.5s_3s_ease-out_forwards] opacity-0"
             >
                Back to Dashboard
            </Button>
        </div>
    );
}
