import { db } from "./db";
import { users, contacts, interactions, relationships, tags, contactTags } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with 127 sample contacts...");

    // Create a user
    const [user] = await db.insert(users).values({
      username: "demo_user",
      password: "hashed_password",
      email: "demo@networktracker.com",
      firstName: "John",
      lastName: "Smith",
    }).returning();

    console.log("✓ User created");

    // Generate 127 diverse contacts
    const firstNames = ["Sarah", "Marcus", "Emily", "David", "Lisa", "Alex", "Maria", "James", "Jennifer", "Michael", "Ashley", "Christopher", "Amanda", "Daniel", "Jessica", "Matthew", "Sarah", "Andrew", "Melissa", "Joshua", "Michelle", "Ryan", "Kimberly", "Nicholas", "Amy", "William", "Angela", "Justin", "Helen", "David", "Brenda", "Kenneth", "Emma", "Steven", "Olivia", "Edward", "Cynthia", "Brian", "Marie", "Ronald", "Janet", "Anthony", "Catherine", "Kevin", "Frances", "Jason", "Christine", "Jeffrey", "Dorothy", "Jacob", "Lisa", "Gary", "Nancy", "Jonathan", "Virginia", "Tyler", "Donna", "Aaron", "Ruth", "Jose", "Sharon", "Henry", "Michelle", "Douglas", "Laura", "Peter", "Sarah", "Noah", "Kimberly", "Carl", "Deborah", "Arthur", "Dorothy", "Lawrence", "Lisa", "Jordan", "Nancy", "Jesse", "Karen", "Bryan", "Betty", "Albert", "Helen", "Wayne", "Sandra", "Ralph", "Donna", "Roy", "Carol", "Eugene", "Ruth", "Louis", "Sharon", "Philip", "Michelle", "Bobby", "Laura", "Johnny", "Sarah", "Mason", "Kimberly"];
    
    const lastNames = ["Chen", "Johnson", "Rodriguez", "Kim", "Park", "Thompson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Garcia", "Martinez", "Robinson", "Clark", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"];
    
    const companies = ["TechCorp Inc.", "StartupXYZ", "Design Studio Pro", "Venture Capital Partners", "Elite Consulting Group", "Independent", "Microsoft", "Google", "Apple", "Amazon", "Meta", "Tesla", "Netflix", "Salesforce", "Oracle", "Adobe", "IBM", "Intel", "Cisco", "VMware", "Uber", "Airbnb", "Spotify", "Zoom", "Slack", "Dropbox", "Square", "PayPal", "eBay", "Twitter", "LinkedIn", "Pinterest", "Snapchat", "TikTok", "Reddit", "Discord", "Twitch", "YouTube", "Instagram", "WhatsApp", "Telegram", "Signal", "Shopify", "Etsy", "Wayfair", "Peloton", "DoorDash", "Grubhub", "Postmates", "Instacart", "Lyft", "Bird", "Lime", "Scooter", "Zipcar", "Turo", "Getaround", "SpaceX", "Blue Origin", "Virgin Galactic", "Rocket Lab", "Planet Labs", "Palantir", "Snowflake", "Databricks", "Stripe", "Plaid", "Robinhood", "Coinbase", "Kraken", "Binance", "FTX", "OpenAI", "Anthropic", "Cohere", "Hugging Face", "Scale AI", "Weights & Biases", "Wandb", "MLflow", "Kubeflow", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "Bokeh", "D3.js", "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Vercel", "Netlify", "AWS", "Azure", "GCP", "DigitalOcean", "Linode", "Vultr", "Heroku", "Railway", "Render", "Fly.io", "Supabase", "Firebase", "PlanetScale", "Neon", "Turso", "Xata"];
    
    const titles = ["Senior Product Manager", "Founder & CEO", "Creative Director", "Investment Partner", "Senior Consultant", "Full-Stack Developer", "Software Engineer", "Data Scientist", "UX Designer", "Marketing Manager", "Sales Director", "Operations Manager", "CTO", "VP Engineering", "Principal Engineer", "Staff Engineer", "Senior Engineer", "Junior Developer", "Product Designer", "UI/UX Designer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Site Reliability Engineer", "Data Engineer", "Machine Learning Engineer", "AI Research Scientist", "Product Owner", "Scrum Master", "Technical Lead", "Engineering Manager", "Director of Engineering", "Head of Product", "Chief Product Officer", "VP Product", "Senior Product Manager", "Product Manager", "Associate Product Manager", "Growth Manager", "Performance Marketing Manager", "Content Marketing Manager", "Social Media Manager", "Brand Manager", "PR Manager", "Communications Director", "Customer Success Manager", "Account Manager", "Sales Engineer", "Business Development Manager", "Partnership Manager", "Strategy Manager", "Operations Analyst", "Financial Analyst", "Data Analyst", "Business Analyst", "Systems Analyst", "Security Engineer", "Cloud Engineer", "Infrastructure Engineer", "Quality Assurance Engineer", "Test Engineer", "Mobile Developer", "iOS Developer", "Android Developer", "Game Developer", "Blockchain Developer", "Smart Contract Developer", "Technical Writer", "Developer Relations", "Community Manager", "Talent Acquisition", "HR Manager", "Recruiter", "Office Manager", "Executive Assistant", "Chief Executive Officer", "Chief Technology Officer", "Chief Operating Officer", "Chief Financial Officer", "Chief Marketing Officer", "Chief Revenue Officer", "Chief People Officer", "Chief Security Officer"];
    
    const locations = ["San Francisco, CA", "Austin, TX", "New York, NY", "Palo Alto, CA", "Chicago, IL", "Seattle, WA", "Los Angeles, CA", "Boston, MA", "Denver, CO", "Portland, OR", "Miami, FL", "Atlanta, GA", "Dallas, TX", "Houston, TX", "Phoenix, AZ", "Las Vegas, NV", "San Diego, CA", "Nashville, TN", "Raleigh, NC", "Salt Lake City, UT", "Minneapolis, MN", "Kansas City, MO", "Columbus, OH", "Indianapolis, IN", "Charlotte, NC", "Detroit, MI", "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI", "Albuquerque, NM", "Fresno, CA", "Sacramento, CA", "Long Beach, CA", "Mesa, AZ", "Virginia Beach, VA", "Atlanta, GA", "Colorado Springs, CO", "Omaha, NE", "Raleigh, NC", "Miami, FL", "Oakland, CA", "Minneapolis, MN", "Tulsa, OK", "Cleveland, OH", "Wichita, KS", "Arlington, TX", "New Orleans, LA", "Bakersfield, CA", "Tampa, FL", "Honolulu, HI", "Anaheim, CA", "Aurora, CO", "Santa Ana, CA", "St. Louis, MO", "Riverside, CA", "Corpus Christi, TX", "Lexington, KY", "Pittsburgh, PA", "Anchorage, AK", "Stockton, CA", "Cincinnati, OH", "Saint Paul, MN", "Toledo, OH", "Newark, NJ", "Greensboro, NC", "Plano, TX", "Henderson, NV", "Lincoln, NE", "Buffalo, NY", "Jersey City, NJ", "Chula Vista, CA", "Fort Wayne, IN", "Orlando, FL", "St. Petersburg, FL", "Chandler, AZ", "Laredo, TX", "Norfolk, VA", "Durham, NC", "Madison, WI", "Lubbock, TX", "Irvine, CA", "Winston-Salem, NC", "Glendale, AZ", "Garland, TX", "Hialeah, FL", "Reno, NV", "Chesapeake, VA", "Gilbert, AZ", "Baton Rouge, LA", "Irving, TX", "Scottsdale, AZ", "North Las Vegas, NV", "Fremont, CA", "Boise, ID", "Richmond, VA", "San Bernardino, CA", "Birmingham, AL", "Spokane, WA", "Rochester, NY", "Des Moines, IA", "Modesto, CA", "Fayetteville, NC", "Tacoma, WA", "Oxnard, CA", "Fontana, CA", "Columbus, GA", "Montgomery, AL", "Moreno Valley, CA", "Shreveport, LA", "Aurora, IL", "Yonkers, NY", "Akron, OH", "Huntington Beach, CA", "Little Rock, AR", "Augusta, GA", "Amarillo, TX", "Glendale, CA", "Mobile, AL", "Grand Rapids, MI", "Salt Lake City, UT", "Tallahassee, FL", "Huntsville, AL", "Grand Prairie, TX", "Knoxville, TN", "Worcester, MA", "Newport News, VA", "Brownsville, TX", "Overland Park, KS", "Santa Clarita, CA", "Providence, RI", "Garden Grove, CA", "Chattanooga, TN", "Oceanside, CA", "Jackson, MS", "Fort Lauderdale, FL", "Santa Rosa, CA", "Rancho Cucamonga, CA", "Port St. Lucie, FL", "Tempe, AZ", "Ontario, CA", "Vancouver, WA", "Cape Coral, FL", "Sioux Falls, SD", "Springfield, MO", "Peoria, AZ", "Pembroke Pines, FL", "Elk Grove, CA", "Salem, OR", "Lancaster, CA", "Corona, CA", "Eugene, OR", "Palmdale, CA", "Salinas, CA", "Springfield, MA", "Pasadena, CA", "Fort Collins, CO", "Hayward, CA", "Pomona, CA", "Cary, NC", "Rockford, IL", "Alexandria, VA", "Escondido, CA", "McKinney, TX", "Kansas City, KS", "Joliet, IL", "Sunnyvale, CA", "Torrance, CA", "Bridgeport, CT", "Lakewood, CO", "Hollywood, FL", "Paterson, NJ", "Naperville, IL", "Syracuse, NY", "Mesquite, TX", "Dayton, OH", "Savannah, GA", "Clarksville, TN", "Orange, CA", "Pasadena, TX", "Fullerton, CA", "Killeen, TX", "Frisco, TX", "Hampton, VA", "McAllen, TX", "Warren, MI", "Bellevue, WA", "West Valley City, UT", "Columbia, MO", "Olathe, KS", "Sterling Heights, MI", "New Haven, CT", "Miramar, FL", "Waco, TX", "Thousand Oaks, CA", "Cedar Rapids, IA", "Charleston, SC", "Visalia, CA", "Topeka, KS", "Elizabeth, NJ", "Gainesville, FL", "Thornton, CO", "Roseville, CA", "Carrollton, TX", "Coral Springs, FL", "Stamford, CT", "Simi Valley, CA", "Concord, CA", "Hartford, CT", "Kent, WA", "Lafayette, LA", "Midland, TX", "Surprise, AZ", "Denton, TX", "Victorville, CA", "Evansville, IN", "Santa Clara, CA", "Abilene, TX", "Athens, GA", "Vallejo, CA", "Allentown, PA", "Norman, OK", "Beaumont, TX", "Independence, MO", "Murfreesboro, TN", "Ann Arbor, MI", "Fargo, ND", "Wilmington, NC", "Golden, CO", "Columbia, SC", "Carmel, IN", "Round Rock, TX", "Clearwater, FL"];
    
    const categories = ["work", "client", "prospect", "mentor", "friend", "family", "vendor", "partner"];
    const sources = ["conference", "referral", "linkedin", "work", "social", "other"];
    
    const sampleContacts = [];
    
    for (let i = 0; i < 127; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const strength = Math.floor(Math.random() * 5) + 1;
      
      sampleContacts.push({
        userId: user.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
        company,
        title,
        location,
        linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        category,
        relationshipStrength: strength,
        contactSource: source,
        notes: `Professional contact in ${category} category. Met through ${source}.`,
      });
    }

    const createdContacts = await db.insert(contacts).values(sampleContacts).returning();
    console.log("✓ 127 sample contacts created");

    // Create diverse interactions for first 30 contacts
    const interactionTypes = ["meeting", "call", "email", "message", "coffee", "conference"];
    const outcomes = ["positive", "neutral", "negative"];
    const subjects = [
      "Initial Introduction", "Follow-up Meeting", "Project Discussion", "Coffee Chat",
      "Networking Event", "Conference Call", "Product Demo", "Strategy Session",
      "Check-in Call", "Partnership Discussion", "Consulting Inquiry", "Referral Meeting",
      "Industry Update", "Collaboration Opportunity", "Service Proposal", "Market Research",
      "Technical Discussion", "Investment Pitch", "Mentorship Session", "Team Introduction"
    ];

    const sampleInteractions = [];
    for (let i = 0; i < Math.min(50, createdContacts.length); i++) {
      const numInteractions = Math.floor(Math.random() * 3) + 1; // 1-3 interactions per contact
      
      for (let j = 0; j < numInteractions; j++) {
        const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        
        // Random date in the past 6 months
        const daysAgo = Math.floor(Math.random() * 180);
        const interactionDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        const followUp = Math.random() > 0.7 ? new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : undefined;
        
        sampleInteractions.push({
          userId: user.id,
          contactId: createdContacts[i].id,
          type,
          subject,
          notes: `${subject} with ${createdContacts[i].firstName}. ${outcome === 'positive' ? 'Great conversation and good potential for future collaboration.' : outcome === 'neutral' ? 'Good discussion, following up as needed.' : 'Discussion needs more work and follow-up.'}`,
          outcome,
          interactionDate,
          followUpRequired: followUp,
        });
      }
    }

    await db.insert(interactions).values(sampleInteractions);
    console.log(`✓ ${sampleInteractions.length} sample interactions created`);

    // Create sample relationships between contacts
    const relationshipTypes = ["colleague", "introduced_by", "worked_together", "mentor_mentee", "client_vendor", "business_partner"];
    const sampleRelationships = [];
    
    // Create some random relationships
    for (let i = 0; i < 25; i++) {
      const contact1 = createdContacts[Math.floor(Math.random() * Math.min(50, createdContacts.length))];
      const contact2 = createdContacts[Math.floor(Math.random() * Math.min(50, createdContacts.length))];
      
      if (contact1.id !== contact2.id) {
        const relationshipType = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
        const strength = Math.floor(Math.random() * 5) + 1;
        
        sampleRelationships.push({
          userId: user.id,
          fromContactId: contact1.id,
          toContactId: contact2.id,
          relationshipType,
          strength,
          notes: `${relationshipType.replace('_', ' ')} relationship between ${contact1.firstName} and ${contact2.firstName}`,
        });
      }
    }

    await db.insert(relationships).values(sampleRelationships);
    console.log(`✓ ${sampleRelationships.length} sample relationships created`);

    // Create diverse tags
    const sampleTags = [
      { userId: user.id, name: "Tech Industry", color: "#2563EB" },
      { userId: user.id, name: "Potential Client", color: "#10B981" },
      { userId: user.id, name: "High Priority", color: "#EF4444" },
      { userId: user.id, name: "Startup", color: "#F59E0B" },
      { userId: user.id, name: "Enterprise", color: "#8B5CF6" },
      { userId: user.id, name: "Investor", color: "#EC4899" },
      { userId: user.id, name: "Designer", color: "#06B6D4" },
      { userId: user.id, name: "Developer", color: "#84CC16" },
      { userId: user.id, name: "Marketing", color: "#F97316" },
      { userId: user.id, name: "Sales", color: "#EF4444" },
      { userId: user.id, name: "C-Level", color: "#6366F1" },
      { userId: user.id, name: "Remote", color: "#14B8A6" },
    ];

    const createdTags = await db.insert(tags).values(sampleTags).returning();
    console.log(`✓ ${sampleTags.length} sample tags created`);

    // Create tag associations for contacts
    const tagAssociations = [];
    for (let i = 0; i < Math.min(60, createdContacts.length); i++) {
      const contact = createdContacts[i];
      const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags per contact
      const contactTagIds = new Set();
      
      for (let j = 0; j < numTags; j++) {
        const randomTag = createdTags[Math.floor(Math.random() * createdTags.length)];
        if (!contactTagIds.has(randomTag.id)) {
          contactTagIds.add(randomTag.id);
          tagAssociations.push({
            contactId: contact.id,
            tagId: randomTag.id,
          });
        }
      }
    }

    await db.insert(contactTags).values(tagAssociations);
    console.log(`✓ ${tagAssociations.length} tag associations created`);

    console.log(`🎉 Database seeded successfully with:`);
    console.log(`   - 127 contacts`);
    console.log(`   - ${sampleInteractions.length} interactions`);
    console.log(`   - ${sampleRelationships.length} relationships`);
    console.log(`   - ${sampleTags.length} tags`);
    console.log(`   - ${tagAssociations.length} tag associations`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}