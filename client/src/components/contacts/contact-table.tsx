import { useState, useMemo, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Plus, Star, Search, Filter, Download, MoreHorizontal, RefreshCw } from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import MobileContactCard from "./mobile-contact-card";
import type { ContactWithRelations } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import AddInteractionModal from "./add-interaction-modal";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";

interface ContactTableProps {
  onContactSelect?: (contact: ContactWithRelations) => void;
}

export default function ContactTable({ onContactSelect }: ContactTableProps) {
  const { data: contacts, isLoading, refetch } = useContacts();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [strengthFilter, setStrengthFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoized filtering for better performance
  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    
    return contacts.filter(contact => {
      const matchesSearch = !debouncedSearchQuery || 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contact.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter;
      
      const matchesStrength = strengthFilter === "all" || 
        (strengthFilter === "strong" && (contact.relationshipStrength || 0) >= 4) ||
        (strengthFilter === "medium" && (contact.relationshipStrength || 0) === 3) ||
        (strengthFilter === "weak" && (contact.relationshipStrength || 0) <= 2);

      return matchesSearch && matchesCategory && matchesStrength;
    });
  }, [contacts, debouncedSearchQuery, categoryFilter, strengthFilter]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  }, [filteredContacts]);

  const handleSelectContact = useCallback((contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCategoryColor = useCallback((category: string) => {
    const colors = {
      work: "bg-blue-100 text-blue-800 border-blue-200",
      client: "bg-green-100 text-green-800 border-green-200",
      prospect: "bg-purple-100 text-purple-800 border-purple-200",
      family: "bg-pink-100 text-pink-800 border-pink-200",
      friend: "bg-yellow-100 text-yellow-800 border-yellow-200",
      mentor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  }, []);

  const renderStars = useCallback((strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 transition-colors duration-200 ${
          i < strength ? "text-yellow-400 fill-current" : "text-gray-200"
        }`}
      />
    ));
  }, []);

  const getLastContactTime = useCallback((contact: ContactWithRelations) => {
    if (!contact.interactions || contact.interactions.length === 0) {
      return "Never";
    }
    const lastInteraction = contact.interactions[0];
    return formatDistanceToNow(new Date(lastInteraction.createdAt || new Date()), { addSuffix: true });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Enhanced loading skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Management</h3>
            <p className="text-sm text-gray-600">
              {filteredContacts.length} of {contacts?.length || 0} contacts
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            
            {selectedContacts.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedContacts.length} selected
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Enhanced Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts by name, company, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                data-testid="input-search-table"
              />
            </div>
          </div>
          
          {/* Enhanced Filters */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="prospect">Prospects</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="friend">Friends</SelectItem>
              <SelectItem value="mentor">Mentors</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={strengthFilter} onValueChange={setStrengthFilter}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="All Strengths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Strengths</SelectItem>
              <SelectItem value="strong">Strong (4-5)</SelectItem>
              <SelectItem value="medium">Medium (3)</SelectItem>
              <SelectItem value="weak">Weak (1-2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Mobile View with Enhanced Cards */}
      <div className="block lg:hidden">
        <AnimatePresence>
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MobileContactCard
                  contact={contact}
                  onEdit={(contact) => onContactSelect?.(contact)}
                  onDelete={(contact) => console.log('Delete', contact.id)}
                  onInteract={(contact) => {
                    setSelectedContact(contact);
                    setShowInteractionModal(true);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        {filteredContacts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Enhanced Desktop Table View */}
      <div className="hidden lg:block">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <TableHead className="w-12 p-4">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={handleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead className="p-4 font-semibold text-gray-900">Contact</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-900">Company</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-900">Category</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-900">Strength</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-900">Last Contact</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredContacts.map((contact, index) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="p-4">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                          data-testid={`checkbox-contact-${contact.id}`}
                        />
                      </TableCell>
                      
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                              {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900" data-testid={`text-contact-name-${contact.id}`}>
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm text-gray-600" data-testid={`text-contact-email-${contact.id}`}>
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-4">
                        <div>
                          <div className="font-medium text-gray-900" data-testid={`text-contact-company-${contact.id}`}>
                            {contact.company || "—"}
                          </div>
                          <div className="text-sm text-gray-600" data-testid={`text-contact-title-${contact.id}`}>
                            {contact.title || "—"}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-4">
                        <Badge 
                          className={`px-3 py-1 border ${getCategoryColor(contact.category)}`}
                          data-testid={`badge-category-${contact.id}`}
                        >
                          {contact.category}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {renderStars(contact.relationshipStrength || 1)}
                          </div>
                          <span className="text-sm font-medium text-gray-700" data-testid={`text-strength-${contact.id}`}>
                            {contact.relationshipStrength || 1}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-4 text-sm text-gray-600" data-testid={`text-last-contact-${contact.id}`}>
                        {getLastContactTime(contact)}
                      </TableCell>
                      
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log("View contact:", contact.firstName, contact.lastName);
                              onContactSelect?.(contact);
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            data-testid={`button-view-${contact.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log("Edit contact:", contact.firstName, contact.lastName);
                            }}
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
                            data-testid={`button-edit-${contact.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log("Add interaction for:", contact.firstName, contact.lastName);
                              setSelectedContact(contact);
                              setShowInteractionModal(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            data-testid={`button-add-interaction-${contact.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          
          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{filteredContacts.length}</span> contacts
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled className="px-3 py-2">
                Previous
              </Button>
              <Button size="sm" className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700">
                1
              </Button>
              <Button variant="outline" size="sm" disabled className="px-3 py-2">
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <AddInteractionModal 
        open={showInteractionModal}
        onOpenChange={setShowInteractionModal}
        contact={selectedContact}
      />
    </div>
  );
}
