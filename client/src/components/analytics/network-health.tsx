import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

interface NetworkHealthMetrics {
  overallScore: number;
  connectionStrength: {
    strong: number;
    medium: number;
    weak: number;
  };
  communicationHealth: {
    active: number;
    declining: number;
    dormant: number;
  };
  networkGrowth: {
    thisMonth: number;
    lastMonth: number;
    trend: 'up' | 'down' | 'stable';
  };
  responseRates: {
    average: number;
    recent: number;
  };
  atRiskRelationships: Array<{
    id: string;
    name: string;
    company: string;
    lastContact: string;
    riskLevel: 'high' | 'medium' | 'low';
  }>;
}

export function NetworkHealth() {
  const { data: healthData, isLoading } = useQuery<NetworkHealthMetrics>({
    queryKey: ['/api/analytics/network-health'],
    retry: false,
  });

  if (isLoading || !healthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Health Score */}
          <div className="text-center space-y-2">
            <div className={`text-3xl font-bold ${getHealthColor(healthData.overallScore)}`}>
              {healthData.overallScore}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Network Health</div>
            <Progress value={healthData.overallScore} className="h-2" />
            <Badge variant={getHealthBadgeVariant(healthData.overallScore)}>
              {healthData.overallScore >= 80 ? "Excellent" : 
               healthData.overallScore >= 60 ? "Good" : "Needs Attention"}
            </Badge>
          </div>

          {/* Connection Strength Distribution */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Connection Strength
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Strong Connections</span>
                <span className="text-sm font-medium text-green-600">
                  {healthData.connectionStrength.strong}
                </span>
              </div>
              <Progress value={healthData.connectionStrength.strong} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium Connections</span>
                <span className="text-sm font-medium text-yellow-600">
                  {healthData.connectionStrength.medium}
                </span>
              </div>
              <Progress value={healthData.connectionStrength.medium} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Weak Connections</span>
                <span className="text-sm font-medium text-red-600">
                  {healthData.connectionStrength.weak}
                </span>
              </div>
              <Progress value={healthData.connectionStrength.weak} className="h-1" />
            </div>
          </div>

          {/* Communication Health */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium">
              <MessageSquare className="h-4 w-4" />
              Communication Activity
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1">
                <div className="text-lg font-semibold text-green-600">
                  {healthData.communicationHealth.active}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-yellow-600">
                  {healthData.communicationHealth.declining}
                </div>
                <div className="text-xs text-muted-foreground">Declining</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-red-600">
                  {healthData.communicationHealth.dormant}
                </div>
                <div className="text-xs text-muted-foreground">Dormant</div>
              </div>
            </div>
          </div>

          {/* Network Growth */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4" />
              Network Growth
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">This Month</div>
                <div className="text-lg font-semibold">{healthData.networkGrowth.thisMonth}</div>
              </div>
              <div className="flex items-center gap-2">
                {healthData.networkGrowth.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : healthData.networkGrowth.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Activity className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm text-muted-foreground">
                  vs {healthData.networkGrowth.lastMonth} last month
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* At-Risk Relationships */}
      {healthData.atRiskRelationships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Relationships Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.atRiskRelationships.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.company}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last contact: {contact.lastContact}
                    </div>
                  </div>
                  <Badge 
                    variant={contact.riskLevel === 'high' ? 'destructive' : 
                            contact.riskLevel === 'medium' ? 'secondary' : 'outline'}
                  >
                    {contact.riskLevel} risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}