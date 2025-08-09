import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Maximize2, RotateCcw } from "lucide-react";
import { useNetworkGraphData } from "@/hooks/use-interactions";
import * as d3 from "d3";

export default function NetworkVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: graphData, isLoading } = useNetworkGraphData();

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Create simulation
    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force("link", d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create container group
    const g = svg.append("g");

    // Add links
    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", (d: any) => Math.sqrt(d.strength) * 2);

    // Add nodes
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", (d: any) => 5 + d.strength * 3)
      .attr("fill", (d: any) => {
        const colors: Record<string, string> = {
          work: "#2563EB",
          client: "#10B981", 
          prospect: "#8B5CF6",
          family: "#EC4899",
          friend: "#F59E0B",
          mentor: "#6366F1",
        };
        return colors[d.category] || "#6B7280";
      })
      .call(d3.drag()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    // Add labels
    const label = g.append("g")
      .selectAll("text")
      .data(graphData.nodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("font-size", "10px")
      .attr("dx", 12)
      .attr("dy", 4);

    // Add tooltips
    node.append("title")
      .text((d: any) => `${d.name}\n${d.company || ''}\nStrength: ${d.strength}`);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Network Map</h3>
        </div>
        
        <div className="w-full h-96 bg-neutral-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading network visualization...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Network Map</h3>
        </div>
        
        <div className="w-full h-96 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl text-neutral-400 mb-4">🕸️</div>
            <p className="text-neutral-600 font-medium">No Network Data</p>
            <p className="text-sm text-neutral-500">Add some contacts and relationships to see your network map</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Network Map</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              alert("Network filter clicked!");
              console.log("Filter button working");
            }}
            data-testid="button-filter-network"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              alert("Fullscreen clicked!");
              console.log("Fullscreen button working");
              setIsFullscreen(!isFullscreen);
            }}
            data-testid="button-fullscreen"
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            Fullscreen
          </Button>
        </div>
      </div>
      
      <div className="w-full h-96 bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
        <svg 
          ref={svgRef}
          width="100%"
          height="100%"
          className="cursor-move"
          data-testid="svg-network-visualization"
        />
      </div>

      {/* Network Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-neutral-600">Work</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary rounded-full"></div>
          <span className="text-neutral-600">Client</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-neutral-600">Prospect</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span className="text-neutral-600">Family</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span className="text-neutral-600">Friend</span>
        </div>
      </div>
      
      {/* Network Stats */}
      <div className="mt-4 text-center text-xs text-neutral-500">
        {graphData.nodes.length} contacts • {graphData.links.length} connections
      </div>
    </div>
  );
}
