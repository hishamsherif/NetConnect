import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { InsertInteraction } from "@shared/schema";

export function useInteractions(contactId?: string, limit?: number) {
  return useQuery({
    queryKey: ['/api/interactions', contactId, limit],
    queryFn: () => api.interactions.getAll(contactId, limit),
  });
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (interaction: InsertInteraction) => api.interactions.create(interaction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/interactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts', variables.contactId] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      toast({
        title: "Success",
        description: "Interaction logged successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateInteraction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, interaction }: { id: string; interaction: Partial<InsertInteraction> }) =>
      api.interactions.update(id, interaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/interactions'] });
      toast({
        title: "Success",
        description: "Interaction updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteInteraction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.interactions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/interactions'] });
      toast({
        title: "Success",
        description: "Interaction deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['/api/analytics/stats'],
    queryFn: () => api.analytics.getStats(),
  });
}

export function useNetworkGraphData() {
  return useQuery({
    queryKey: ['/api/network/graph'],
    queryFn: () => api.network.getGraphData(),
  });
}
