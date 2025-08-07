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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Contact Management</h2>
          <p className="text-neutral-600">Manage your professional network and relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" data-testid="button-export-contacts">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} data-testid="button-add-contact-page">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
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
