"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { toast } from 'sonner';
import QRCode from 'qrcode.react';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardNavbar from './navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [monclicks, setMonclicks] = useState();
  const [state, setState] = useState({
    urls: [] as Url[],
    totalUrls: 0,
    selectedUrl: null as Url | null,
    showCreateDialog: false,
    newUrl: '',
    subscription: {
      plan: 'Pro',
      limit: 5000,
      usage: monclicks ,
      renewal: '2024-03-15'
    }
  });

  

  const fetchData = async () => {
    try {
      const [urlsRes, countRes] = await Promise.all([
        fetch('/api/user/user-urls'),
        fetch('/api/urls/count')
      ]);
      
      const urlsData = await urlsRes.json();
      const countData = await countRes.json();

      const totalClicks = urlsData.data.reduce((sum, url) => sum + url.clicks.length, 0);

      console.log(totalClicks)

      setState(prev => ({
        ...prev,
        urls: urlsData.data,
        totalUrls: countData.total
      }));
      setMonclicks(totalClicks);
    } catch (error) {
      toast.error('Failed to load data');
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
  }, [user]);

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b">
        
        <DashboardNavbar 
        user={{
          imageUrl: user?.imageUrl || user?.firstName?.charAt(0), // Example image URL
          firstName: user?.fullName ||"User", // User's first name
        }} 
      />
      </header>


      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{state.totalUrls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clicks This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{monclicks }</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{state.subscription.plan}</div>
              <div className="text-sm text-muted-foreground">
                {state.subscription.usage}/{state.subscription.limit} clicks
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Renewal Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Date(state.subscription.renewal).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Short Links</h2>
          <Dialog open={state.showCreateDialog} 
            onOpenChange={(open) => setState(prev => ({ ...prev, showCreateDialog: open }))}>
            <DialogTrigger asChild>
              <Button>Create New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Short Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter URL"
                  value={state.newUrl}
                  onChange={(e) => setState(prev => ({ ...prev, newUrl: e.target.value }))}
                />
                <Button onClick={createShortUrl}>Generate Link</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* URL Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.urls.map((url) => (
                <TableRow key={url._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{window.location.host}/{url.shortId}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.host}/${url.shortId}`);
                          toast.success("Copied to clipboard"); 
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
                    {new Date(url.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setState(prev => ({ ...prev, selectedUrl: url }))}
                      >
                        Analytics
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setState(prev => ({ ...prev, selectedUrl: url, showQR: true }))}
                      >
                        QR Code
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Analytics Modal */}
        <Dialog open={!!state.selectedUrl} 
          onOpenChange={(open) => !open && setState(prev => ({ ...prev, selectedUrl: null }))}>
          <DialogContent className="max-w-4xl">
            {state.selectedUrl && (
              <>
                <DialogHeader>
                  <DialogTitle>Analytics for {state.selectedUrl.shortId}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
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
                  <BarChart
                    title="Top Locations"
                    data={state.selectedUrl.clicks.reduce((acc, click) => {
                      acc[click.location] = (acc[click.location] || 0) + 1;
                      return acc;
                    }, {})}
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Subscription Card */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
          <CardContent className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="mb-2">Pro Subscription</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  {state.subscription.usage}/{state.subscription.limit} clicks used
                </CardDescription>
                <div className="mt-4 h-2 bg-primary-foreground/20 rounded-full">
                  <div 
                    className="h-full bg-primary-foreground rounded-full"
                    style={{ width: `${(state.subscription.usage / state.subscription.limit) * 100}%` }}
                  />
                </div>
              </div>
              <Button variant="secondary">Upgrade Plan</Button>
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