import { Users, Handshake, Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/use-interactions";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Enhanced metric card with modern design patterns
interface MetricCardProps {
  metric: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    trend: string;
    trendDirection: 'up' | 'down' | 'neutral';
    bgColor: string;
    iconColor: string;
    description?: string;
  };
  index: number;
  onClick: () => void;
}

const MetricCard = ({ metric, index, onClick }: MetricCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter effect for better visual feedback
  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = metric.value / 30; // Smooth animation over 30 steps
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= metric.value) {
          setDisplayValue(metric.value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 50);
      return () => clearInterval(interval);
    }, index * 100); // Staggered animation

    return () => clearTimeout(timer);
  }, [metric.value, index]);

  const getTrendIcon = () => {
    switch (metric.trendDirection) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`
          group relative overflow-hidden cursor-pointer
          bg-gradient-to-br from-white to-gray-50/50
          border border-gray-200/60 hover:border-gray-300
          transition-all duration-300 ease-out
          ${isHovered ? 'shadow-xl shadow-gray-200/50' : 'shadow-sm'}
        `}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        data-testid={`card-metric-${index}`}
      >
        {/* Subtle background pattern for visual interest */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="relative p-6">
          {/* Header with icon and trend */}
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${metric.bgColor} group-hover:scale-110
                transition-all duration-300 ease-out
              `}
              whileHover={{ rotate: 5 }}
            >
              <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
            </motion.div>
            
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <Badge 
                variant="secondary" 
                className={`
                  text-xs font-medium px-2 py-1
                  ${metric.trendDirection === 'up' ? 'bg-green-100 text-green-700' : 
                    metric.trendDirection === 'down' ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-600'}
                  transition-colors duration-200
                `}
              >
                {metric.trend}
              </Badge>
            </div>
          </div>

          {/* Main metric value with animated counter */}
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-2"
            data-testid={`text-metric-value-${index}`}
            key={displayValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayValue.toLocaleString()}
          </motion.h3>

          {/* Title and description */}
          <p className="text-gray-600 font-medium mb-1" data-testid={`text-metric-title-${index}`}>
            {metric.title}
          </p>
          {metric.description && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {metric.description}
            </p>
          )}

          {/* Interactive indicator */}
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function MetricsCards() {
  const { data: stats, isLoading } = useAnalytics();
  const [, setLocation] = useLocation();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
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
      trendDirection: 'up' as const,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-white",
      description: "Your professional network size"
    },
    {
      title: "Strong Connections",
      value: stats.strongConnections,
      icon: Handshake,
      trend: "+5% this week",
      trendDirection: 'up' as const,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      iconColor: "text-white",
      description: "High-value relationships (4-5 strength)"
    },
    {
      title: "Recent Interactions",
      value: stats.recentInteractions,
      icon: Calendar,
      trend: "This week",
      trendDirection: 'neutral' as const,
      bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
      iconColor: "text-white",
      description: "Active engagement this week"
    },
    {
      title: "Dormant Contacts",
      value: stats.dormantContacts,
      icon: Clock,
      trend: "Need attention",
      trendDirection: 'down' as const,
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconColor: "text-white",
      description: "Contacts needing follow-up"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            metric={metric}
            index={index}
            onClick={() => {
              console.log(`${metric.title} metric clicked`);
              setLocation('/contacts');
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
