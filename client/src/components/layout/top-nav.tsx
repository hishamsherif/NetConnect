import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchContacts } from "@/hooks/use-contacts";

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading } = useSearchContacts(searchQuery);

  return (
    <nav className="bg-white border-b border-neutral-200 px-4 lg:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-network-wired text-white text-sm"></i>
            </div>
            <h1 className="text-lg lg:text-xl font-semibold text-neutral-800">NetworkTracker</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search - Hidden on small screens, shown on medium+ */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-48 lg:w-80 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="input-search-contacts"
            />
            
            {/* Search Results Dropdown */}
            {searchQuery && searchResults && (
              <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto z-50">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-neutral-500 text-sm">No contacts found</div>
                ) : (
                  searchResults.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                      data-testid={`search-result-${contact.id}`}
                    >
                      <div className="font-medium text-neutral-800">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {contact.company} • {contact.email}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-search">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-accent"></Badge>
          </Button>
          
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-neutral-700 hidden sm:block">John Smith</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
