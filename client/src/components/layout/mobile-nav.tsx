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
  FileText,
  X
} from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import AddContactModal from "@/components/contacts/add-contact-modal";
import { useState } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [location] = useLocation();
  const { data: contacts } = useContacts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3, current: location === "/" },
    { name: "Contacts", href: "/contacts", icon: Users, current: location === "/contacts", count: contacts?.length },
    { name: "Network Map", href: "/network-map", icon: Network, current: location === "/network-map" },
    { name: "Analytics", href: "/analytics", icon: TrendingUp, current: location === "/analytics" },
  ];

  const handleNavClick = () => {
    onClose();
  };

  const handleAddContact = () => {
    setIsAddModalOpen(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
        data-testid="mobile-nav-backdrop"
      />
      
      {/* Mobile Navigation Panel */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white border-r border-neutral-200 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800">Navigation</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-mobile-nav"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} onClick={handleNavClick}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer touch-manipulation",
                      item.current
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200"
                    )}
                    data-testid={`mobile-link-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-base">{item.name}</span>
                    {item.count && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-auto",
                          item.current
                            ? "bg-white/20 text-white"
                            : "bg-neutral-200 text-neutral-600"
                        )}
                        data-testid={`mobile-badge-${item.name.toLowerCase()}-count`}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-4">
              Quick Actions
            </h3>
            <Button
              onClick={handleAddContact}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
              data-testid="mobile-button-add-contact"
            >
              <Plus className="h-6 w-6" />
              <span className="font-medium text-base">Add Contact</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center space-x-3 px-4 py-3 mt-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 active:bg-neutral-100 transition-colors touch-manipulation"
              onClick={() => {
                console.log("Import CSV clicked");
                // TODO: Implement CSV import
              }}
              data-testid="mobile-button-import-csv"
            >
              <FileText className="h-6 w-6" />
              <span className="font-medium text-base">Import CSV</span>
            </Button>
          </div>
        </nav>
      </div>
      
      <AddContactModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
    </>
  );
}