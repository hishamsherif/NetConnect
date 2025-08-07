import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertInteractionSchema, insertRelationshipSchema } from "@shared/schema";
import { z } from "zod";

const authenticateUser = async (req: any, res: any, next: any) => {
  // Simple user simulation - in production, implement proper JWT auth
  try {
    // Get the first user from database
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const [user] = await db.select().from(users).limit(1);
    req.userId = user?.id || "user-1"; // Fallback to mock user ID
  } catch (error) {
    req.userId = "user-1"; // Fallback on error
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply authentication middleware to all API routes
  app.use('/api', authenticateUser);

  // Contact routes
  app.get('/api/contacts', async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const contacts = await storage.getContacts(req.userId, limit);
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Failed to fetch contacts' });
    }
  });

  app.get('/api/contacts/search', async (req: any, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Query parameter required' });
      }
      const contacts = await storage.searchContacts(req.userId, query);
      res.json(contacts);
    } catch (error) {
      console.error('Error searching contacts:', error);
      res.status(500).json({ message: 'Failed to search contacts' });
    }
  });

  app.get('/api/contacts/:id', async (req: any, res) => {
    try {
      const contact = await storage.getContact(req.params.id, req.userId);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      console.error('Error fetching contact:', error);
      res.status(500).json({ message: 'Failed to fetch contact' });
    }
  });

  app.post('/api/contacts', async (req: any, res) => {
    try {
      const validatedData = insertContactSchema.parse({
        ...req.body,
        userId: req.userId,
      });
      
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating contact:', error);
      res.status(500).json({ message: 'Failed to create contact' });
    }
  });

  app.put('/api/contacts/:id', async (req: any, res) => {
    try {
      const validatedData = insertContactSchema.partial().parse(req.body);
      const contact = await storage.updateContact(req.params.id, validatedData, req.userId);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error updating contact:', error);
      res.status(500).json({ message: 'Failed to update contact' });
    }
  });

  app.delete('/api/contacts/:id', async (req: any, res) => {
    try {
      const success = await storage.deleteContact(req.params.id, req.userId);
      if (!success) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ message: 'Failed to delete contact' });
    }
  });

  // Interaction routes
  app.get('/api/interactions', async (req: any, res) => {
    try {
      const contactId = req.query.contactId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const interactions = await storage.getInteractions(req.userId, contactId, limit);
      res.json(interactions);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      res.status(500).json({ message: 'Failed to fetch interactions' });
    }
  });

  app.post('/api/interactions', async (req: any, res) => {
    try {
      const validatedData = insertInteractionSchema.parse({
        ...req.body,
        userId: req.userId,
      });
      
      const interaction = await storage.createInteraction(validatedData);
      res.status(201).json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating interaction:', error);
      res.status(500).json({ message: 'Failed to create interaction' });
    }
  });

  app.put('/api/interactions/:id', async (req: any, res) => {
    try {
      const validatedData = insertInteractionSchema.partial().parse(req.body);
      const interaction = await storage.updateInteraction(req.params.id, validatedData, req.userId);
      if (!interaction) {
        return res.status(404).json({ message: 'Interaction not found' });
      }
      res.json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error updating interaction:', error);
      res.status(500).json({ message: 'Failed to update interaction' });
    }
  });

  app.delete('/api/interactions/:id', async (req: any, res) => {
    try {
      const success = await storage.deleteInteraction(req.params.id, req.userId);
      if (!success) {
        return res.status(404).json({ message: 'Interaction not found' });
      }
      res.json({ message: 'Interaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting interaction:', error);
      res.status(500).json({ message: 'Failed to delete interaction' });
    }
  });

  // Relationship routes
  app.get('/api/relationships', async (req: any, res) => {
    try {
      const relationships = await storage.getRelationships(req.userId);
      res.json(relationships);
    } catch (error) {
      console.error('Error fetching relationships:', error);
      res.status(500).json({ message: 'Failed to fetch relationships' });
    }
  });

  app.post('/api/relationships', async (req: any, res) => {
    try {
      const validatedData = insertRelationshipSchema.parse({
        ...req.body,
        userId: req.userId,
      });
      
      const relationship = await storage.createRelationship(validatedData);
      res.status(201).json(relationship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating relationship:', error);
      res.status(500).json({ message: 'Failed to create relationship' });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', async (req: any, res) => {
    try {
      const stats = await storage.getNetworkStats(req.userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching network stats:', error);
      res.status(500).json({ message: 'Failed to fetch network stats' });
    }
  });

  app.get('/api/network/graph', async (req: any, res) => {
    try {
      const graphData = await storage.getNetworkGraphData(req.userId);
      res.json(graphData);
    } catch (error) {
      console.error('Error fetching network graph data:', error);
      res.status(500).json({ message: 'Failed to fetch network graph data' });
    }
  });

  // Tag routes
  app.get('/api/tags', async (req: any, res) => {
    try {
      const tags = await storage.getTags(req.userId);
      res.json(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ message: 'Failed to fetch tags' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
