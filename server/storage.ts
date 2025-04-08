import { db, client } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { 
  User, Project, RiskAssessment, Bookmark, 
  InsertUser, InsertProject, InsertRiskAssessment, InsertBookmark, 
  users, projects, riskAssessments, bookmarks 
} from "@shared/schema";

export interface IStorage {
  // Database client for direct SQL queries
  client: any;
  
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

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  // Expose client for direct SQL queries
  client = client;
  
  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Project Operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByCountry(country: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.country, country));
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.category, category));
  }

  async getProjectsByRiskLevel(riskLevel: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.riskLevel, riskLevel));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return !!deletedProject;
  }

  // Risk Assessment Operations
  async getRiskAssessmentsByProjectId(projectId: number): Promise<RiskAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(riskAssessments)
      .where(eq(riskAssessments.projectId, projectId));
    return assessment || undefined;
  }

  async createRiskAssessment(insertAssessment: InsertRiskAssessment): Promise<RiskAssessment> {
    console.log("Creating risk assessment with data:", JSON.stringify(insertAssessment, null, 2));
    
    // Ensure riskLevel is set (required by database schema)
    if (!insertAssessment.riskLevel) {
      // Map from overall grade if available
      if (insertAssessment.overallGrade) {
        const gradeToLevel: Record<string, string> = {
          "A": "Low",
          "B": "Medium",
          "C": "High",
          "D": "Very High"
        };
        insertAssessment.riskLevel = gradeToLevel[insertAssessment.overallGrade] || "Medium";
      } else {
        insertAssessment.riskLevel = "Medium"; // Default value
      }
      console.log("Set riskLevel to:", insertAssessment.riskLevel);
    }
    
    // Ensure we're passing the correct data structure to the database
    const assessmentData = {
      ...insertAssessment,
      riskLevel: insertAssessment.riskLevel || "Medium" // Explicitly set default if still missing
    };
    
    console.log("Final assessment data:", JSON.stringify(assessmentData, null, 2));
    
    const [assessment] = await db
      .insert(riskAssessments)
      .values(assessmentData)
      .returning();
    
    // Update the associated project with risk information
    if (assessment) {
      const project = await this.getProjectById(assessment.projectId);
      if (project) {
        const updateData: Partial<InsertProject> = {
          riskScore: assessment.overallScore ? assessment.overallScore * 25 : 0, // Scale to 0-100 for compatibility
        };
        
        // Map grades to risk levels for compatibility
        const gradeToLevel: Record<string, string> = {
          "A": "Low",
          "B": "Medium",
          "C": "High",
          "D": "Very High"
        };
        
        updateData.riskLevel = assessment.overallGrade ? gradeToLevel[assessment.overallGrade] || "Medium" : "Medium";
        
        // Update environmental grade if available
        if (assessment.energyUse || assessment.resourceUse || assessment.pollutionWaste || 
            assessment.biodiversityImpact || assessment.climateRisk) {
          // Use the first available environmental grade
          const envGrades = [
            assessment.energyUse, 
            assessment.resourceUse, 
            assessment.pollutionWaste,
            assessment.biodiversityImpact,
            assessment.climateRisk
          ].filter(Boolean);
          
          if (envGrades.length > 0) {
            updateData.environmentGrade = envGrades[0];
          }
        }
        
        // Update social grade if available
        if (assessment.laborPractices || assessment.communityImpact || assessment.humanRights) {
          const socialGrades = [
            assessment.laborPractices,
            assessment.communityImpact,
            assessment.humanRights
          ].filter(Boolean);
          
          if (socialGrades.length > 0) {
            updateData.socialGrade = socialGrades[0];
          }
        }
        
        // Update governance grade if available
        if (assessment.responsibleOperation || assessment.corruptionEthics) {
          const govGrades = [
            assessment.responsibleOperation,
            assessment.corruptionEthics
          ].filter(Boolean);
          
          if (govGrades.length > 0) {
            updateData.governanceGrade = govGrades[0];
          }
        }
        
        await this.updateProject(project.id, updateData);
      }
    }
    
    return assessment;
  }

  async updateRiskAssessment(id: number, updateData: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined> {
    const [updatedAssessment] = await db
      .update(riskAssessments)
      .set(updateData)
      .where(eq(riskAssessments.id, id))
      .returning();
    return updatedAssessment || undefined;
  }

  // Bookmark Operations
  async getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId));
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const [bookmark] = await db
      .insert(bookmarks)
      .values(insertBookmark)
      .returning();
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    const [deletedBookmark] = await db
      .delete(bookmarks)
      .where(eq(bookmarks.id, id))
      .returning();
    return !!deletedBookmark;
  }

  async isProjectBookmarked(userId: number, projectId: number): Promise<boolean> {
    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.projectId, projectId)
        )
      );
    return !!bookmark;
  }
}

// Export an instance of the DatabaseStorage class
export const storage = new DatabaseStorage();