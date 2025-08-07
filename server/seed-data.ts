import { db } from "./db";
import { users, contacts, interactions, relationships, tags, contactTags } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with sample data...");

    // Create a user
    const [user] = await db.insert(users).values({
      username: "demo_user",
      password: "hashed_password",
      email: "demo@networktracker.com",
      firstName: "John",
      lastName: "Smith",
    }).returning();

    console.log("✓ User created");

    // Create sample contacts
    const sampleContacts = [
      {
        userId: user.id,
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah.chen@techcorp.com",
        phone: "+1-555-0101",
        company: "TechCorp Inc.",
        title: "Senior Product Manager",
        location: "San Francisco, CA",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        category: "work",
        relationshipStrength: 4,
        contactSource: "conference",
        notes: "Met at TechConf 2024. Very knowledgeable about product strategy.",
      },
      {
        userId: user.id,
        firstName: "Marcus",
        lastName: "Johnson",
        email: "marcus@startupxyz.com",
        phone: "+1-555-0102",
        company: "StartupXYZ",
        title: "Founder & CEO",
        location: "Austin, TX",
        linkedinUrl: "https://linkedin.com/in/marcusjohnson",
        category: "client",
        relationshipStrength: 5,
        contactSource: "referral",
        notes: "Potential client for our services. Very interested in our platform.",
      },
      {
        userId: user.id,
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@designstudio.com",
        phone: "+1-555-0103",
        company: "Design Studio Pro",
        title: "Creative Director",
        location: "New York, NY",
        linkedinUrl: "https://linkedin.com/in/emilyrodriguez",
        category: "prospect",
        relationshipStrength: 3,
        contactSource: "linkedin",
        notes: "Connected through LinkedIn. Interested in design consulting.",
      },
      {
        userId: user.id,
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@venture.vc",
        phone: "+1-555-0104",
        company: "Venture Capital Partners",
        title: "Investment Partner",
        location: "Palo Alto, CA",
        linkedinUrl: "https://linkedin.com/in/davidkim",
        category: "mentor",
        relationshipStrength: 4,
        contactSource: "work",
        notes: "Former colleague, now in VC. Great mentor for startup advice.",
      },
      {
        userId: user.id,
        firstName: "Lisa",
        lastName: "Park",
        email: "lisa.park@consulting.com",
        phone: "+1-555-0105",
        company: "Elite Consulting Group",
        title: "Senior Consultant",
        location: "Chicago, IL",
        linkedinUrl: "https://linkedin.com/in/lisapark",
        category: "friend",
        relationshipStrength: 4,
        contactSource: "social",
        notes: "Friend from college, now in consulting. Great connection for business insights.",
      },
      {
        userId: user.id,
        firstName: "Alex",
        lastName: "Thompson",
        email: "alex.thompson@freelancer.com",
        phone: "+1-555-0106",
        company: "Independent",
        title: "Full-Stack Developer",
        location: "Seattle, WA",
        linkedinUrl: "https://linkedin.com/in/alexthompson",
        category: "work",
        relationshipStrength: 3,
        contactSource: "other",
        notes: "Talented freelance developer. Could be good for contract work.",
      },
    ];

    const createdContacts = await db.insert(contacts).values(sampleContacts).returning();
    console.log("✓ Sample contacts created");

    // Create sample interactions
    const sampleInteractions = [
      {
        userId: user.id,
        contactId: createdContacts[0].id, // Sarah Chen
        type: "meeting",
        subject: "Product Strategy Discussion",
        notes: "Discussed upcoming product roadmap and potential collaboration opportunities.",
        outcome: "positive",
        followUpRequired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        userId: user.id,
        contactId: createdContacts[1].id, // Marcus Johnson
        type: "call",
        subject: "Service Proposal Call",
        notes: "Presented our services. Marcus is very interested and wants a detailed proposal.",
        outcome: "positive",
        followUpRequired: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        userId: user.id,
        contactId: createdContacts[2].id, // Emily Rodriguez
        type: "email",
        subject: "Design Consultation Inquiry",
        notes: "Emily reached out about design consulting for her upcoming project.",
        outcome: "neutral",
      },
      {
        userId: user.id,
        contactId: createdContacts[3].id, // David Kim
        type: "meeting",
        subject: "Coffee Chat - Startup Advice",
        notes: "Great conversation about the startup ecosystem and funding strategies.",
        outcome: "positive",
      },
      {
        userId: user.id,
        contactId: createdContacts[4].id, // Lisa Park
        type: "message",
        subject: "Quick Check-in",
        notes: "Casual check-in via LinkedIn. Lisa is doing well at her new role.",
        outcome: "positive",
      },
    ];

    await db.insert(interactions).values(sampleInteractions);
    console.log("✓ Sample interactions created");

    // Create sample relationships (connections between contacts)
    const sampleRelationships = [
      {
        userId: user.id,
        fromContactId: createdContacts[0].id, // Sarah Chen
        toContactId: createdContacts[3].id, // David Kim
        relationshipType: "colleague",
        strength: 3,
        notes: "Both work in tech, know each other from industry events",
      },
      {
        userId: user.id,
        fromContactId: createdContacts[1].id, // Marcus Johnson
        toContactId: createdContacts[3].id, // David Kim
        relationshipType: "introduced_by",
        strength: 2,
        notes: "David introduced me to Marcus at a networking event",
      },
    ];

    await db.insert(relationships).values(sampleRelationships);
    console.log("✓ Sample relationships created");

    // Create sample tags
    const sampleTags = [
      {
        userId: user.id,
        name: "Tech Industry",
        color: "#2563EB",
      },
      {
        userId: user.id,
        name: "Potential Client",
        color: "#10B981",
      },
      {
        userId: user.id,
        name: "High Priority",
        color: "#EF4444",
      },
    ];

    const createdTags = await db.insert(tags).values(sampleTags).returning();
    console.log("✓ Sample tags created");

    // Create tag associations
    const tagAssociations = [
      {
        contactId: createdContacts[0].id, // Sarah Chen
        tagId: createdTags[0].id, // Tech Industry
      },
      {
        contactId: createdContacts[1].id, // Marcus Johnson
        tagId: createdTags[1].id, // Potential Client
      },
      {
        contactId: createdContacts[1].id, // Marcus Johnson
        tagId: createdTags[2].id, // High Priority
      },
    ];

    await db.insert(contactTags).values(tagAssociations);
    console.log("✓ Tag associations created");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}