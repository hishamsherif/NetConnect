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
import { Eye, Edit, Plus, Star, Search, Filter } from "lucide-react";
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
      case "work": return "bg-black text-white border-black";
      case "client": return "bg-black text-white border-black";
      case "prospect": return "bg-black text-white border-black";
      case "family": return "bg-black text-white border-black";
      case "friend": return "bg-black text-white border-black";
      case "mentor": return "bg-black text-white border-black";
      default: return "bg-black text-white border-black";
    }
  };

  const renderStars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < strength ? "text-black fill-current" : "text-gray-300"
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
      <div className="bg-white border-2 border-black p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold text-lg">LOADING CONTACTS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white border-2 border-black p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-wider">CONTACT MANAGEMENT</h3>
            <p className="text-lg font-bold text-black">
              {filteredContacts.length} of {contacts?.length || 0} contacts
            </p>
          </div>
          
          {selectedContacts.length > 0 && (
            <Badge variant="secondary" className="px-4 py-2 text-lg font-bold bg-black text-white border-2 border-black rounded-none">
              {selectedContacts.length} SELECTED
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-black" />
              <Input
                placeholder="SEARCH BY NAME, COMPANY, OR TITLE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 border-2 border-black focus:border-black focus:ring-0 text-lg font-bold rounded-none"
                data-testid="input-search-table"
              />
            </div>
          </div>
          
          {/* Filters */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-2 border-black focus:border-black focus:ring-0 rounded-none py-4 text-lg font-bold">
              <SelectValue placeholder="ALL CATEGORIES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL CATEGORIES</SelectItem>
              <SelectItem value="work">WORK</SelectItem>
              <SelectItem value="client">CLIENTS</SelectItem>
              <SelectItem value="prospect">PROSPECTS</SelectItem>
              <SelectItem value="family">FAMILY</SelectItem>
              <SelectItem value="friend">FRIENDS</SelectItem>
              <SelectItem value="mentor">MENTORS</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={strengthFilter} onValueChange={setStrengthFilter}>
            <SelectTrigger className="border-2 border-black focus:border-black focus:ring-0 rounded-none py-4 text-lg font-bold">
              <SelectValue placeholder="ALL STRENGTHS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL STRENGTHS</SelectItem>
              <SelectItem value="strong">STRONG (4-5)</SelectItem>
              <SelectItem value="medium">MEDIUM (3)</SelectItem>
              <SelectItem value="weak">WEAK (1-2)</SelectItem>
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
            <div className="text-center py-12 bg-white border-2 border-black">
              <p className="text-2xl font-black text-black uppercase">NO CONTACTS FOUND</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border-2 border-black overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-black hover:bg-black">
                <TableHead className="w-16 p-6">
                  <Checkbox
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                    className="border-2 border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                </TableHead>
                <TableHead className="p-6 font-black text-white text-lg uppercase tracking-wider">CONTACT</TableHead>
                <TableHead className="p-6 font-black text-white text-lg uppercase tracking-wider">COMPANY</TableHead>
                <TableHead className="p-6 font-black text-white text-lg uppercase tracking-wider">CATEGORY</TableHead>
                <TableHead className="p-6 font-black text-white text-lg uppercase tracking-wider">STRENGTH</TableHead>
                <TableHead className="p-6 font-black text-white text-lg uppercase tracking-wider">LAST CONTACT</TableHead>
                <TableHead className="p-6 font-black text-white text-lg uppercase tracking-wider">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-100 border-b-2 border-black">
                  <TableCell className="p-6">
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      data-testid={`checkbox-contact-${contact.id}`}
                      className="border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                    />
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-black rounded-none">
                        <AvatarFallback className="bg-black text-white font-black text-lg border-2 border-black rounded-none">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-black text-black text-lg" data-testid={`text-contact-name-${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-base text-black font-bold" data-testid={`text-contact-email-${contact.id}`}>
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <div>
                      <div className="font-black text-black text-lg" data-testid={`text-contact-company-${contact.id}`}>
                        {contact.company || "—"}
                      </div>
                      <div className="text-base text-black font-bold" data-testid={`text-contact-title-${contact.id}`}>
                        {contact.title || "—"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-6">
                    <Badge 
                      className={`px-4 py-2 text-base font-black border-2 rounded-none ${getCategoryColor(contact.category)}`}
                      data-testid={`badge-category-${contact.id}`}
                    >
                      {contact.category.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {renderStars(contact.relationshipStrength || 1)}
                      </div>
                      <span className="text-lg font-black text-black ml-2" data-testid={`text-strength-${contact.id}`}>
                        {contact.relationshipStrength || 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-lg font-bold text-black" data-testid={`text-last-contact-${contact.id}`}>
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
                        className="h-10 w-10 p-0 hover:bg-black hover:text-white border-2 border-black rounded-none"
                        data-testid={`button-view-${contact.id}`}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log("Edit contact:", contact.firstName, contact.lastName);
                        }}
                        className="h-10 w-10 p-0 hover:bg-black hover:text-white border-2 border-black rounded-none"
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
                        className="h-10 w-10 p-0 hover:bg-black hover:text-white border-2 border-black rounded-none"
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
        <div className="flex items-center justify-between px-6 py-6 border-t-2 border-black bg-gray-100">
          <div className="text-lg font-bold text-black">
            SHOWING <span className="font-black">1</span> TO <span className="font-black">{filteredContacts.length}</span> OF <span className="font-black">{filteredContacts.length}</span> CONTACTS
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" disabled className="px-6 py-3 border-2 border-black rounded-none font-bold text-lg">
              PREVIOUS
            </Button>
            <Button size="sm" className="bg-black text-white px-6 py-3 border-2 border-black rounded-none font-bold text-lg">
              1
            </Button>
            <Button variant="outline" size="sm" className="px-6 py-3 border-2 border-black rounded-none font-bold text-lg">
              NEXT
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
