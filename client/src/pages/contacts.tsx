import { useState } from "react";
import ContactTable from "@/components/contacts/contact-table";
import AddContactModal from "@/components/contacts/add-contact-modal";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import type { ContactWithRelations } from "@shared/schema";

export default function Contacts() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactWithRelations | null>(null);

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
      <ContactTable onContactSelect={setSelectedContact} />

      {/* Modals */}
      <AddContactModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
}
