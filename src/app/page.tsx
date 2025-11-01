'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  ShieldCheck,
  Package,
  FileText,
  Settings,
  HelpCircle,
  Scan,
  Calendar,
  ShieldQuestion,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, Cell } from 'recharts';
import { useRouter, useSearchParams } from 'next/navigation';
import { securityIssues } from '@/lib/data';
import { cn } from '@/lib/utils';


const initialVulnerabilityData = [
  { name: 'Critical', value: 76, color: 'hsl(var(--destructive))' },
  { name: 'High', value: 245, color: 'hsl(38, 92%, 50%)' },
  { name: 'Medium', value: 581, color: 'hsl(48, 96%, 50%)' },
  { name: 'Low', value: 302, color: 'hsl(var(--primary))' },
];

const initialServiceData = [
  { name: 'EC2', value: 70 },
  { name: 'S3', value: 65 },
  { name: 'RDS', value: 90 },
  { name: 'IAM', value: 95 },
  { name: 'Lambda', value: 50 },
];

const initialTopVulnerabilities = [
  { id: 'issue-2', resourceId: 'i-0123456789abcdef0', service: 'EC2', region: 'us-east-1', count: 24, file: 'main.tf' },
  {
    id: 'issue-1',
    resourceId: 'my-critical-s3-bucket',
    service: 'S3',
    region: 'us-west-2',
    count: 18,
    file: 's3.tf',
  },
  {
    id: 'issue-3',
    resourceId: 'rds-db-instance-prod',
    service: 'RDS',
    region: 'eu-central-1',
    count: 12,
    file: 'db.tf',
  },
  {
    id: 'issue-4',
    resourceId: 'arn:aws:iam::123456789012:user/AdminUser',
    service: 'IAM',
    region: 'Global',
    count: 9,
    file: 'iam.tf'
  },
  {
    id: 'issue-5',
    resourceId: 'my-lambda-function-name',
    service: 'Lambda',
    region: 'us-east-1',
    count: 5,
    file: 'lambda.tf'
  },
];


const SidebarLogo = () => (
  <div className="flex items-center gap-2 p-2">
    <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center rounded-lg">
      <ShieldCheck className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold">Terraform Pilot</h2>
      <p className="text-xs text-sidebar-foreground/70">Cloud Security</p>
    </div>
  </div>
);

function Dashboard({ router }: { router: ReturnType<typeof useRouter> }) {
  const searchParams = useSearchParams();
  const fixedIssueId = searchParams.get('fixed');

  const [topVulnerabilities, setTopVulnerabilities] = useState(initialTopVulnerabilities);
  const [vulnerabilityData, setVulnerabilityData] = useState(initialVulnerabilityData);
  const [totalVulns, setTotalVulns] = useState(1204);
  const [criticalVulns, setCriticalVulns] = useState(76);
  const [highVulns, setHighVulns] = useState(245);
  const [vulnerableResources, setVulnerableResources] = useState(89);

  const [scanningId, setScanningId] = useState<string | null>(null);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    if (fixedIssueId) {
      const issueToFix = securityIssues.find(i => i.id === fixedIssueId);
      if (!issueToFix) return;

      setScanningId(fixedIssueId);
      
      // Simulate re-scan
      setTimeout(() => {
        setResolvedId(fixedIssueId);
        setScanningId(null);
        
        // Update metrics
        setTotalVulns(prev => prev - (issueToFix.severity === 'High' ? 12 : 24));
        setVulnerableResources(prev => prev -1);
        if (issueToFix.severity === 'High') {
            const isS3 = issueToFix.title.includes('S3');
            setHighVulns(prev => prev - (isS3 ? 18 : 12));
        }
        
        // Remove from list after a delay
        setTimeout(() => {
            setTopVulnerabilities(prev => prev.filter(v => v.id !== fixedIssueId));
        }, 1000);

      }, 2000);
    }
  }, [fixedIssueId]);

  const handleResourceClick = (issueId: string) => {
    router.push(`/map/${issueId}`);
  };

  const getRowState = (id: string) => {
    if (scanningId === id) return 'scanning';
    if (resolvedId === id) return 'resolved';
    return 'default';
  }
  
  const totalVulnsForBar = vulnerabilityData.reduce((acc, item) => acc + item.value, 0);

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <SidebarLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Vulnerabilities">
                <ShieldCheck />
                <span>Vulnerabilities</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Resources">
                <Package />
                <span>Resources</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Reports">
                <FileText />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarGroup className="mt-auto !p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Help & Support">
                <HelpCircle />
                <span>Help & Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-lg font-semibold md:text-xl">
                AWS Security Posture Overview
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, here&apos;s a summary of your cloud environment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last 24 Hours</span>
            </Button>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => router.push('/scan')}>
              <Scan className="w-4 h-4" />
              <span>Scan Now</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{totalVulns.toLocaleString()}</div>
                  <p className="text-xs text-green-500">-1.0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vulnerable Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{vulnerableResources}</div>
                  <p className="text-xs text-green-500">-1.1%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Critical Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-500">{criticalVulns}</div>
                  <p className="text-xs text-green-500">-0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>High Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-500">{highVulns.toLocaleString()}</div>
                  <p className="text-xs text-green-500">-10.2%</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vulnerabilities by Severity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vulnerabilityData.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <span className="w-16 text-sm text-muted-foreground">
                          {item.name}
                        </span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${(item.value / totalVulnsForBar) * 100}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-12 text-sm font-medium text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vulnerabilities by AWS Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-48 w-full">
                    <BarChart
                      data={initialServiceData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="value" radius={5}>
                        {initialServiceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill="hsl(var(--foreground))"
                            opacity={entry.value / 100}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Top Vulnerable Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource ID</TableHead>
                      <TableHead>AWS Service</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topVulnerabilities.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className={cn("cursor-pointer hover:bg-muted/50 transition-all", getRowState(item.id) === 'resolved' && 'opacity-30')}
                        onClick={() => getRowState(item.id) === 'default' && handleResourceClick(item.id)}
                      >
                        <TableCell>
                          <span
                            className="font-mono p-0 h-auto text-primary underline-offset-4 hover:underline"
                          >
                            {item.resourceId}
                          </span>
                        </TableCell>
                        <TableCell>{item.service}</TableCell>
                        <TableCell>{item.region}</TableCell>
                        <TableCell className="text-right">
                          {getRowState(item.id) === 'default' && (
                            <Badge
                              variant="destructive"
                              className="bg-red-500/20 text-red-400"
                            >
                              {item.count} issues
                            </Badge>
                          )}
                          {getRowState(item.id) === 'scanning' && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-500/20 text-blue-400"
                            >
                              <Scan className="w-3 h-3 mr-1 animate-pulse" />
                              Re-scanning...
                            </Badge>
                          )}
                          {getRowState(item.id) === 'resolved' && (
                            <Badge
                              variant="secondary"
                              className="bg-green-600/20 text-green-400 border-green-600/30"
                            >
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center pt-4 text-sm text-muted-foreground">
                  <div>Showing 1 to {topVulnerabilities.length} of {vulnerableResources} results</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


function DashboardWrapper() {
    const router = useRouter();
    return <Dashboard router={router} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardWrapper />
    </Suspense>
  );
}
