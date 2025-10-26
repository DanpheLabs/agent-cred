import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Activity, Users } from "lucide-react";
import { getAnalytics } from "@/lib/storage";

export const Analytics = () => {
  const analytics = getAnalytics();
  
  const metrics = [
    {
      title: "Total Received",
      value: `${analytics.totalReceived.toFixed(2)} USDC`,
      change: "+12.5%",
      trend: "up",
      icon: ArrowDownRight
    },
    {
      title: "Total Sent",
      value: `${analytics.totalSent.toFixed(2)} USDC`,
      change: "-8.3%",
      trend: "down",
      icon: ArrowUpRight
    },
    {
      title: "Active Agents",
      value: analytics.activeAgents.toString(),
      change: `${analytics.totalAgents} total`,
      trend: "up",
      icon: Users
    },
    {
      title: "Pending Requests",
      value: analytics.pendingRequests.toString(),
      change: "Awaiting approval",
      trend: "down",
      icon: Activity
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.trend === "up";
        
        return (
          <Card key={index} className="glass p-6  border-border/50 glow-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2  glass">
                <Icon className={`h-5 w-5 ${isPositive ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-sm font-medium ${isPositive ? 'text-white' : 'text-white'}`}>
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
            <p className="text-2xl font-normal">{metric.value}</p>
          </Card>
        );
      })}
    </div>
  );
};
