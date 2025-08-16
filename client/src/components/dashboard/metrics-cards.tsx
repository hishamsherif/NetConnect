import { Users, Handshake, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/use-interactions";
import { useLocation } from "wouter";

export default function MetricsCards() {
  const { data: stats, isLoading } = useAnalytics();
  const [, setLocation] = useLocation();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-black rounded-none"></div>
                  <div className="w-24 h-6 bg-black rounded-none"></div>
                </div>
                <div className="w-32 h-12 bg-black rounded-none"></div>
                <div className="w-40 h-4 bg-black rounded-none"></div>
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
      trendColor: "bg-green-500 text-white",
      bgColor: "bg-black",
      iconColor: "text-white",
    },
    {
      title: "Strong Connections",
      value: stats.strongConnections,
      icon: Handshake,
      trend: "+5% this week",
      trendColor: "bg-blue-500 text-white",
      bgColor: "bg-black",
      iconColor: "text-white",
    },
    {
      title: "Recent Interactions",
      value: stats.recentInteractions,
      icon: Calendar,
      trend: "This week",
      trendColor: "bg-gray-800 text-white",
      bgColor: "bg-black",
      iconColor: "text-white",
    },
    {
      title: "Dormant Contacts",
      value: stats.dormantContacts,
      icon: Clock,
      trend: "Need attention",
      trendColor: "bg-red-500 text-white",
      bgColor: "bg-black",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={metric.title} 
          className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 cursor-pointer" 
          onClick={() => {
            console.log(`${metric.title} metric clicked`);
            setLocation('/contacts');
          }}
          data-testid={`card-metric-${index}`}
        >
          <CardContent className="p-8 h-64 flex flex-col justify-between">
            {/* Header with icon and trend */}
            <div className="flex items-center justify-between">
              <div className={`w-16 h-16 ${metric.bgColor} rounded-none flex items-center justify-center`}>
                <metric.icon className={`h-8 w-8 ${metric.iconColor}`} />
              </div>
              <Badge 
                variant="secondary" 
                className={`px-3 py-2 text-sm font-bold border-2 border-black rounded-none ${metric.trendColor}`}
              >
                {metric.trend}
              </Badge>
            </div>

            {/* Main metric value */}
            <div className="text-center">
              <h3 className="text-5xl font-black text-black mb-4 tracking-tight" data-testid={`text-metric-value-${index}`}>
                {metric.value}
              </h3>
              <p className="text-lg font-bold text-black uppercase tracking-wider" data-testid={`text-metric-title-${index}`}>
                {metric.title}
              </p>
            </div>

            {/* Bottom accent line */}
            <div className="w-full h-2 bg-black"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
