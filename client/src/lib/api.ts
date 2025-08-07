import { apiRequest } from "./queryClient";
import type { 
  Contact, 
  InsertContact, 
  Interaction, 
  InsertInteraction,
  Relationship,
  InsertRelationship,
  Tag,
  ContactWithRelations,
  InteractionWithContact
} from "@shared/schema";

export const api = {
  contacts: {
    getAll: async (limit?: number): Promise<ContactWithRelations[]> => {
      const url = `/api/contacts${limit ? `?limit=${limit}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },

    search: async (query: string): Promise<ContactWithRelations[]> => {
      const response = await apiRequest('GET', `/api/contacts/search?q=${encodeURIComponent(query)}`);
      return response.json();
    },

    getById: async (id: string): Promise<ContactWithRelations> => {
      const response = await apiRequest('GET', `/api/contacts/${id}`);
      return response.json();
    },

    create: async (contact: InsertContact): Promise<Contact> => {
      const response = await apiRequest('POST', '/api/contacts', contact);
      return response.json();
    },

    update: async (id: string, contact: Partial<InsertContact>): Promise<Contact> => {
      const response = await apiRequest('PUT', `/api/contacts/${id}`, contact);
      return response.json();
    },

    delete: async (id: string): Promise<void> => {
      await apiRequest('DELETE', `/api/contacts/${id}`);
    },
  },

  interactions: {
    getAll: async (contactId?: string, limit?: number): Promise<InteractionWithContact[]> => {
      const params = new URLSearchParams();
      if (contactId) params.set('contactId', contactId);
      if (limit) params.set('limit', limit.toString());
      
      const url = `/api/interactions${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },

    create: async (interaction: InsertInteraction): Promise<Interaction> => {
      const response = await apiRequest('POST', '/api/interactions', interaction);
      return response.json();
    },

    update: async (id: string, interaction: Partial<InsertInteraction>): Promise<Interaction> => {
      const response = await apiRequest('PUT', `/api/interactions/${id}`, interaction);
      return response.json();
    },

    delete: async (id: string): Promise<void> => {
      await apiRequest('DELETE', `/api/interactions/${id}`);
    },
  },

  relationships: {
    getAll: async (): Promise<Relationship[]> => {
      const response = await apiRequest('GET', '/api/relationships');
      return response.json();
    },

    create: async (relationship: InsertRelationship): Promise<Relationship> => {
      const response = await apiRequest('POST', '/api/relationships', relationship);
      return response.json();
    },
  },

  analytics: {
    getStats: async (): Promise<{
      totalContacts: number;
      strongConnections: number;
      recentInteractions: number;
      dormantContacts: number;
    }> => {
      const response = await apiRequest('GET', '/api/analytics/stats');
      return response.json();
    },
  },

  network: {
    getGraphData: async (): Promise<{
      nodes: Array<{ id: string; name: string; category: string; strength: number; company?: string }>;
      links: Array<{ source: string; target: string; type: string; strength: number }>;
    }> => {
      const response = await apiRequest('GET', '/api/network/graph');
      return response.json();
    },
  },

  tags: {
    getAll: async (): Promise<Tag[]> => {
      const response = await apiRequest('GET', '/api/tags');
      return response.json();
    },
  },
};
