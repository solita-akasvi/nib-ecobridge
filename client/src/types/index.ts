export type GradeType = "A" | "B" | "C" | "D" | "";

export interface RiskCategory {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  grade: GradeType;
}

export interface RiskAssessment {
  id: number;
  projectId: number;
  projectType: GradeType;
  energyUse: GradeType;
  resourceUse: GradeType;
  pollutionWaste: GradeType;
  biodiversityImpact: GradeType;
  climateRisk: GradeType;
  laborPractices: GradeType;
  communityImpact: GradeType;
  humanRights: GradeType;
  responsibleOperation: GradeType;
  corruptionEthics: GradeType;
  newsScreening?: GradeType;
  overallGrade: GradeType;
  overallScore: number;
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
