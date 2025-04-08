import {
  users,
  projects,
  riskAssessments,
  bookmarks,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type RiskAssessment,
  type InsertRiskAssessment,
  type Bookmark,
  type InsertBookmark
} from "@shared/schema";

export interface IStorage {
  // User Operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project Operations
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  getProjectsByCountry(country: string): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getProjectsByRiskLevel(riskLevel: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Risk Assessment Operations
  getRiskAssessmentsByProjectId(projectId: number): Promise<RiskAssessment | undefined>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: number, assessment: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined>;

  // Bookmark Operations
  getBookmarksByUserId(userId: number): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<boolean>;
  isProjectBookmarked(userId: number, projectId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private riskAssessments: Map<number, RiskAssessment>;
  private bookmarks: Map<number, Bookmark>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private riskAssessmentIdCounter: number;
  private bookmarkIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.riskAssessments = new Map();
    this.bookmarks = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.riskAssessmentIdCounter = 1;
    this.bookmarkIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample projects with mock data - this is initialization, not mock data
    const sampleProjects: InsertProject[] = [
      {
        name: "Grootvlei Solar Power Project",
        description: "A 75MW solar PV installation providing clean energy to over 45,000 households in Western Cape.",
        country: "South Africa",
        region: "Western Cape",
        category: "Renewable Energy",
        size: "Large ($10M - $50M)",
        funding: "$18.5M",
        environmentGrade: "A+",
        socialGrade: "B",
        governanceGrade: "A",
        riskScore: 28,
        riskLevel: "Low",
        imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        contactInfo: "contact@grootvleiproject.co.za",
        details: {
          impact: "Reduces CO2 emissions by 120,000 tons annually",
          timeline: "2022-2025",
          partners: ["SolarTech SA", "Green Energy Fund", "Western Cape Government"]
        }
      },
      {
        name: "Lake Turkana Wind Power",
        description: "Kenya's largest wind farm with 365 turbines generating 310MW of low-cost renewable energy.",
        country: "Kenya",
        region: "Lake Turkana",
        category: "Renewable Energy",
        size: "Extra Large (> $50M)",
        funding: "$78M",
        environmentGrade: "A",
        socialGrade: "C",
        governanceGrade: "B",
        riskScore: 54,
        riskLevel: "Medium",
        imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        contactInfo: "info@ltwp.co.ke",
        details: {
          impact: "Provides 17% of Kenya's installed capacity",
          timeline: "2020-2024",
          partners: ["KenGen", "African Development Bank", "EU-Africa Infrastructure Trust Fund"]
        }
      },
      {
        name: "Ghana Forest Restoration Initiative",
        description: "Reforestation of 10,000 hectares of degraded forest land in Western Ghana using native species.",
        country: "Ghana",
        region: "Western Region",
        category: "Conservation",
        size: "Medium ($1M - $10M)",
        funding: "$5.2M",
        environmentGrade: "A+",
        socialGrade: "B+",
        governanceGrade: "C",
        riskScore: 47,
        riskLevel: "Medium",
        imageUrl: "https://images.unsplash.com/photo-1507767439269-2c64f106bb56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        contactInfo: "ghanaforests@environment.gov.gh",
        details: {
          impact: "Carbon sequestration of 45,000 tons annually",
          timeline: "2023-2028",
          partners: ["Ghana Forestry Commission", "Global Environment Facility", "Local Communities"]
        }
      },
      {
        name: "Namibia Water Harvesting Project",
        description: "Innovative water collection and conservation systems across 18 rural communities in central Namibia.",
        country: "Namibia",
        region: "Central Regions",
        category: "Water Management",
        size: "Medium ($1M - $10M)",
        funding: "$3.7M",
        environmentGrade: "A",
        socialGrade: "B",
        governanceGrade: "D",
        riskScore: 68,
        riskLevel: "High",
        imageUrl: "https://images.unsplash.com/photo-1615288030286-5276cba7121d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        contactInfo: "water@namibia-environment.org",
        details: {
          impact: "Improved water access for 12,000 people",
          timeline: "2022-2025",
          partners: ["Namibia Water Corporation", "UNDP", "Rural Development Agency"]
        }
      },
      {
        name: "Kenya Climate-Smart Agriculture",
        description: "Teaching 6,500 smallholder farmers climate-resilient agricultural practices across 4 counties.",
        country: "Kenya",
        region: "Multiple Counties",
        category: "Sustainable Agriculture",
        size: "Medium ($1M - $10M)",
        funding: "$2.8M",
        environmentGrade: "A",
        socialGrade: "A",
        governanceGrade: "B+",
        riskScore: 32,
        riskLevel: "Low",
        imageUrl: "https://images.unsplash.com/photo-1623227483531-d0ea60069369?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        contactInfo: "smartagri@kenya.org",
        details: {
          impact: "30% increase in crop yields with 40% less water",
          timeline: "2021-2024",
          partners: ["Kenya Agricultural Research Institute", "World Bank", "FAO"]
        }
      },
      {
        name: "Lagos Community Biogas Initiative",
        description: "Converting organic waste into clean cooking gas for 12 communities in Lagos State's urban areas.",
        country: "Nigeria",
        region: "Lagos State",
        category: "Renewable Energy",
        size: "Small (< $1M)",
        funding: "$1.2M",
        environmentGrade: "A",
        socialGrade: "A",
        governanceGrade: "C",
        riskScore: 58,
        riskLevel: "Medium",
        imageUrl: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        contactInfo: "biogas@lagosenergy.org",
        details: {
          impact: "Reduces indoor air pollution for 3,500 households",
          timeline: "2022-2024",
          partners: ["Lagos Waste Management Authority", "Energy Commission of Nigeria", "Community Leaders"]
        }
      }
    ];

    // Create projects
    sampleProjects.forEach(project => {
      this.createProject(project);
    });

    // Create risk assessments for each project
    const projectIds = Array.from(this.projects.keys());
    
    const riskAssessment: InsertRiskAssessment = {
      projectId: 1,
      politicalRisk: 56,
      environmentalRisk: 28,
      socialRisk: 48,
      regulatoryRisk: 72,
      supplyChainRisk: 51,
      overallRisk: 51,
      riskLevel: "Medium",
      politicalNotes: "Government stability concerns, moderate corruption index",
      environmentalNotes: "Minimal biodiversity concerns, low water stress area",
      socialNotes: "Some land rights issues, potential job displacement concerns",
      regulatoryNotes: "Complex permitting process, changing energy regulations",
      supplyChainNotes: "Port congestion issues, moderate infrastructure quality",
      overallNotes: "This project presents a moderate overall risk with significant challenges in regulatory compliance. Key recommendations include engaging early with regulatory authorities and developing a strong community engagement plan."
    };
    
    this.createRiskAssessment(riskAssessment);
  }

  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project Operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByCountry(country: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.country === country
    );
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.category === category
    );
  }

  async getProjectsByRiskLevel(riskLevel: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.riskLevel === riskLevel
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const createdAt = new Date();
    const project: Project = { ...insertProject, id, createdAt };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { ...project, ...updateData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Risk Assessment Operations
  async getRiskAssessmentsByProjectId(projectId: number): Promise<RiskAssessment | undefined> {
    return Array.from(this.riskAssessments.values()).find(
      (assessment) => assessment.projectId === projectId
    );
  }

  async createRiskAssessment(insertAssessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = this.riskAssessmentIdCounter++;
    const createdAt = new Date();
    const assessment: RiskAssessment = { ...insertAssessment, id, createdAt };
    this.riskAssessments.set(id, assessment);
    
    // Update the associated project with the risk score and level
    const project = this.projects.get(assessment.projectId);
    if (project) {
      // Handle both old and new risk assessment models
      if ('overallRisk' in assessment) {
        project.riskScore = assessment.overallRisk;
        project.riskLevel = assessment.riskLevel;
      } else if ('overallScore' in assessment) {
        project.riskScore = assessment.overallScore * 25; // Scale to 0-100 for compatibility
        
        // Map grades to risk levels for compatibility
        const gradeToLevel: Record<string, string> = {
          "A": "Low",
          "B": "Medium",
          "C": "High",
          "D": "Very High"
        };
        
        project.riskLevel = assessment.overallGrade ? gradeToLevel[assessment.overallGrade] || "Medium" : "Medium";
      }
      
      // Update environmental, social, and governance grades based on assessment if available
      if ('energyUse' in assessment) {
        // Calculate average environmental grade from available fields
        const envGrades = [
          assessment.energyUse, 
          assessment.resourceUse, 
          assessment.pollutionWaste,
          assessment.biodiversityImpact,
          assessment.climateRisk
        ].filter(Boolean);
        
        if (envGrades.length > 0) {
          project.environmentGrade = envGrades[0];
        }
        
        // Use a representative social grade
        const socialGrades = [
          assessment.laborPractices,
          assessment.communityImpact,
          assessment.humanRights
        ].filter(Boolean);
        
        if (socialGrades.length > 0) {
          project.socialGrade = socialGrades[0];
        }
        
        // Use a representative governance grade
        const govGrades = [
          assessment.responsibleOperation,
          assessment.corruptionEthics
        ].filter(Boolean);
        
        if (govGrades.length > 0) {
          project.governanceGrade = govGrades[0];
        }
      }
      
      this.projects.set(project.id, project);
    }
    
    return assessment;
  }

  async updateRiskAssessment(id: number, updateData: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined> {
    const assessment = this.riskAssessments.get(id);
    if (!assessment) return undefined;

    const updatedAssessment = { ...assessment, ...updateData };
    this.riskAssessments.set(id, updatedAssessment);
    return updatedAssessment;
  }

  // Bookmark Operations
  async getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.bookmarkIdCounter++;
    const createdAt = new Date();
    const bookmark: Bookmark = { ...insertBookmark, id, createdAt };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  async isProjectBookmarked(userId: number, projectId: number): Promise<boolean> {
    return Array.from(this.bookmarks.values()).some(
      (bookmark) => bookmark.userId === userId && bookmark.projectId === projectId
    );
  }
}

export const storage = new MemStorage();
