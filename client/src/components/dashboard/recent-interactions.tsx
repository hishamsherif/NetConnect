import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useInteractions } from "@/hooks/use-interactions";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export default function RecentInteractions() {
  const { data: interactions, isLoading } = useInteractions(undefined, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-neutral-200 rounded mb-1"></div>
                  <div className="w-32 h-3 bg-neutral-200 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!interactions || interactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-neutral-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No interactions yet</p>
            <p className="text-sm">Start connecting with your contacts!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "meeting": return "☕";
      case "call": return "📞";
      case "email": return "📧";
      case "message": return "💬";
      default: return "🤝";
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-secondary";
      case "call": return "bg-primary";
      case "email": return "bg-accent";
      case "message": return "bg-purple-500";
      default: return "bg-neutral-500";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Interactions</CardTitle>
        <button 
          onClick={() => {
            console.log("View all interactions clicked");
            window.location.href = '/contacts';
          }}
          className="text-primary text-sm hover:underline cursor-pointer" 
          data-testid="link-view-all-interactions"
        >
          View all
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interactions.slice(0, 5).map((interaction) => (
            <div key={interaction.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50" data-testid={`interaction-${interaction.id}`}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {interaction.contact.firstName.charAt(0)}{interaction.contact.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-neutral-800" data-testid={`text-contact-name-${interaction.id}`}>
                  {interaction.contact.firstName} {interaction.contact.lastName}
                </h4>
                <p className="text-sm text-neutral-600 flex items-center gap-1" data-testid={`text-interaction-type-${interaction.id}`}>
                  <span>{getInteractionIcon(interaction.type)}</span>
                  {interaction.type} {interaction.subject && `• ${interaction.subject}`}
                </p>
                <p className="text-xs text-neutral-500" data-testid={`text-interaction-time-${interaction.id}`}>
                  {formatDistanceToNow(new Date(interaction.createdAt || new Date()), { addSuffix: true })}
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${getInteractionColor(interaction.type)}`}></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
