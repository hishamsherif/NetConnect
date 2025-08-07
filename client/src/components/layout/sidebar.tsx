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
    { name: "Dashboard", href: "/", icon: BarChart3, current: location === "/" },
    { name: "Contacts", href: "/contacts", icon: Users, current: location === "/contacts", count: contacts?.length },
    { name: "Network Map", href: "/network", icon: Network, current: location === "/network" },
    { name: "Interactions", href: "/interactions", icon: MessageCircle, current: location === "/interactions" },
    { name: "Analytics", href: "/analytics", icon: TrendingUp, current: location === "/analytics" },
    { name: "Tags", href: "/tags", icon: Tags, current: location === "/tags" },
  ];

  return (
    <>
      <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen">
        <nav className="p-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                      item.current
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                    data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.count && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-auto",
                          item.current
                            ? "bg-white/20 text-white"
                            : "bg-neutral-200 text-neutral-600"
                        )}
                        data-testid={`badge-${item.name.toLowerCase()}-count`}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center space-x-3 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="button-add-contact"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Contact</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center space-x-3 px-3 py-2 mt-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              data-testid="button-import-csv"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Import CSV</span>
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
