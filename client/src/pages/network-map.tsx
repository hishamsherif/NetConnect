import NetworkVisualization from "@/components/network/network-visualization";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Settings, Download } from "lucide-react";

export default function NetworkMap() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Network Map</h2>
          <p className="text-neutral-600">Interactive visualization of your professional network</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" data-testid="button-export-network">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" data-testid="button-settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-700">Filter by:</span>
              <Button variant="outline" size="sm" data-testid="button-filter-category">
                <Filter className="h-4 w-4 mr-1" />
                Category
              </Button>
              <Button variant="outline" size="sm" data-testid="button-filter-strength">
                <Filter className="h-4 w-4 mr-1" />
                Strength
              </Button>
              <Button variant="outline" size="sm" data-testid="button-filter-company">
                <Filter className="h-4 w-4 mr-1" />
                Company
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-neutral-600">Layout:</span>
              <Badge variant="secondary">Force-directed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="h-[600px]">
            <NetworkVisualization />
          </div>
        </div>

        {/* Network Stats Panel */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Network Insights</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-600">Density</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-600">Clustering</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Key Connectors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">SC</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">Sarah Chen</p>
                    <p className="text-xs text-neutral-600">12 connections</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-secondary">MJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">Marcus Johnson</p>
                    <p className="text-xs text-neutral-600">8 connections</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
