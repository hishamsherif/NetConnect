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
  Sparkles
} from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import AddContactModal from "@/components/contacts/add-contact-modal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [location] = useLocation();
  const { data: contacts } = useContacts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/", 
      icon: BarChart3, 
      current: location === "/",
      description: "Overview and insights"
    },
    { 
      name: "Contacts", 
      href: "/contacts", 
      icon: Users, 
      current: location === "/contacts", 
      count: contacts?.length,
      description: "Manage your network"
    },
    { 
      name: "Network Map", 
      href: "/network", 
      icon: Network, 
      current: location === "/network",
      description: "Visualize connections"
    },
    { 
      name: "Interactions", 
      href: "/interactions", 
      icon: MessageCircle, 
      current: location === "/interactions",
      description: "Track engagement"
    },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: TrendingUp, 
      current: location === "/analytics",
      description: "Network insights"
    },
    { 
      name: "Tags", 
      href: "/tags", 
      icon: Tags, 
      current: location === "/tags",
      description: "Organize contacts"
    },
  ];

  return (
    <>
      <aside className="w-64 bg-gradient-to-b from-white to-gray-50/30 border-r border-gray-200/60 min-h-screen">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NetworkTracker
              </h1>
              <p className="text-xs text-gray-500">Professional Network Management</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/40">
            <div className="text-sm text-gray-600 mb-1">Total Contacts</div>
            <div className="text-2xl font-bold text-gray-900">{contacts?.length || 0}</div>
            <div className="text-xs text-green-600 flex items-center space-x-1">
              <span>↗</span>
              <span>+12% this month</span>
            </div>
          </div>
        </div>

        <nav className="p-6">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        "group relative flex items-center space-x-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer",
                        item.current
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-gray-700 hover:bg-white/80 hover:shadow-sm"
                      )}
                      onHoverStart={() => setHoveredItem(item.name)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background glow effect for current item */}
                      {item.current && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      <div className="relative z-10 flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                          item.current
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          {item.description && (
                            <div className={cn(
                              "text-xs transition-opacity duration-200",
                              item.current ? "text-white/80" : "text-gray-500 group-hover:text-gray-700"
                            )}>
                              {item.description}
                            </div>
                          )}
                        </div>
                        
                        {item.count && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto transition-all duration-200",
                              item.current
                                ? "bg-white/20 text-white border-white/30"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            )}
                            data-testid={`badge-${item.name.toLowerCase().replace(' ', '-')}-count`}
                          >
                            {item.count}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Hover indicator */}
                      {hoveredItem === item.name && !item.current && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
                data-testid="button-add-contact"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-semibold">Add Contact</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 rounded-xl py-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                onClick={() => {
                  console.log("Import CSV clicked");
                  // TODO: Implement CSV import functionality
                }}
                data-testid="button-import-csv"
              >
                <FileText className="h-5 w-5 mr-2" />
                <span className="font-semibold">Import CSV</span>
              </Button>
            </motion.div>
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
