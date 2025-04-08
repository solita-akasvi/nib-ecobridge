import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, projects, riskAssessments, bookmarks } from "@shared/schema";

// Create a PostgreSQL connection
export const client = postgres(process.env.DATABASE_URL || "");

// Create a Drizzle database instance
export const db = drizzle(client, {
  schema: {
    users,
    projects,
    riskAssessments,
    bookmarks,
  },
});