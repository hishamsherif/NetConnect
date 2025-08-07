import {
  users,
  contacts,
  interactions,
  relationships,
  tags,
  contactTags,
  type User,
  type InsertUser,
  type Contact,
  type InsertContact,
  type Interaction,
  type InsertInteraction,
  type Relationship,
  type InsertRelationship,
  type Tag,
  type InsertTag,
  type ContactWithRelations,
  type InteractionWithContact,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Contact operations
  getContacts(userId: string, limit?: number): Promise<ContactWithRelations[]>;
  getContact(id: string, userId: string): Promise<ContactWithRelations | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>, userId: string): Promise<Contact | undefined>;
  deleteContact(id: string, userId: string): Promise<boolean>;
  searchContacts(userId: string, query: string): Promise<ContactWithRelations[]>;

  // Interaction operations
  getInteractions(userId: string, contactId?: string, limit?: number): Promise<InteractionWithContact[]>;
  createInteraction(interaction: InsertInteraction): Promise<Interaction>;
  updateInteraction(id: string, interaction: Partial<InsertInteraction>, userId: string): Promise<Interaction | undefined>;
  deleteInteraction(id: string, userId: string): Promise<boolean>;

  // Relationship operations
  getRelationships(userId: string): Promise<Relationship[]>;
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  deleteRelationship(id: string, userId: string): Promise<boolean>;

  // Tag operations
  getTags(userId: string): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: string, userId: string): Promise<boolean>;

  // Analytics
  getNetworkStats(userId: string): Promise<{
    totalContacts: number;
    strongConnections: number;
    recentInteractions: number;
    dormantContacts: number;
  }>;

  getNetworkGraphData(userId: string): Promise<{
    nodes: Array<{ id: string; name: string; category: string; strength: number; company?: string }>;
    links: Array<{ source: string; target: string; type: string; strength: number }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact operations
  async getContacts(userId: string, limit = 50): Promise<ContactWithRelations[]> {
    const result = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, userId))
      .orderBy(desc(contacts.updatedAt))
      .limit(limit);

    return result;
  }

  async getContact(id: string, userId: string): Promise<ContactWithRelations | undefined> {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)));

    if (!contact) return undefined;

    // Get interactions for this contact
    const contactInteractions = await db
      .select()
      .from(interactions)
      .where(eq(interactions.contactId, id))
      .orderBy(desc(interactions.createdAt));

    return {
      ...contact,
      interactions: contactInteractions,
    };
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values({
      ...contact,
      updatedAt: new Date(),
    }).returning();
    return newContact;
  }

  async updateContact(id: string, contact: Partial<InsertContact>, userId: string): Promise<Contact | undefined> {
    const [updated] = await db
      .update(contacts)
      .set({
        ...contact,
        updatedAt: new Date(),
      })
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
      .returning();
    return updated;
  }

  async deleteContact(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)));
    return result.rowCount > 0;
  }

  async searchContacts(userId: string, query: string): Promise<ContactWithRelations[]> {
    const result = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.userId, userId),
          sql`(
            ${contacts.firstName} ILIKE ${`%${query}%`} OR 
            ${contacts.lastName} ILIKE ${`%${query}%`} OR 
            ${contacts.email} ILIKE ${`%${query}%`} OR 
            ${contacts.company} ILIKE ${`%${query}%`} OR 
            ${contacts.title} ILIKE ${`%${query}%`}
          )`
        )
      )
      .orderBy(desc(contacts.updatedAt));

    return result;
  }

  // Interaction operations
  async getInteractions(userId: string, contactId?: string, limit = 50): Promise<InteractionWithContact[]> {
    let query = db
      .select({
        id: interactions.id,
        userId: interactions.userId,
        contactId: interactions.contactId,
        type: interactions.type,
        subject: interactions.subject,
        notes: interactions.notes,
        outcome: interactions.outcome,
        followUpRequired: interactions.followUpRequired,
        createdAt: interactions.createdAt,
        contact: contacts,
      })
      .from(interactions)
      .innerJoin(contacts, eq(interactions.contactId, contacts.id))
      .where(eq(interactions.userId, userId));

    if (contactId) {
      query = query.where(eq(interactions.contactId, contactId));
    }

    const result = await query
      .orderBy(desc(interactions.createdAt))
      .limit(limit);

    return result;
  }

  async createInteraction(interaction: InsertInteraction): Promise<Interaction> {
    const [newInteraction] = await db.insert(interactions).values(interaction).returning();
    
    // Update contact's updatedAt timestamp
    await db
      .update(contacts)
      .set({ updatedAt: new Date() })
      .where(eq(contacts.id, interaction.contactId));
    
    return newInteraction;
  }

  async updateInteraction(id: string, interaction: Partial<InsertInteraction>, userId: string): Promise<Interaction | undefined> {
    const [updated] = await db
      .update(interactions)
      .set(interaction)
      .where(and(eq(interactions.id, id), eq(interactions.userId, userId)))
      .returning();
    return updated;
  }

  async deleteInteraction(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(interactions)
      .where(and(eq(interactions.id, id), eq(interactions.userId, userId)));
    return result.rowCount > 0;
  }

  // Relationship operations
  async getRelationships(userId: string): Promise<Relationship[]> {
    return await db
      .select()
      .from(relationships)
      .where(eq(relationships.userId, userId));
  }

  async createRelationship(relationship: InsertRelationship): Promise<Relationship> {
    const [newRelationship] = await db.insert(relationships).values(relationship).returning();
    return newRelationship;
  }

  async deleteRelationship(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(relationships)
      .where(and(eq(relationships.id, id), eq(relationships.userId, userId)));
    return result.rowCount > 0;
  }

  // Tag operations
  async getTags(userId: string): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .where(eq(tags.userId, userId));
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  async deleteTag(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tags)
      .where(and(eq(tags.id, id), eq(tags.userId, userId)));
    return result.rowCount > 0;
  }

  // Analytics
  async getNetworkStats(userId: string): Promise<{
    totalContacts: number;
    strongConnections: number;
    recentInteractions: number;
    dormantContacts: number;
  }> {
    // Total contacts
    const [totalContactsResult] = await db
      .select({ count: count() })
      .from(contacts)
      .where(eq(contacts.userId, userId));

    // Strong connections (strength 4-5)
    const [strongConnectionsResult] = await db
      .select({ count: count() })
      .from(contacts)
      .where(
        and(
          eq(contacts.userId, userId),
          sql`${contacts.relationshipStrength} >= 4`
        )
      );

    // Recent interactions (last 7 days)
    const [recentInteractionsResult] = await db
      .select({ count: count() })
      .from(interactions)
      .where(
        and(
          eq(interactions.userId, userId),
          sql`${interactions.createdAt} >= NOW() - INTERVAL '7 days'`
        )
      );

    // Dormant contacts (no interactions in 30 days)
    const contactsWithRecentInteractions = await db
      .select({ contactId: interactions.contactId })
      .from(interactions)
      .where(
        and(
          eq(interactions.userId, userId),
          sql`${interactions.createdAt} >= NOW() - INTERVAL '30 days'`
        )
      );

    const recentContactIds = contactsWithRecentInteractions.map(r => r.contactId);
    
    let dormantCount = 0;
    if (recentContactIds.length === 0) {
      dormantCount = totalContactsResult.count;
    } else {
      const [dormantContactsResult] = await db
        .select({ count: count() })
        .from(contacts)
        .where(
          and(
            eq(contacts.userId, userId),
            sql`${contacts.id} NOT IN (${recentContactIds.join(',')})`
          )
        );
      dormantCount = dormantContactsResult.count;
    }

    return {
      totalContacts: totalContactsResult.count,
      strongConnections: strongConnectionsResult.count,
      recentInteractions: recentInteractionsResult.count,
      dormantContacts: dormantCount,
    };
  }

  async getNetworkGraphData(userId: string): Promise<{
    nodes: Array<{ id: string; name: string; category: string; strength: number; company?: string }>;
    links: Array<{ source: string; target: string; type: string; strength: number }>;
  }> {
    // Get all contacts as nodes
    const contactNodes = await db
      .select({
        id: contacts.id,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        category: contacts.category,
        strength: contacts.relationshipStrength,
        company: contacts.company,
      })
      .from(contacts)
      .where(eq(contacts.userId, userId));

    const nodes = contactNodes.map(contact => ({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      category: contact.category || 'other',
      strength: contact.strength || 1,
      company: contact.company || undefined,
    }));

    // Get relationships as links
    const relationshipLinks = await db
      .select()
      .from(relationships)
      .where(eq(relationships.userId, userId));

    const links = relationshipLinks.map(rel => ({
      source: rel.fromContactId,
      target: rel.toContactId,
      type: rel.relationshipType || 'connected',
      strength: rel.strength || 1,
    }));

    return { nodes, links };
  }
}

export const storage = new DatabaseStorage();
