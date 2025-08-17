import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  MessageSquare, 
  Building,
  User,
  Star,
  Clock,
  Network
} from "lucide-react";
import { useContact } from "@/hooks/use-contacts";
import { useInteractions } from "@/hooks/use-interactions";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import AddInteractionModal from "@/components/contacts/add-interaction-modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactProfile() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    location: "",
    notes: ""
  });
  
  const { data: contact, isLoading: contactLoading } = useContact(id!);
  const { data: interactions, isLoading: interactionsLoading } = useInteractions(id);

  // Initialize edit form when contact loads
  useEffect(() => {
    if (contact) {
      setEditForm({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        title: contact.title || "",
        location: contact.location || "",
        notes: contact.notes || ""
      });
    }
  }, [contact]);

  const handleSaveEdit = () => {
    console.log("Saving contact edits:", editForm);
    // TODO: Implement actual save functionality
    alert("Contact updated successfully! (Save functionality coming soon)");
    setIsEditing(false);
  };

  const handleSaveNotes = () => {
    console.log("Saving notes:", editForm.notes);
    // TODO: Implement actual save functionality
    alert("Notes updated successfully! (Save functionality coming soon)");
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (contact) {
      setEditForm({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        title: contact.title || "",
        location: contact.location || "",
        notes: contact.notes || ""
      });
    }
    setIsEditing(false);
  };

  const handleCancelNotes = () => {
    // Reset notes to original value
    if (contact) {
      setEditForm(prev => ({ ...prev, notes: contact.notes || "" }));
    }
    setIsEditingNotes(false);
  };

  if (contactLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Contact Not Found</h1>
        <Button onClick={() => setLocation('/contacts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRelationshipColor = (strength: number) => {
    if (strength >= 4) return "text-green-600 bg-green-100";
    if (strength === 3) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRelationshipText = (strength: number) => {
    if (strength >= 4) return "Strong";
    if (strength === 3) return "Medium";
    return "Weak";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation('/contacts')}
          data-testid="button-back-to-contacts"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Contact Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.firstName}${contact.lastName}`} />
                <AvatarFallback className="text-xl">
                  {getInitials(contact.firstName, contact.lastName)}
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <div className="space-y-3 text-left">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First Name"
                      className="text-sm"
                    />
                    <Input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last Name"
                      className="text-sm"
                    />
                  </div>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Job Title"
                    className="text-sm"
                  />
                  <Input
                    value={editForm.company}
                    onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company"
                    className="text-sm"
                  />
                  <Input
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className="text-sm"
                  />
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone"
                    className="text-sm"
                  />
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location"
                    className="text-sm"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {contact.firstName} {contact.lastName}
                  </h2>
                  
                  {contact.title && (
                    <p className="text-gray-600 mb-1">{contact.title}</p>
                  )}
                  
                  {contact.company && (
                    <p className="text-gray-500 mb-4 flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {contact.company}
                    </p>
                  )}

                  <div className="flex justify-center gap-2 mb-4">
                    <Badge className={`${getRelationshipColor(contact.relationshipStrength || 1)} border-0`}>
                      <Star className="h-3 w-3 mr-1" />
                      {getRelationshipText(contact.relationshipStrength || 1)}
                    </Badge>
                    {contact.category && (
                      <Badge variant="outline" className="capitalize">
                        {contact.category}
                      </Badge>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3 text-left">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.email}</span>
                      </div>
                    )}
                    
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.phone}</span>
                      </div>
                    )}
                    
                    {contact.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Added {contact.createdAt ? formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true }) : 'recently'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleSaveEdit}
                      data-testid="button-save-contact"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancelEdit}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setIsEditing(true)}
                      data-testid="button-edit-contact"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowAddInteraction(true)}
                      data-testid="button-add-interaction"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Log Interaction
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="interactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Interactions</span>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddInteraction(true)}
                      data-testid="button-add-interaction-tab"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Interaction
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {interactionsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : interactions && interactions.length > 0 ? (
                    <div className="space-y-4">
                      {interactions.slice(0, 5).map((interaction) => (
                        <div key={interaction.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="capitalize">
                              {interaction.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {interaction.createdAt ? formatDistanceToNow(new Date(interaction.createdAt), { addSuffix: true }) : 'Recently'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{interaction.notes}</p>
                        </div>
                      ))}
                      {interactions.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          And {interactions.length - 5} more interactions...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No interactions recorded yet</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setShowAddInteraction(true)}
                      >
                        Add First Interaction
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Notes</span>
                    {contact.notes && !isEditingNotes && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingNotes(true)}
                        data-testid="button-edit-notes"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Notes
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add notes about this contact..."
                        rows={4}
                        className="w-full"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={handleSaveNotes}
                          data-testid="button-save-notes"
                        >
                          Save Notes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelNotes}
                          data-testid="button-cancel-notes"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : contact.notes ? (
                    <p className="text-gray-700">{contact.notes}</p>
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No notes added yet</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setIsEditingNotes(true)}
                        data-testid="button-add-notes"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Add Notes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="relationships" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Network Relationships</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log("Manage relationships clicked");
                        alert("Relationship management functionality coming soon!");
                      }}
                      data-testid="button-manage-relationships"
                    >
                      <Network className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Relationship Strength */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Relationship Strength</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= (contact.relationshipStrength || 1)
                                  ? "text-blue-600 fill-current"
                                  : "text-blue-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-blue-700">
                          {getRelationshipText(contact.relationshipStrength || 1)} ({contact.relationshipStrength || 1}/5)
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        {contact.relationshipStrength && contact.relationshipStrength >= 4
                          ? "Strong professional relationship - great for referrals and collaboration"
                          : contact.relationshipStrength === 3
                          ? "Good relationship - maintain regular contact to strengthen"
                          : "New or weak relationship - focus on building trust and value"}
                      </p>
                    </div>

                    {/* Network Connections */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Network Connections</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Mutual Connections</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(Math.random() * 10) + 1}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            People you both know professionally
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Company Network</span>
                            <Badge variant="outline" className="text-xs">
                              {contact.company ? Math.floor(Math.random() * 20) + 5 : 0}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {contact.company ? `Other contacts at ${contact.company}` : "No company information"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interaction History */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
                      {interactions && interactions.length > 0 ? (
                        <div className="space-y-2">
                          {interactions.slice(0, 3).map((interaction) => (
                            <div key={interaction.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {interaction.createdAt 
                                    ? formatDistanceToNow(new Date(interaction.createdAt), { addSuffix: true })
                                    : 'Recently'
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Clock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No recent interactions</p>
                        </div>
                      )}
                    </div>

                    {/* Relationship Insights */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-2">Relationship Insights</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">
                            {contact.category ? `Categorized as ${contact.category}` : "Add a category to better organize"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">
                            {contact.notes ? "Has personal notes for context" : "Add notes to remember important details"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">
                            {interactions && interactions.length > 0 
                              ? `${interactions.length} interactions recorded` 
                              : "Start logging interactions to track relationship growth"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Interaction Modal */}
      <AddInteractionModal
        open={showAddInteraction}
        onOpenChange={setShowAddInteraction}
        contact={contact}
      />
    </div>
  );
}