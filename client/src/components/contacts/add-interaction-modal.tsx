import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInteractionSchema } from "@shared/schema";
import { useCreateInteraction } from "@/hooks/use-interactions";
import { z } from "zod";
import type { ContactWithRelations } from "@shared/schema";

const formSchema = insertInteractionSchema.omit({ userId: true });

type FormData = z.infer<typeof formSchema>;

interface AddInteractionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ContactWithRelations | null;
}

export default function AddInteractionModal({ open, onOpenChange, contact }: AddInteractionModalProps) {
  const createInteraction = useCreateInteraction();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactId: contact?.id || "",
      type: "",
      subject: "",
      notes: "",
      outcome: "",
      followUpRequired: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    if (!contact) return;
    
    createInteraction.mutate({
      ...data,
      contactId: contact.id,
      userId: "user-1", // Use default user ID
    }, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Interaction</DialogTitle>
          <DialogDescription>
            Record a new interaction with {contact.firstName} {contact.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interaction Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-interaction-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="message">Message</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outcome</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-outcome">
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject/Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="What was discussed?" {...field} value={field.value || ""} data-testid="input-subject" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about the interaction..."
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-interaction-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="followUpRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-up Date (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field} 
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""} 
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      data-testid="input-followup-date" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log("Cancel interaction button clicked");
                  onOpenChange(false);
                }}
                data-testid="button-cancel-interaction"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createInteraction.isPending}
                onClick={(e) => {
                  console.log("Submit interaction button clicked");
                  // Don't prevent default, let form handle submission
                }}
                data-testid="button-submit-interaction"
              >
                {createInteraction.isPending ? "Logging..." : "Log Interaction"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}