import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Building, MapPin, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactEnrichmentProps {
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    company?: string;
  };
  onEnrichmentComplete: (enrichedData: any) => void;
}

interface EnrichmentData {
  company?: {
    name: string;
    industry: string;
    size: string;
    description: string;
  };
  profile?: {
    title: string;
    location: string;
    linkedinUrl: string;
    skills: string[];
  };
  suggestions?: {
    duplicates: Array<{
      id: string;
      name: string;
      similarity: number;
    }>;
    connections: Array<{
      name: string;
      relationship: string;
    }>;
  };
}

export function ContactEnrichment({ contact, onEnrichmentComplete }: ContactEnrichmentProps) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const { toast } = useToast();

  const enrichContact = async () => {
    setIsEnriching(true);
    
    try {
      // Simulate intelligent enrichment with realistic data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockEnrichment: EnrichmentData = {
        company: contact.company ? {
          name: contact.company,
          industry: getRandomIndustry(),
          size: getRandomCompanySize(),
          description: `${contact.company} is a leading company in the technology sector.`
        } : undefined,
        profile: {
          title: getRandomTitle(),
          location: getRandomLocation(),
          linkedinUrl: `https://linkedin.com/in/${contact.firstName.toLowerCase()}${contact.lastName.toLowerCase()}`,
          skills: getRandomSkills()
        },
        suggestions: {
          duplicates: Math.random() > 0.7 ? [{
            id: "potential-duplicate",
            name: `${contact.firstName} ${contact.lastName}`,
            similarity: 0.85
          }] : [],
          connections: getRandomConnections()
        }
      };
      
      setEnrichmentData(mockEnrichment);
      
      toast({
        title: "Contact Enriched",
        description: "Found additional information and suggestions",
      });
      
    } catch (error) {
      toast({
        title: "Enrichment Failed",
        description: "Could not enrich contact data",
        variant: "destructive",
      });
    } finally {
      setIsEnriching(false);
    }
  };

  const applyEnrichment = () => {
    if (enrichmentData) {
      onEnrichmentComplete(enrichmentData);
      toast({
        title: "Data Applied",
        description: "Contact has been updated with enriched information",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={enrichContact}
          disabled={isEnriching}
          size="sm"
          variant="outline"
          data-testid="button-enrich-contact"
        >
          {isEnriching ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <UserPlus className="h-4 w-4 mr-2" />
          )}
          {isEnriching ? "Enriching..." : "Enrich Contact"}
        </Button>
      </div>

      {enrichmentData && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium text-sm">Enrichment Results</h4>
          
          {enrichmentData.company && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="font-medium">Company Information</span>
              </div>
              <div className="ml-6 space-y-1 text-sm">
                <p><span className="font-medium">Industry:</span> {enrichmentData.company.industry}</p>
                <p><span className="font-medium">Size:</span> {enrichmentData.company.size}</p>
                <p><span className="font-medium">Description:</span> {enrichmentData.company.description}</p>
              </div>
            </div>
          )}

          {enrichmentData.profile && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">Profile Details</span>
              </div>
              <div className="ml-6 space-y-1 text-sm">
                <p><span className="font-medium">Title:</span> {enrichmentData.profile.title}</p>
                <p><span className="font-medium">Location:</span> {enrichmentData.profile.location}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-medium">Skills:</span>
                  {enrichmentData.profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {enrichmentData.suggestions && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Suggestions</span>
              </div>
              
              {enrichmentData.suggestions.duplicates.length > 0 && (
                <div className="ml-6 space-y-1 text-sm">
                  <p className="font-medium text-yellow-600">Potential Duplicate Found:</p>
                  {enrichmentData.suggestions.duplicates.map((duplicate, index) => (
                    <p key={index} className="text-xs">
                      {duplicate.name} ({Math.round(duplicate.similarity * 100)}% match)
                    </p>
                  ))}
                </div>
              )}
              
              {enrichmentData.suggestions.connections.length > 0 && (
                <div className="ml-6 space-y-1 text-sm">
                  <p className="font-medium">Potential Connections:</p>
                  {enrichmentData.suggestions.connections.map((conn, index) => (
                    <p key={index} className="text-xs">
                      {conn.name} ({conn.relationship})
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            onClick={applyEnrichment}
            size="sm"
            data-testid="button-apply-enrichment"
          >
            Apply Enrichment
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper functions to generate realistic mock data
function getRandomIndustry(): string {
  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail",
    "Manufacturing", "Consulting", "Media", "Real Estate", "Automotive"
  ];
  return industries[Math.floor(Math.random() * industries.length)];
}

function getRandomCompanySize(): string {
  const sizes = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function getRandomTitle(): string {
  const titles = [
    "Senior Software Engineer", "Product Manager", "Marketing Director",
    "Sales Manager", "Data Scientist", "UX Designer", "Business Analyst",
    "Operations Manager", "VP Engineering", "Customer Success Manager"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomLocation(): string {
  const locations = [
    "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA",
    "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Denver, CO"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomSkills(): string[] {
  const allSkills = [
    "JavaScript", "React", "Node.js", "Python", "Leadership", "Strategy",
    "Marketing", "Sales", "Data Analysis", "Project Management", "Design",
    "Communication", "Problem Solving", "Team Building"
  ];
  const numSkills = Math.floor(Math.random() * 4) + 2; // 2-5 skills
  return allSkills.sort(() => Math.random() - 0.5).slice(0, numSkills);
}

function getRandomConnections(): Array<{name: string; relationship: string}> {
  const connections = [
    { name: "Sarah Chen", relationship: "Former colleague" },
    { name: "Marcus Johnson", relationship: "Mutual connection" },
    { name: "Emily Rodriguez", relationship: "Industry contact" },
  ];
  return connections.slice(0, Math.floor(Math.random() * 3) + 1);
}