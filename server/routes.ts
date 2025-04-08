import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db, client } from "./db";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertRiskAssessmentSchema, 
  insertBookmarkSchema,
  riskAssessments 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Get all projects
  apiRouter.get("/projects", async (req: Request, res: Response) => {
    try {
      const country = req.query.country as string | undefined;
      const category = req.query.category as string | undefined;
      const riskLevel = req.query.riskLevel as string | undefined;
      
      let projects;
      
      if (country) {
        projects = await storage.getProjectsByCountry(country);
      } else if (category) {
        projects = await storage.getProjectsByCategory(category);
      } else if (riskLevel) {
        projects = await storage.getProjectsByRiskLevel(riskLevel);
      } else {
        projects = await storage.getProjects();
      }
      
      return res.json(projects);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving projects" });
    }
  });
  
  // Get a single project by ID
  apiRouter.get("/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.json(project);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving project" });
    }
  });
  
  // Create a new project
  apiRouter.post("/projects", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      return res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid project data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Error creating project" });
    }
  });
  
  // Update a project
  apiRouter.patch("/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(id, validatedData);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid project data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Error updating project" });
    }
  });
  
  // Delete a project
  apiRouter.delete("/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error deleting project" });
    }
  });
  
  // Get risk assessment for a project
  apiRouter.get("/risk-assessments/:projectId", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const assessment = await storage.getRiskAssessmentsByProjectId(projectId);
      if (!assessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }
      
      return res.json(assessment);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving risk assessment" });
    }
  });
  
  // Create a risk assessment
  apiRouter.post("/risk-assessments", async (req: Request, res: Response) => {
    try {
      // Get the data from the request body
      const data = req.body;
      
      if (!data.projectId || typeof data.projectId !== 'number') {
        return res.status(400).json({ message: "Invalid or missing projectId" });
      }
      
      // Check if project exists
      const project = await storage.getProjectById(data.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Determine risk level from grade if not provided
      const riskLevel = data.riskLevel || 
        (data.overallGrade === 'A' ? 'Low' : 
         data.overallGrade === 'B' ? 'Medium' : 
         data.overallGrade === 'C' ? 'High' : 
         data.overallGrade === 'D' ? 'Very High' : 'Medium');
      
      // Use direct SQL query via execute_sql_tool instead
      try {
        // Use the db object from drizzle-orm for the query
        const result = await db.execute(sql`
          INSERT INTO risk_assessments (
            project_id, 
            risk_level,
            project_type, 
            energy_use, 
            resource_use, 
            pollution_waste, 
            biodiversity_impact, 
            climate_risk, 
            labor_practices, 
            community_impact, 
            human_rights, 
            responsible_operation, 
            corruption_ethics, 
            overall_grade, 
            overall_score, 
            overall_notes
          ) VALUES (
            ${data.projectId}, 
            ${riskLevel},
            ${data.projectType}, 
            ${data.energyUse}, 
            ${data.resourceUse}, 
            ${data.pollutionWaste}, 
            ${data.biodiversityImpact}, 
            ${data.climateRisk}, 
            ${data.laborPractices}, 
            ${data.communityImpact}, 
            ${data.humanRights}, 
            ${data.responsibleOperation}, 
            ${data.corruptionEthics}, 
            ${data.overallGrade}, 
            ${data.overallScore}, 
            ${data.overallNotes}
          ) RETURNING *
        `);
        
        // Extract assessment from result array
        const assessment = result[0];
        
        if (assessment) {
          // TypeScript safety: cast assessment to any to access properties
          const typedAssessment = assessment as any;
          
          // Update the project with the risk assessment data
          await storage.updateProject(project.id, {
            riskScore: typedAssessment.overall_score ? Number(typedAssessment.overall_score) * 25 : 0,
            riskLevel: typedAssessment.risk_level as string
          });
        }
        
        return res.status(201).json(assessment);
      } catch (sqlError) {
        console.error("SQL Error creating risk assessment:", sqlError);
        return res.status(500).json({ message: "Error creating risk assessment in database" });
      }
    } catch (error) {
      console.error("Error creating risk assessment:", error);
      return res.status(500).json({ message: "Error creating risk assessment" });
    }
  });
  
  // Get bookmarks for a user
  apiRouter.get("/bookmarks/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const bookmarks = await storage.getBookmarksByUserId(userId);
      return res.json(bookmarks);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving bookmarks" });
    }
  });
  
  // Create a bookmark
  apiRouter.post("/bookmarks", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBookmarkSchema.parse(req.body);
      
      // Check if already bookmarked
      const isBookmarked = await storage.isProjectBookmarked(
        validatedData.userId,
        validatedData.projectId
      );
      
      if (isBookmarked) {
        return res.status(400).json({ message: "Project already bookmarked" });
      }
      
      const newBookmark = await storage.createBookmark(validatedData);
      return res.status(201).json(newBookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid bookmark data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Error creating bookmark" });
    }
  });
  
  // Delete a bookmark
  apiRouter.delete("/bookmarks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bookmark ID" });
      }
      
      const success = await storage.deleteBookmark(id);
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error deleting bookmark" });
    }
  });
  
  // Generate risk assessment for a project
  apiRouter.post("/generate-risk-assessment", async (req: Request, res: Response) => {
    try {
      const {
        name,
        description,
        country,
        category,
        size
      } = req.body;
      
      if (!name || !country || !category || !description || !size) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create a project
      const project = await storage.createProject({
        name,
        description,
        country,
        category,
        size,
        region: "",
        funding: "",
        environmentGrade: "",
        socialGrade: "",
        governanceGrade: "",
        riskScore: 0,
        riskLevel: "",
        details: {},
        imageUrl: "",
        contactInfo: ""
      });
      
      // Generate risk scores based on country and category
      // This is a simplified algorithm that could be replaced with more sophisticated risk assessment
      const getRandomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      
      // Generate risk scores based on different factors
      let politicalRisk = 0;
      let environmentalRisk = 0;
      let socialRisk = 0;
      let regulatoryRisk = 0;
      let supplyChainRisk = 0;
      
      // Adjust risk scores based on country
      switch (country) {
        case "South Africa":
          politicalRisk = getRandomScore(40, 60);
          environmentalRisk = getRandomScore(20, 40);
          socialRisk = getRandomScore(30, 50);
          regulatoryRisk = getRandomScore(50, 80);
          supplyChainRisk = getRandomScore(40, 60);
          break;
        case "Kenya":
          politicalRisk = getRandomScore(50, 70);
          environmentalRisk = getRandomScore(30, 50);
          socialRisk = getRandomScore(40, 60);
          regulatoryRisk = getRandomScore(40, 70);
          supplyChainRisk = getRandomScore(50, 70);
          break;
        case "Namibia":
          politicalRisk = getRandomScore(30, 50);
          environmentalRisk = getRandomScore(50, 80);
          socialRisk = getRandomScore(30, 50);
          regulatoryRisk = getRandomScore(40, 60);
          supplyChainRisk = getRandomScore(60, 80);
          break;
        case "Ghana":
          politicalRisk = getRandomScore(40, 60);
          environmentalRisk = getRandomScore(30, 50);
          socialRisk = getRandomScore(30, 50);
          regulatoryRisk = getRandomScore(40, 70);
          supplyChainRisk = getRandomScore(50, 70);
          break;
        case "Nigeria":
          politicalRisk = getRandomScore(60, 80);
          environmentalRisk = getRandomScore(40, 60);
          socialRisk = getRandomScore(50, 70);
          regulatoryRisk = getRandomScore(60, 80);
          supplyChainRisk = getRandomScore(60, 80);
          break;
        default:
          politicalRisk = getRandomScore(40, 70);
          environmentalRisk = getRandomScore(30, 60);
          socialRisk = getRandomScore(40, 60);
          regulatoryRisk = getRandomScore(50, 70);
          supplyChainRisk = getRandomScore(50, 70);
      }
      
      // Adjust risk scores based on category
      switch (category) {
        case "Renewable Energy":
          environmentalRisk = Math.max(environmentalRisk - 20, 10);
          regulatoryRisk = Math.min(regulatoryRisk + 10, 100);
          break;
        case "Conservation":
          environmentalRisk = Math.max(environmentalRisk - 30, 10);
          socialRisk = Math.min(socialRisk + 10, 100);
          break;
        case "Sustainable Agriculture":
          environmentalRisk = Math.max(environmentalRisk - 15, 10);
          supplyChainRisk = Math.min(supplyChainRisk + 10, 100);
          break;
        case "Water Management":
          environmentalRisk = Math.max(environmentalRisk - 10, 10);
          socialRisk = Math.min(socialRisk + 15, 100);
          break;
        case "Waste Management":
          environmentalRisk = Math.max(environmentalRisk - 10, 10);
          regulatoryRisk = Math.min(regulatoryRisk + 15, 100);
          break;
      }
      
      // Calculate overall risk
      const overallRisk = Math.round(
        (politicalRisk + environmentalRisk + socialRisk + regulatoryRisk + supplyChainRisk) / 5
      );
      
      // Determine risk level
      let riskLevel = "Medium";
      if (overallRisk < 40) {
        riskLevel = "Low";
      } else if (overallRisk > 60) {
        riskLevel = "High";
      }
      
      // Create risk assessment
      const riskAssessment = await storage.createRiskAssessment({
        projectId: project.id,
        politicalRisk,
        environmentalRisk,
        socialRisk,
        regulatoryRisk,
        supplyChainRisk,
        overallRisk,
        riskLevel,
        politicalNotes: getRiskNote(politicalRisk, "political", country),
        environmentalNotes: getRiskNote(environmentalRisk, "environmental", country),
        socialNotes: getRiskNote(socialRisk, "social", country),
        regulatoryNotes: getRiskNote(regulatoryRisk, "regulatory", country),
        supplyChainNotes: getRiskNote(supplyChainRisk, "supplyChain", country),
        overallNotes: getOverallNote(riskLevel, category, country)
      });
      
      // Update project with risk scores
      await storage.updateProject(project.id, {
        riskScore: overallRisk,
        riskLevel
      });
      
      return res.status(201).json({
        project,
        riskAssessment
      });
    } catch (error) {
      return res.status(500).json({ message: "Error generating risk assessment" });
    }
  });
  
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for generating risk notes
function getRiskNote(score: number, type: string, country: string): string {
  const notes = {
    political: {
      low: [
        "Stable political environment with low corruption",
        "Strong government support for sustainability projects",
        "Clear policy frameworks in place"
      ],
      medium: [
        "Government stability concerns, moderate corruption index",
        "Mixed policy signals regarding green initiatives",
        "Some political opposition to sustainability projects"
      ],
      high: [
        "Significant political instability risks",
        "High corruption levels could impact project approvals",
        "Lack of consistent government support"
      ]
    },
    environmental: {
      low: [
        "Minimal biodiversity concerns, low water stress area",
        "Favorable environmental conditions for project type",
        "Low natural disaster risk profile"
      ],
      medium: [
        "Some environmental sensitivities to consider",
        "Moderate climate change impact expected",
        "Potential seasonal environmental challenges"
      ],
      high: [
        "High biodiversity impact concerns",
        "Significant climate vulnerability in project area",
        "Water scarcity issues need careful management"
      ]
    },
    social: {
      low: [
        "Strong community support for project type",
        "Minimal land rights or displacement issues",
        "Positive job creation potential"
      ],
      medium: [
        "Some land rights issues, potential job displacement concerns",
        "Mixed community reception to similar projects",
        "Moderate cultural sensitivity considerations"
      ],
      high: [
        "Significant community opposition potential",
        "Complex land rights or indigenous peoples issues",
        "High social impact requiring extensive consultation"
      ]
    },
    regulatory: {
      low: [
        "Straightforward permitting process",
        "Stable regulatory environment for sector",
        "Supportive legal framework for project type"
      ],
      medium: [
        "Moderately complex approval process",
        "Some regulatory uncertainty in sector",
        "Expected policy changes may impact compliance"
      ],
      high: [
        "Complex permitting process, changing energy regulations",
        "Significant regulatory hurdles expected",
        "Lack of clear legal framework for project type"
      ]
    },
    supplyChain: {
      low: [
        "Strong local supply chain infrastructure",
        "Good transportation networks and access",
        "Reliable material sourcing options"
      ],
      medium: [
        "Port congestion issues, moderate infrastructure quality",
        "Some materials may require international sourcing",
        "Seasonal logistics challenges possible"
      ],
      high: [
        "Significant infrastructure limitations",
        "Complex international supply chain dependencies",
        "High transportation risks and costs"
      ]
    }
  };
  
  let riskLevel = "medium";
  if (score < 40) {
    riskLevel = "low";
  } else if (score > 60) {
    riskLevel = "high";
  }
  
  const noteType = type as keyof typeof notes;
  const notes_for_type = notes[noteType];
  
  if (!notes_for_type) {
    return "No specific notes available";
  }
  
  const levelNotes = notes_for_type[riskLevel as keyof typeof notes_for_type];
  
  if (!levelNotes || levelNotes.length === 0) {
    return "No specific notes available";
  }
  
  return levelNotes[Math.floor(Math.random() * levelNotes.length)];
}

function getOverallNote(riskLevel: string, category: string, country: string): string {
  if (riskLevel === "Low") {
    return `This project presents a low overall risk profile, indicating favorable conditions for implementation in ${country}. The ${category} sector shows strong potential with minimal obstacles. Recommended to proceed with standard due diligence and monitoring practices.`;
  } else if (riskLevel === "Medium") {
    return `This project presents a moderate overall risk with challenges that require attention. Key recommendations include developing robust stakeholder engagement plans and conducting thorough regulatory analysis for ${category} projects in ${country}.`;
  } else {
    return `This project presents significant risks that require careful management. For ${category} projects in ${country}, we strongly recommend comprehensive risk mitigation strategies, including early regulatory engagement, detailed community consultation, and robust contingency planning.`;
  }
}
