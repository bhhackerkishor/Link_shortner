"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, Settings, Package,
  LineChart, Link, Bell, Search
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatTimeAgo } from "@/utils/constants/time";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import {
    AreaChart as ReAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import moment from "moment";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";


type Click = {
  timestamp: string;
};

type UrlData = {
  _id: string;
  shortId: string;
  originalUrl: string;
  clicks: Click[];
};

type Subscription = {
  plan: string;
  limit: number;
  usage: number;
  renewal: string;
};

type DashboardState = {
  urls: UrlData[];
  totalUrls: number;
  selectedUrl: UrlData | null;
  showCreateDialog: boolean;
  newUrl: string;
  subscription: Subscription;
};

// ✅ useState with proper type


export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [monclicks, setMonclicks] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [chartRange, setChartRange] = useState<RangeType>("monthly");

  // const [state, setState] = useState({
  //   urls: [],
  //   totalUrls: 0,
  //   selectedUrl: UrlData | null,
  //   showCreateDialog: false,
  //   newUrl: "",
  //   subscription: {
  //     plan: "Pro",
  //     limit: 5000,
  //     usage: 0,
  //     renewal: "2024-03-15",
  //   },
  // });
  const [state, setState] = useState<DashboardState>({
    urls: [],
    totalUrls: 0,
    selectedUrl: null,
    showCreateDialog: false,
    newUrl: "",
    subscription: {
      plan: "Pro",
      limit: 5000,
      usage: 0,
      renewal: "2024-03-15",
    },
  });

  const fetchData = async () => {
    try {
      const [urlsRes, countRes, recentRes, activeRes] = await Promise.all([
        fetch("/api/user/user-urls"),
        fetch("/api/urls/count"),
        fetch("/api/recent-activity"),
        fetch("/api/stats/active-users"),
      ]);
  
      const urlsData = await urlsRes.json();
      const countData = await countRes.json();
      const recentData = await recentRes.json();
      const activeUsersData = await activeRes.json();
  
      const totalClicks = urlsData.data.reduce(
        (sum: number, url: UrlData) => sum + url.clicks.length,
        0
      );
  
      setState((prev) => ({
        ...prev,
        urls: urlsData.data,
        totalUrls: countData.total,
        selectedUrl: urlsData.data[0] || null,
        subscription: {
          ...prev.subscription,
          usage: totalClicks,
        },
      }));
  
      setMonclicks(totalClicks);
      setRecentActivities(recentData.data || []);
      setActiveUsers(activeUsersData.activeUsers);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  type RangeType = "yearly" | "monthly" | "weekly";
  
  const getGroupedClickData = (clicks: { timestamp: string }[], range: RangeType) => {
    const grouped = new Map<string, number>();
  
    clicks.forEach((click) => {
      const date = new Date(click.timestamp);
      let key = "";
  
      if (range === "yearly") {
        key = date.toLocaleString("default", { month: "short" });
      } else if (range === "monthly") {
        const week = Math.ceil(date.getDate() / 7);
        key = `Week ${week}`;
      } else if (range === "weekly") {
        key = date.toLocaleString("default", { weekday: "short" });
      }
  
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });
  
    return Array.from(grouped.entries()).map(([label, count]) => ({
      [range === "yearly" ? "month" : range === "monthly" ? "week" : "day"]: label,
      clicks: count,
    }));
  };
  
  // ✅ Now this will work perfectly with no error
  const realClickData = getGroupedClickData(state.selectedUrl?.clicks || [], chartRange);
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <div className="flex-1">
        <header className="bg-black h-16 border-b border-[#262626] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Search className="text-[#A3A3A3] w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white placeholder-[#737373] outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="text-[#A3A3A3] w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Total Links", value: state.totalUrls, color: "bg-gray-500", icon: "Link" },
              { title: "Total Clicks", value: monclicks, color: "bg-green-500", icon: "MousePointer2" },
              { title: "Active users", value: activeUsers, color: "bg-purple-500", icon: "Users" },
            ].map((stat, index) => {
              const Icon = Icons[stat.icon as keyof typeof Icons] as LucideIcon;
              return (
                <Card key={index} className="bg-[#171717] border-[#262626] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-[#333] rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-[#D3D3D3] text-sm">{stat.title}</CardTitle>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
            {/* Clicks Chart */}
            <Card className="bg-[#171717] border-[#262626]">
  <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <CardTitle className="text-white">Clicks Overview</CardTitle>
    <div className="w-full md:w-60">
    <Select
        value={state.selectedUrl?.shortId ?? ""}
        onValueChange={(value) => {
          const selected = state.urls.find((url) => url.shortId === value) ?? null;
          setState((prev) => ({ ...prev, selectedUrl: selected }));
        }}
        
      >
        <SelectTrigger className="bg-[#1F1F1F] border-[#333] text-white">
          <SelectValue placeholder="Select a URL" />
        </SelectTrigger>
        <SelectContent className="bg-[#1F1F1F] border-[#333] text-white max-h-60 overflow-y-auto">
          {state.urls.map((url) => (
            <SelectItem key={url._id} value={url.shortId}>
              {url.shortId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </CardHeader>

  <CardContent className="h-[320px]">
    {!state.selectedUrl || realClickData.length === 0 ? (
      <p className="text-gray-400 text-sm">No data to show for the selected URL.</p>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart
          data={realClickData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey={
              chartRange === "yearly"
                ? "month"
                : chartRange === "monthly"
                ? "week"
                : "day"
            }
            stroke="#A3A3A3"
          />
          <YAxis stroke="#A3A3A3" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F1F1F",
              border: "none",
              color: "#fff",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#4ADE80"
            fill="#4ADE80"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    )}
  </CardContent>
</Card>
          {/* Recent Activity */}
          <Card className="bg-[#171717] border-[#262626]">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-400">No recent activity found.</p>
                ) : (
                  recentActivities.map((activity: any, i: number) => (
                    <div key={activity._id} className="flex items-center justify-between hover:bg-[#1F1F1F] p-3 rounded-xl transition">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`/user-${(i % 5) + 1}.png`} />
                          <AvatarFallback>U{i + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm">
                            <span className="font-semibold text-green-400">{activity.shortId}</span> was shortened
                          </p>
                          <p className="text-xs text-[#A3A3A3]">{formatTimeAgo(activity.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs text-white bg-[#262626] border-none">
                          {activity.clicks.length} Click{activity.clicks.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
