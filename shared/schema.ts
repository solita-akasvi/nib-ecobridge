import { pgTable, text, serial, integer, varchar, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  organization: text("organization"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  organization: true,
});

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  country: text("country").notNull(),
  region: text("region"),
  category: text("category").notNull(),
  size: text("size").notNull(),
  funding: text("funding"),
  environmentGrade: varchar("environment_grade", { length: 2 }),
  socialGrade: varchar("social_grade", { length: 2 }),
  governanceGrade: varchar("governance_grade", { length: 2 }),
  riskScore: integer("risk_score"),
  riskLevel: text("risk_level"),
  details: json("details"),
  imageUrl: text("image_url"),
  contactInfo: text("contact_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

// Risk Assessment schema
export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  politicalRisk: integer("political_risk").notNull(),
  environmentalRisk: integer("environmental_risk").notNull(),
  socialRisk: integer("social_risk").notNull(),
  regulatoryRisk: integer("regulatory_risk").notNull(),
  supplyChainRisk: integer("supply_chain_risk").notNull(),
  overallRisk: integer("overall_risk").notNull(),
  riskLevel: text("risk_level").notNull(),
  politicalNotes: text("political_notes"),
  environmentalNotes: text("environmental_notes"),
  socialNotes: text("social_notes"),
  regulatoryNotes: text("regulatory_notes"),
  supplyChainNotes: text("supply_chain_notes"),
  overallNotes: text("overall_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  createdAt: true,
});

// Bookmarks schema
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  projectId: integer("project_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
