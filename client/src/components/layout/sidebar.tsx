import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Network, 
  MessageCircle, 
  TrendingUp, 
  Tags, 
  Plus, 
  FileText
} from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import AddContactModal from "@/components/contacts/add-contact-modal";
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const { data: contacts } = useContacts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigation = [
    { name: "DASHBOARD", href: "/", icon: BarChart3, current: location === "/" },
    { name: "CONTACTS", href: "/contacts", icon: Users, current: location === "/contacts", count: contacts?.length },
    { name: "NETWORK MAP", href: "/network", icon: Network, current: location === "/network" },
    { name: "INTERACTIONS", href: "/interactions", icon: MessageCircle, current: location === "/interactions" },
    { name: "ANALYTICS", href: "/analytics", icon: TrendingUp, current: location === "/analytics" },
    { name: "TAGS", href: "/tags", icon: Tags, current: location === "/tags" },
  ];

  return (
    <>
      <aside className="w-64 bg-white border-r-2 border-black min-h-screen">
        {/* Header */}
        <div className="p-6 border-b-2 border-black">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-black uppercase tracking-wider mb-2">
              NETWORKTRACKER
            </h1>
            <p className="text-sm font-bold text-black uppercase tracking-wider">PROFESSIONAL NETWORK MANAGEMENT</p>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-black text-white p-4 border-2 border-black">
            <div className="text-sm font-bold uppercase tracking-wider mb-2">TOTAL CONTACTS</div>
            <div className="text-3xl font-black">{contacts?.length || 0}</div>
            <div className="text-xs font-bold text-green-400 flex items-center space-x-1 mt-1">
              <span>↗</span>
              <span>+12% THIS MONTH</span>
            </div>
          </div>
        </div>

        <nav className="p-6">
          <div className="mb-8">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
              NAVIGATION
            </h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex items-center space-x-4 px-4 py-4 font-black text-lg transition-all duration-200 cursor-pointer border-2",
                        item.current
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black hover:bg-black hover:text-white"
                      )}
                      data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center border-2",
                        item.current
                          ? "border-white bg-white text-black"
                          : "border-black bg-black text-white group-hover:border-white group-hover:bg-white group-hover:text-black"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="uppercase tracking-wider">{item.name}</span>
                      {item.count && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-auto px-3 py-1 text-sm font-black border-2 rounded-none",
                            item.current
                              ? "bg-white text-black border-white"
                              : "bg-black text-white border-black"
                          )}
                          data-testid={`badge-${item.name.toLowerCase()}-count`}
                        >
                          {item.count}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
              QUICK ACTIONS
            </h3>
            
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full bg-black text-white border-2 border-black py-4 text-lg font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200 rounded-none"
              data-testid="button-add-contact"
            >
              <Plus className="h-6 w-6 mr-3" />
              ADD CONTACT
            </Button>
            
            <Button
              variant="outline"
              className="w-full bg-white text-black border-2 border-black py-4 text-lg font-black uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-200 rounded-none"
              onClick={() => {
                console.log("Import CSV clicked");
                // TODO: Implement CSV import functionality
              }}
              data-testid="button-import-csv"
            >
              <FileText className="h-6 w-6 mr-3" />
              IMPORT CSV
            </Button>
          </div>
        </nav>
      </aside>
      
      <AddContactModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
    </>
  );
}
