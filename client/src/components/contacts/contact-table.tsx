import { useState, useEffect } from "react";
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
import { Eye, Edit, Plus, Star, Search, Filter } from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import MobileContactCard from "./mobile-contact-card";
import type { ContactWithRelations } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import AddInteractionModal from "./add-interaction-modal";
import { useLocation } from "wouter";

interface ContactTableProps {
  onContactSelect?: (contact: ContactWithRelations) => void;
}

export default function ContactTable({ onContactSelect }: ContactTableProps) {
  const { data: contacts, isLoading } = useContacts();
  const [location, setLocation] = useLocation();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [strengthFilter, setStrengthFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  // Handle URL parameters for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const strength = urlParams.get('strength');
    const dormant = urlParams.get('dormant');
    
    if (strength) {
      setStrengthFilter(strength);
    }
    
    if (dormant === 'true') {
      // Filter for dormant contacts (no interactions in 30+ days)
      setStrengthFilter('dormant');
    }
  }, [location]);

  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = !searchQuery || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter;
    
    let matchesStrength = true;
    if (strengthFilter === "strong") {
      matchesStrength = (contact.relationshipStrength || 0) >= 4;
    } else if (strengthFilter === "medium") {
      matchesStrength = (contact.relationshipStrength || 0) === 3;
    } else if (strengthFilter === "weak") {
      matchesStrength = (contact.relationshipStrength || 0) <= 2;
    } else if (strengthFilter === "dormant") {
      // Dormant contacts: no interactions in 30+ days
      if (!contact.interactions || contact.interactions.length === 0) {
        matchesStrength = true;
      } else {
        const lastInteraction = new Date(contact.interactions[0].createdAt || new Date());
        const daysSince = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
        matchesStrength = daysSince > 30;
      }
    }

    return matchesSearch && matchesCategory && matchesStrength;
  }) || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: "bg-blue-50 text-blue-700 border-blue-200",
      client: "bg-green-50 text-green-700 border-green-200",
      prospect: "bg-purple-50 text-purple-700 border-purple-200",
      family: "bg-pink-50 text-pink-700 border-pink-200",
      friend: "bg-yellow-50 text-yellow-700 border-yellow-200",
      mentor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const renderStars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < strength ? "text-yellow-400 fill-current" : "text-gray-200"
        }`}
      />
    ));
  };

  const getLastContactTime = (contact: ContactWithRelations) => {
    if (!contact.interactions || contact.interactions.length === 0) {
      return "Never";
    }
    const lastInteraction = contact.interactions[0];
    return formatDistanceToNow(new Date(lastInteraction.createdAt || new Date()), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg font-medium text-gray-600">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">
      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Contact Management</h3>
            <p className="text-lg text-gray-600">
              {filteredContacts.length} of {contacts?.length || 0} contacts
            </p>
          </div>
          
          {selectedContacts.length > 0 && (
            <Badge variant="secondary" className="px-4 py-2 text-base font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              {selectedContacts.length} selected
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, company, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base transition-all duration-200"
                data-testid="input-search-table"
              />
            </div>
          </div>
          
          {/* Filters */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-4 text-base">
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
            <SelectTrigger className="border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-4 text-base">
              <SelectValue placeholder="All Strengths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Strengths</SelectItem>
              <SelectItem value="strong">Strong (4-5)</SelectItem>
              <SelectItem value="medium">Medium (3)</SelectItem>
              <SelectItem value="weak">Weak (1-2)</SelectItem>
              <SelectItem value="dormant">Dormant (30+ days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <MobileContactCard
              key={contact.id}
              contact={contact}
              onEdit={(contact) => onContactSelect?.(contact)}
              onDelete={(contact) => console.log('Delete', contact.id)}
              onInteract={(contact) => {
                setSelectedContact(contact);
                setShowInteractionModal(true);
              }}
            />
          ))}
          {filteredContacts.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-16 p-6">
                  <Checkbox
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                    className="border border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-md"
                  />
                </TableHead>
                <TableHead className="p-6 font-semibold text-gray-900 text-base">Contact</TableHead>
                <TableHead className="p-6 font-semibold text-gray-900 text-base">Company</TableHead>
                <TableHead className="p-6 font-semibold text-gray-900 text-base">Category</TableHead>
                <TableHead className="p-6 font-semibold text-gray-900 text-base">Strength</TableHead>
                <TableHead className="p-6 font-semibold text-gray-900 text-base">Last Contact</TableHead>
                <TableHead className="p-6 font-semibold text-gray-900 text-base">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="p-6">
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      data-testid={`checkbox-contact-${contact.id}`}
                      className="border border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-md"
                    />
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border border-gray-200">
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-lg rounded-xl">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        onClick={() => {
                          console.log("Contact selected:", contact.firstName, contact.lastName);
                          onContactSelect?.(contact);
                        }}
                      >
                        <div className="font-semibold text-gray-900 text-base hover:text-blue-600" data-testid={`text-contact-name-${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-gray-600" data-testid={`text-contact-email-${contact.id}`}>
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <div>
                      <div className="font-medium text-gray-900 text-base" data-testid={`text-contact-company-${contact.id}`}>
                        {contact.company || "—"}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`text-contact-title-${contact.id}`}>
                        {contact.title || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <Badge 
                      className={`px-3 py-1.5 text-sm font-medium border rounded-full ${getCategoryColor(contact.category)}`}
                      data-testid={`badge-category-${contact.id}`}
                    >
                      {contact.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {renderStars(contact.relationshipStrength || 1)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 ml-2" data-testid={`text-strength-${contact.id}`}>
                        {contact.relationshipStrength || 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-sm text-gray-600" data-testid={`text-last-contact-${contact.id}`}>
                    {getLastContactTime(contact)}
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log("View contact:", contact.firstName, contact.lastName);
                          onContactSelect?.(contact);
                        }}
                        className="h-10 w-10 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        data-testid={`button-view-${contact.id}`}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log("Edit contact:", contact.firstName, contact.lastName);
                          onContactSelect?.(contact);
                        }}
                        className="h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                        data-testid={`button-edit-${contact.id}`}
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log("Add interaction for:", contact.firstName, contact.lastName);
                          setSelectedContact(contact);
                          setShowInteractionModal(true);
                        }}
                        className="h-10 w-10 p-0 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                        data-testid={`button-add-interaction-${contact.id}`}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="text-base text-gray-600">
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredContacts.length}</span> of <span className="font-semibold">{filteredContacts.length}</span> contacts
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" disabled className="px-4 py-2 border border-gray-200 rounded-lg font-medium">
              Previous
            </Button>
            <Button size="sm" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
              1
            </Button>
            <Button variant="outline" size="sm" className="px-4 py-2 border border-gray-200 rounded-lg font-medium">
              Next
            </Button>
          </div>
        </div>
      </div>
      
      <AddInteractionModal 
        open={showInteractionModal}
        onOpenChange={setShowInteractionModal}
        contact={selectedContact}
      />
    </div>
  );
}
