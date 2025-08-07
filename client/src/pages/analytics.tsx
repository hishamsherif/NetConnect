import { NetworkHealth } from "@/components/analytics/network-health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, MessageSquare, Network } from "lucide-react";

interface AnalyticsStats {
  totalContacts: number;
  strongConnections: number;
  recentInteractions: number;
  dormantContacts: number;
}

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = useQuery<AnalyticsStats>({
    queryKey: ['/api/analytics/stats'],
    retry: false,
  });

  if (statsLoading || !stats) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold">Network Analytics</h1>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 lg:p-6">
                <div className="animate-pulse">
                  <div className="h-3 lg:h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 lg:h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="animate-pulse space-y-3 lg:space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-3 lg:h-4 bg-muted rounded mb-2"></div>
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="animate-pulse space-y-3 lg:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 lg:h-16 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Network Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card data-testid="card-total-contacts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-3 lg:h-4 w-3 lg:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold" data-testid="text-total-contacts">
              {stats.totalContacts}
            </div>
            <p className="text-xs text-muted-foreground">
              Active network size
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-strong-connections">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strong Connections</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-strong-connections">
              {stats.strongConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              Strength 4-5 relationships
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-recent-interactions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-recent-interactions">
              {stats.recentInteractions}
            </div>
            <p className="text-xs text-muted-foreground">
              Interactions this week
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-dormant-contacts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dormant Contacts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-dormant-contacts">
              {stats.dormantContacts}
            </div>
            <p className="text-xs text-muted-foreground">
              Need follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Network Health Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkHealth />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Network Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Key Recommendations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  You have {Math.round((stats.strongConnections / stats.totalContacts) * 100)}% strong connections - excellent network quality
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  {stats.dormantContacts} contacts haven't been contacted recently
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Consider reaching out to dormant high-value connections
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  Your network is growing at a healthy pace
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Network Composition</h4>
              <div className="text-sm text-muted-foreground">
                <p>Strong connections: {Math.round((stats.strongConnections / stats.totalContacts) * 100)}%</p>
                <p>Recent activity rate: {Math.round((stats.recentInteractions / stats.totalContacts) * 100)}%</p>
                <p>Network health score: {Math.min(100, Math.round(((stats.strongConnections * 2) + stats.recentInteractions) / stats.totalContacts * 50))}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Next Actions</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Schedule follow-ups with {Math.min(5, stats.dormantContacts)} dormant contacts</li>
                <li>• Convert {Math.max(1, Math.floor(stats.totalContacts * 0.1))} medium connections to strong</li>
                <li>• Add {Math.max(3, Math.floor(stats.totalContacts * 0.05))} new contacts this month</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}