import { Users, Handshake, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/use-interactions";

export default function MetricsCards() {
  const { data: stats, isLoading } = useAnalytics();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="w-8 lg:w-12 h-8 lg:h-12 bg-neutral-200 rounded-lg"></div>
                  <div className="w-12 lg:w-16 h-3 lg:h-4 bg-neutral-200 rounded"></div>
                </div>
                <div className="w-12 lg:w-16 h-6 lg:h-8 bg-neutral-200 rounded mb-2"></div>
                <div className="w-16 lg:w-24 h-3 lg:h-4 bg-neutral-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      trend: "+12% this month",
      trendColor: "text-secondary",
      bgColor: "bg-primary bg-opacity-10",
      iconColor: "text-primary",
    },
    {
      title: "Strong Connections",
      value: stats.strongConnections,
      icon: Handshake,
      trend: "+5% this week",
      trendColor: "text-secondary",
      bgColor: "bg-secondary bg-opacity-10",
      iconColor: "text-secondary",
    },
    {
      title: "Recent Interactions",
      value: stats.recentInteractions,
      icon: Calendar,
      trend: "This week",
      trendColor: "text-neutral-500",
      bgColor: "bg-accent bg-opacity-10",
      iconColor: "text-accent",
    },
    {
      title: "Dormant Contacts",
      value: stats.dormantContacts,
      icon: Clock,
      trend: "Need attention",
      trendColor: "text-red-500",
      bgColor: "bg-red-100",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={metric.title} 
          className="hover:shadow-md transition-shadow cursor-pointer" 
          onClick={(e) => {
            console.log(`🔴 METRIC CARD CLICKED: ${metric.title}`);
            console.log("Event:", e);
            console.log("Card element:", e.target);
            console.log("Navigating to contacts page...");
            alert(`Clicked ${metric.title} - navigating to contacts`);
            window.location.href = '/contacts';
          }}
          data-testid={`card-metric-${index}`}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`w-8 lg:w-12 h-8 lg:h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <metric.icon className={`h-4 lg:h-6 w-4 lg:w-6 ${metric.iconColor}`} />
              </div>
              <Badge variant="secondary" className={`text-xs ${metric.trendColor} font-medium`}>
                {metric.trend}
              </Badge>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-neutral-800 mb-1" data-testid={`text-metric-value-${index}`}>
              {metric.value}
            </h3>
            <p className="text-neutral-600 text-xs lg:text-sm" data-testid={`text-metric-title-${index}`}>
              {metric.title}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
