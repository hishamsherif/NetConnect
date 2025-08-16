import { Users, Handshake, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/use-interactions";
import { useLocation } from "wouter";
import { useContacts } from "@/hooks/use-contacts";

export default function MetricsCards() {
  const { data: stats, isLoading } = useAnalytics();
  const { data: contacts } = useContacts();
  const [, setLocation] = useLocation();

  // Ensure we're using the same data source for consistency
  const totalContacts = contacts?.length || 0;
  const strongConnections = contacts?.filter(c => (c.relationshipStrength || 0) >= 4).length || 0;
  const recentInteractions = stats?.recentInteractions || 0;
  const dormantContacts = contacts?.filter(c => {
    if (!c.interactions || c.interactions.length === 0) return true;
    const lastInteraction = new Date(c.interactions[0].createdAt || new Date());
    const daysSince = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 30;
  }).length || 0;

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                  <div className="w-24 h-6 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
                <div className="w-32 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="w-40 h-4 bg-gray-100 rounded-lg animate-pulse"></div>
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
      value: totalContacts,
      icon: Users,
      trend: "+12% this month",
      trendColor: "bg-green-100 text-green-700",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Your professional network size"
    },
    {
      title: "Strong Connections",
      value: strongConnections,
      icon: Handshake,
      trend: "+5% this week",
      trendColor: "bg-blue-100 text-blue-700",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "High-value relationships (4-5 strength)"
    },
    {
      title: "Recent Interactions",
      value: recentInteractions,
      icon: Calendar,
      trend: "This week",
      trendColor: "bg-purple-100 text-purple-700",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Active engagement this week"
    },
    {
      title: "Dormant Contacts",
      value: dormantContacts,
      icon: Clock,
      trend: "Need attention",
      trendColor: "bg-orange-100 text-orange-700",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Contacts needing follow-up"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
      {metrics.map((metric, index) => (
        <Card 
          key={metric.title} 
          className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden" 
          onClick={() => {
            console.log(`${metric.title} metric clicked: ${metric.value}`);
            // Navigate to contacts with proper filtering
            if (metric.title === "Total Contacts") {
              setLocation('/contacts');
            } else if (metric.title === "Strong Connections") {
              setLocation('/contacts?strength=strong');
            } else if (metric.title === "Dormant Contacts") {
              setLocation('/contacts?dormant=true');
            } else {
              setLocation('/contacts');
            }
          }}
          data-testid={`card-metric-${index}`}
        >
          <CardContent className="p-8">
            {/* Header with icon and trend */}
            <div className="flex items-center justify-between mb-6">
              <div className={`w-16 h-16 ${metric.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <metric.icon className={`h-8 w-8 ${metric.iconColor}`} />
              </div>
              <Badge 
                variant="secondary" 
                className={`px-3 py-1.5 text-sm font-medium rounded-full border-0 ${metric.trendColor}`}
              >
                {metric.trend}
              </Badge>
            </div>

            {/* Main metric value */}
            <div className="mb-4">
              <h3 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight" data-testid={`text-metric-value-${index}`}>
                {metric.value.toLocaleString()}
              </h3>
              <p className="text-lg font-medium text-gray-700 mb-2" data-testid={`text-metric-title-${index}`}>
                {metric.title}
              </p>
              {metric.description && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {metric.description}
                </p>
              )}
            </div>

            {/* Interactive indicator */}
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${metric.iconColor.replace('text-', 'bg-').replace('-600', '-100')} rounded-full transition-all duration-300`}
                style={{ width: `${Math.min((metric.value / Math.max(...metrics.map(m => m.value))) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
