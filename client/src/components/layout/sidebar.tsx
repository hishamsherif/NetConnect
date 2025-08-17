import { Users, BarChart3, Network, Settings, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useContacts } from "@/hooks/use-contacts";
import { useAnalytics } from "@/hooks/use-interactions";

interface SidebarProps {
  onAddContact?: () => void;
  onImportCSV?: () => void;
}

export default function Sidebar({ onAddContact, onImportCSV }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { data: contacts } = useContacts();
  const { data: stats } = useAnalytics();

  // Use the same data source as metrics cards for consistency
  const totalContacts = contacts?.length || 0;
  const strongConnections = contacts?.filter(c => (c.relationshipStrength || 0) >= 4).length || 0;
  const recentInteractions = stats?.recentInteractions || 0;

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: BarChart3,
      description: "Overview and metrics",
      count: totalContacts
    },
    {
      name: "Contacts",
      href: "/contacts",
      icon: Users,
      description: "Manage your network",
      count: totalContacts
    },
    {
      name: "Network Map",
      href: "/network-map",
      icon: Network,
      description: "Visualize connections",
      count: strongConnections
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Deep insights",
      count: recentInteractions
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Configure preferences"
    }
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-sm h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NetworkTracker</h1>
            <p className="text-sm text-gray-600">Professional Network Management</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Total Contacts</span>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-2 py-1 text-xs font-medium">
                {totalContacts}
              </Badge>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Strong Connections</span>
              <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full px-2 py-1 text-xs font-medium">
                {strongConnections}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => {
                console.log(`Navigating to ${item.name}: ${item.href}`);
                setLocation(item.href);
              }}
              className={`w-full group flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-base">{item.name}</div>
                  {item.description && (
                    <div className={`text-sm ${
                      isActive(item.href) ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              
              {item.count !== undefined && (
                <Badge className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}>
                  {item.count}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-200 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <Button
          onClick={() => {
            console.log("Add Contact button clicked");
            onAddContact?.();
          }}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[0.98] focus:scale-[0.98] active:scale-[0.96] flex items-center justify-center space-x-2"
          data-testid="button-add-contact-sidebar"
        >
          <Plus className="h-5 w-5" />
          <span>Add Contact</span>
        </Button>
        
        <Button
          onClick={() => {
            console.log("Import CSV button clicked");
            onImportCSV?.();
          }}
          variant="outline"
          className="w-full bg-white text-gray-700 hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 px-4 py-3 rounded-xl font-medium border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-[0.98] focus:scale-[0.98] flex items-center justify-center space-x-2"
          data-testid="button-import-csv-sidebar"
        >
          <Upload className="h-5 w-5" />
          <span>Import CSV</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 mt-auto">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            NetworkTracker v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Professional Network Management
          </p>
        </div>
      </div>
    </div>
  );
}
