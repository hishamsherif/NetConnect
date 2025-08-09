import MetricsCards from "@/components/dashboard/metrics-cards";
import RecentInteractions from "@/components/dashboard/recent-interactions";
import NetworkVisualization from "@/components/network/network-visualization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import AddContactModal from "@/components/contacts/add-contact-modal";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-neutral-800 mb-2">Dashboard</h2>
        <p className="text-sm lg:text-base text-neutral-600">Overview of your professional network and recent activity</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="mb-8">
        <MetricsCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
        {/* Network Visualization */}
        <div className="xl:col-span-2">
          <NetworkVisualization />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-4 lg:space-y-6">
          <RecentInteractions />
          
          {/* Upcoming Follow-ups */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Follow-up Reminders</CardTitle>
              <Badge className="bg-accent bg-opacity-20 text-accent">3 pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-800">David Kim</h4>
                    <p className="text-sm text-neutral-600">Follow up on project proposal</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700">Today</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-neutral-800">Lisa Park</h4>
                    <p className="text-sm text-neutral-600">Schedule quarterly check-in</p>
                  </div>
                  <Badge variant="secondary">Tomorrow</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-neutral-800">Quick Actions</h3>
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-initial"
            onClick={() => {
              console.log("Export data clicked");
              // TODO: Implement export functionality
            }}
            data-testid="button-export"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button 
            onClick={() => {
              console.log("Add contact clicked");
              setIsAddModalOpen(true);
            }} 
            size="sm" 
            className="flex-1 sm:flex-initial" 
            data-testid="button-add-contact-dashboard"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <AddContactModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
}
