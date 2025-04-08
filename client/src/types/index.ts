export interface RiskScore {
  score: number;
  level: "Low" | "Medium" | "High";
  notes?: string;
}

export interface RiskAssessment {
  id: number;
  projectId: number;
  politicalRisk: number;
  environmentalRisk: number;
  socialRisk: number;
  regulatoryRisk: number;
  supplyChainRisk: number;
  overallRisk: number;
  riskLevel: string;
  politicalNotes?: string;
  environmentalNotes?: string;
  socialNotes?: string;
  regulatoryNotes?: string;
  supplyChainNotes?: string;
  overallNotes?: string;
  createdAt?: Date;
}

export interface ProjectDetails {
  impact?: string;
  timeline?: string;
  partners?: string[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  country: string;
  region?: string;
  category: string;
  size: string;
  funding?: string;
  environmentGrade?: string;
  socialGrade?: string;
  governanceGrade?: string;
  riskScore?: number;
  riskLevel?: string;
  details?: ProjectDetails;
  imageUrl?: string;
  contactInfo?: string;
  createdAt?: Date;
}

export interface Bookmark {
  id: number;
  userId: number;
  projectId: number;
  createdAt?: Date;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  organization?: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  country: string;
  category: string;
  size: string;
  region?: string;
}

export interface FilterOptions {
  country?: string;
  category?: string;
  riskLevel?: string;
  search?: string;
}
