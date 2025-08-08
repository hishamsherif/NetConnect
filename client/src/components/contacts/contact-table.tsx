import { useState } from "react";
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
import { Eye, Edit, Plus, Star, Search, Filter, Download } from "lucide-react";
import { useContacts } from "@/hooks/use-contacts";
import MobileContactCard from "./mobile-contact-card";
import type { ContactWithRelations } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import AddInteractionModal from "./add-interaction-modal";

interface ContactTableProps {
  onContactSelect?: (contact: ContactWithRelations) => void;
}

export default function ContactTable({ onContactSelect }: ContactTableProps) {
  const { data: contacts, isLoading } = useContacts();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [strengthFilter, setStrengthFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = !searchQuery || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter;
    
    const matchesStrength = strengthFilter === "all" || 
      (strengthFilter === "strong" && (contact.relationshipStrength || 0) >= 4) ||
      (strengthFilter === "medium" && (contact.relationshipStrength || 0) === 3) ||
      (strengthFilter === "weak" && (contact.relationshipStrength || 0) <= 2);

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
    switch (category) {
      case "work": return "bg-blue-100 text-blue-800";
      case "client": return "bg-green-100 text-green-800";
      case "prospect": return "bg-purple-100 text-purple-800";
      case "family": return "bg-pink-100 text-pink-800";
      case "friend": return "bg-yellow-100 text-yellow-800";
      case "mentor": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < strength ? "text-yellow-400 fill-current" : "text-neutral-300"
        }`}
      />
    ));
  };

  const getLastContactTime = (contact: ContactWithRelations) => {
    if (!contact.interactions || contact.interactions.length === 0) {
      return "Never";
    }
    const lastInteraction = contact.interactions[0]; // Assuming sorted by date
    return formatDistanceToNow(new Date(lastInteraction.createdAt || new Date()), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by name, company, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-table"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-category">
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
            <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-strength">
              <SelectValue placeholder="All Strengths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Strengths</SelectItem>
              <SelectItem value="strong">Strong (4-5)</SelectItem>
              <SelectItem value="medium">Medium (3)</SelectItem>
              <SelectItem value="weak">Weak (1-2)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" data-testid="button-more-filters">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <MobileContactCard
              key={contact.id}
              contact={contact}
              onEdit={(contact) => onContactSelect?.(contact)}
              onDelete={(contact) => console.log('Delete', contact.id)}
              onInteract={(contact) => console.log('Interact', contact.id)}
            />
          ))}
          {filteredContacts.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <p>No contacts found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedContacts.length === filteredContacts.length}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      data-testid={`checkbox-contact-${contact.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-neutral-800" data-testid={`text-contact-name-${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-neutral-600" data-testid={`text-contact-email-${contact.id}`}>
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-800" data-testid={`text-contact-company-${contact.id}`}>
                        {contact.company || "—"}
                      </div>
                      <div className="text-sm text-neutral-600" data-testid={`text-contact-title-${contact.id}`}>
                        {contact.title || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={getCategoryColor(contact.category)}
                      data-testid={`badge-category-${contact.id}`}
                    >
                      {contact.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        {renderStars(contact.relationshipStrength || 1)}
                      </div>
                      <span className="text-sm text-neutral-600 ml-2" data-testid={`text-strength-${contact.id}`}>
                        {contact.relationshipStrength || 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600" data-testid={`text-last-contact-${contact.id}`}>
                    {getLastContactTime(contact)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContactSelect?.(contact)}
                        data-testid={`button-view-${contact.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-edit-${contact.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowInteractionModal(true);
                        }}
                        data-testid={`button-add-interaction-${contact.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
          <div className="text-sm text-neutral-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{filteredContacts.length}</span> contacts
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled data-testid="button-previous">
              Previous
            </Button>
            <Button size="sm" className="bg-primary text-white" data-testid="button-page-1">
              1
            </Button>
            <Button variant="outline" size="sm" data-testid="button-next">
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
