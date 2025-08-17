import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, Mail, Phone, MapPin, Star, MessageSquare, Edit, Trash2 } from "lucide-react";
import type { ContactWithRelations } from "@shared/schema";
import { useState } from "react";
import AddInteractionModal from "./add-interaction-modal";

interface MobileContactCardProps {
  contact: ContactWithRelations;
  onEdit?: (contact: ContactWithRelations) => void;
  onDelete?: (contact: ContactWithRelations) => void;
  onInteract?: (contact: ContactWithRelations) => void;
  onView?: (contact: ContactWithRelations) => void;
}

export default function MobileContactCard({ contact, onEdit, onDelete, onInteract, onView }: MobileContactCardProps) {
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const initials = `${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`;
  const strengthColors = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800', 
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-blue-100 text-blue-800',
    5: 'bg-green-100 text-green-800'
  };

  const strengthLabels = {
    1: 'Very Weak',
    2: 'Weak', 
    3: 'Medium',
    4: 'Strong',
    5: 'Very Strong'
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow touch-manipulation cursor-pointer" 
      data-testid={`mobile-contact-card-${contact.id}`}
      onClick={() => {
        console.log("Mobile contact card clicked:", contact.firstName, contact.lastName);
        onView?.(contact);
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Contact Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-gray-900 truncate" data-testid={`text-contact-name-${contact.id}`}>
                  {contact.firstName} {contact.lastName}
                </h3>
                {contact.title && (
                  <p className="text-sm text-gray-600 truncate">{contact.title}</p>
                )}
              </div>
              
              {/* Relationship Strength */}
              <Badge 
                className={`text-xs px-2 py-1 ml-2 flex-shrink-0 ${strengthColors[contact.relationshipStrength as keyof typeof strengthColors] || 'bg-gray-100 text-gray-800'}`}
                data-testid={`badge-strength-${contact.id}`}
              >
                <Star className="w-3 h-3 mr-1" />
                {contact.relationshipStrength}
              </Badge>
            </div>

            {/* Company & Category */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              {contact.company && (
                <div className="flex items-center mr-3">
                  <Building className="w-3 h-3 mr-1" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
              {contact.category && (
                <Badge variant="secondary" className="text-xs">
                  {contact.category}
                </Badge>
              )}
            </div>

            {/* Contact Methods */}
            <div className="space-y-1 mb-3">
              {contact.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.location}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log("Logging interaction for:", contact.firstName, contact.lastName);
                    setShowInteractionModal(true);
                  }}
                  className="h-8 px-3 text-xs"
                  data-testid={`button-interact-${contact.id}`}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Log Interaction
                </Button>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    console.log("Editing contact:", contact.firstName, contact.lastName);
                    onEdit?.(contact);
                  }}
                  className="h-8 w-8 p-0"
                  data-testid={`button-edit-${contact.id}`}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    console.log("Deleting contact:", contact.firstName, contact.lastName);
                    onDelete?.(contact);
                  }}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  data-testid={`button-delete-${contact.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <AddInteractionModal 
        open={showInteractionModal}
        onOpenChange={setShowInteractionModal}
        contact={contact}
      />
    </Card>
  );
}