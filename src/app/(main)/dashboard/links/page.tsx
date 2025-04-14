"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { PLANS } from "@/utils";

interface Url {
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: Click[];
  createdAt: string;
}

interface Click {
  timestamp: string;
  device: string;
  location: string;
  ip: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [monclicks, setMonclicks] = useState();
  const [userData, setUserData] = useState();

  const fetchUserData = async () => {
    setIsLoading(true); // optional
    try {
      const res = await fetch("/api/user");
  
      if (!res.ok) {
        throw new Error(`Failed to fetch user data: ${res.status}`);
      }
  
      const { data } = await res.json();
      setUserData(data);
      console.log("Fetched user data:", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false); // optional
    }
  };
  
  
  const getLimits = (plan: string) => {
    const found = PLANS.find(p => p.name.toLowerCase() === plan.toLowerCase());
    return found?.limits || { clicksPerMonth: 10000, linksPerMonth: 10 };
  };
  
  const limits = getLimits(userData?.subscriptionPlan || "free");
  
  const [state, setState] = useState({
    urls: [] as Url[],
    totalUrls: 0,
    selectedUrl: null as Url | null,
    showCreateDialog: false,
    newUrl: '',
    subscription: {
      plan: userData?.subscriptionPlan || "free",
      clicksPerMonth: limits.clicksPerMonth,
      linksPerMonth: limits.linksPerMonth,
      usage: monclicks,
      renewal:
      userData?.subscriptionPlan === "free"
          ? userData?.createdAt
            ? new Date(userData.createdAt).getTime()
            : Date.now()
          : userData?.subscribedAt,
    },
  });

   
  
  

  const fetchData = async () => {
    try {
      setIsLoading(true); // Start loading
      const [urlsRes, countRes] = await Promise.all([
        fetch('/api/user/user-urls'),
        fetch('/api/urls/count')
      ]);
  
      const urlsData = await urlsRes.json();
      const countData = await countRes.json();
      const totalClicks = urlsData.data.reduce((sum, url) => sum + url.clicks.length, 0);
  
      setState(prev => ({
        ...prev,
        urls: urlsData.data,
        totalUrls: countData.total
      }));
      setMonclicks(totalClicks);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const createShortUrl = async () => {
    try {
      const res = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: state.newUrl })
      });

      if (!res.ok) throw new Error('Failed to create URL');
      
      setState(prev => ({
        ...prev,
        newUrl: '',
        showCreateDialog: false
      }));
      fetchData();
      toast.success('URL created successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchData();
    if (user) fetchUserData()
  }, [user]);

  

  return (
    <div className="flex min-h-screen bg-muted/40">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{state.totalUrls}</div>
                  <Progress value={state.totalUrls} max={5} />

                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monclicks}</div>
                  <Progress value={monclicks} max={limits.clicksPerMonth} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{state.subscription.plan}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {state?.usage ||0}/{limits.clicksPerMonth} clicks
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Renewal Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(state.subscription.renewal).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Create New Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold">My Short Links</h2>
          <Dialog open={state.showCreateDialog} 
            onOpenChange={(open) => setState(prev => ({ ...prev, showCreateDialog: open }))}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">Create New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Short Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter URL"
                  value={state.newUrl}
                  onChange={(e) => setState(prev => ({ ...prev, newUrl: e.target.value }))}
                />
                <Button className="w-full" onClick={createShortUrl}>
                  Generate Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Responsive Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Short URL</TableHead>
                  <TableHead className="min-w-[150px]">Original URL</TableHead>
                  <TableHead className="w-[100px]">Clicks</TableHead>
                  <TableHead className="w-[120px]">Created</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {isLoading ? (
                <TableBody>
                  {Array(3).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  {state.urls.map((url) => (
                    <TableRow key={url._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="truncate">{window.location.host}/{url.shortId}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.host}/${url.shortId}`);
                              toast.success("Short URL copied!");
                            }}
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {url.originalUrl}
                      </TableCell>
                      <TableCell>{url.clicks.length}</TableCell>
                      <TableCell>
                        {new Date(url.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setState(prev => ({ ...prev, selectedUrl: url }))}
                          >
                            Analytics
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setState(prev => ({ ...prev, selectedUrl: url, showQR: true }))}
                          >
                            QR Code
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </Card>

        {/* Responsive Analytics Modal */}
        <Dialog open={!!state.selectedUrl} 
          onOpenChange={(open) => !open && setState(prev => ({ ...prev, selectedUrl: null }))}>
          <DialogContent className="max-w-4xl w-[95vw]">
            {state.selectedUrl && (
              <>
                <DialogHeader>
                  <DialogTitle>Analytics for {state.selectedUrl.shortId}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LineChart
                    title="Clicks Over Time"
                    data={state.selectedUrl.clicks.reduce((acc, click) => {
                      const date = new Date(click.timestamp).toLocaleDateString();
                      acc[date] = (acc[date] || 0) + 1;
                      return acc;
                    }, {})}
                  />
                  <PieChart
                    title="Device Distribution"
                    data={[
                      { name: 'Mobile', value: state.selectedUrl.clicks.filter(c => c.device === 'mobile').length },
                      { name: 'Desktop', value: state.selectedUrl.clicks.filter(c => c.device === 'desktop').length }
                    ]}
                  />
                  <div className="md:col-span-2">
                    <BarChart
                      title="Top Locations"
                      data={state.selectedUrl.clicks.reduce((acc, click) => {
                        acc[click.location] = (acc[click.location] || 0) + 1;
                        return acc;
                      }, {})}
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Subscription Card */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">Pro Subscription</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  {state.subscription.usage}/{state.subscription.limit} clicks used
                </CardDescription>
                <div className="mt-3 h-2 bg-primary-foreground/20 rounded-full">
                  <div 
                    className="h-full bg-primary-foreground rounded-full"
                    style={{ width: `${(state.subscription.usage / state.subscription.limit) * 100}%` }}
                  />
                </div>
              </div>
              <Button variant="secondary" className="w-full sm:w-auto mt-2 sm:mt-0">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}