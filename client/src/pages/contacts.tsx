import { useState } from "react";
import ContactTable from "@/components/contacts/contact-table";
import AddContactModal from "@/components/contacts/add-contact-modal";
import { Button } from "@/components/ui/button";
import { Plus, Download, X, Mail, Phone, Building, MapPin, Star } from "lucide-react";
import type { ContactWithRelations } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Contacts() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null);

  const handleContactSelect = (contact: ContactWithRelations) => {
    console.log("Contact selected in contacts page:", contact.firstName, contact.lastName);
    setSelectedContact(contact);
  };

  const getStrengthColor = (strength: number) => {
    const colors = {
      1: "bg-red-100 text-red-700 border-red-200",
      2: "bg-orange-100 text-orange-700 border-orange-200",
      3: "bg-yellow-100 text-yellow-700 border-yellow-200",
      4: "bg-blue-100 text-blue-700 border-blue-200",
      5: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[strength as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
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

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-neutral-800 mb-2">Contact Management</h2>
          <p className="text-sm lg:text-base text-neutral-600">Manage your professional network and relationships</p>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-initial" 
            onClick={() => {
              console.log("Export button clicked");
              // TODO: Implement export functionality
            }}
            data-testid="button-export-contacts"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)} 
            size="sm" 
            className="flex-1 sm:flex-initial" 
            data-testid="button-add-contact-page"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Contact</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Contacts Table */}
      <ContactTable onContactSelect={handleContactSelect} />

      {/* Contact Detail Modal */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-6 pb-4 bg-white border-b border-gray-200">
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold text-lg">
                  {selectedContact ? `${selectedContact.firstName.charAt(0)}${selectedContact.lastName.charAt(0)}` : ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedContact?.firstName} {selectedContact?.lastName}
                </h3>
                <p className="text-gray-600">{selectedContact?.title}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="px-6 py-6 space-y-6 bg-white">
              {/* Company & Category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedContact.company && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{selectedContact.company}</span>
                    </div>
                  )}
                  <Badge className={`px-3 py-1 ${getStrengthColor(selectedContact.relationshipStrength || 1)}`}>
                    {selectedContact.category}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Strength:</span>
                  <div className="flex space-x-1">
                    {renderStars(selectedContact.relationshipStrength || 1)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-2">
                    {selectedContact.relationshipStrength || 1}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedContact.email && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedContact.email}</p>
                    </div>
                  </div>
                )}
                
                {selectedContact.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedContact.phone}</p>
                    </div>
                  </div>
                )}
                
                {selectedContact.location && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{selectedContact.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log("Edit contact:", selectedContact.firstName, selectedContact.lastName);
                    // TODO: Implement edit functionality
                  }}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Edit Contact
                </Button>
                <Button
                  onClick={() => {
                    console.log("Add interaction for:", selectedContact.firstName, selectedContact.lastName);
                    // TODO: Implement add interaction functionality
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Add Interaction
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <AddContactModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
}
