import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if OpenAI API Key is available
export function hasOpenAIApiKey(): boolean {
  // This will be initialized in the server routes
  return !!import.meta.env.VITE_HAS_OPENAI_API_KEY;
}

// Get the ESG Insights Generation prompt used for OpenAI API
export function getESGInsightsPrompt(category: string, projectName: string, country: string, projectCategory: string, metrics: Record<string, string>): string {
  const metricsFormatted = Object.entries(metrics)
    .map(([key, value]) => `- ${key}: ${value || "Unknown"}`)
    .join('\n');
  
  let prompt = "";
  
  if (category === "environment") {
    prompt = `Analyze the following environmental metrics for a project named "${projectName}" in ${country}, category ${projectCategory}:
    ${metricsFormatted}
    
    Generate 2-3 concise, bullet-point insights about environmental risks and specific actionable recommendations. Each bullet should reference applicable frameworks like IFC Performance Standards, GRI, or SASB when possible.`;
  } else if (category === "social") {
    prompt = `Analyze the following social metrics for a project named "${projectName}" in ${country}, category ${projectCategory}:
    ${metricsFormatted}
    
    Generate 2-3 concise, bullet-point insights about social risks and specific actionable recommendations. Each bullet should reference applicable frameworks like ILO standards, UN Guiding Principles, or SA8000 when possible.`;
  } else if (category === "governance") {
    prompt = `Analyze the following governance metrics for a project named "${projectName}" in ${country}, category ${projectCategory}:
    ${metricsFormatted}
    
    Generate 2-3 concise, bullet-point insights about governance risks and specific actionable recommendations. Each bullet should reference applicable frameworks like OECD Guidelines, UN Global Compact, or ISO standards when possible.`;
  }
  
  return prompt;
}

// Get the system prompt used for OpenAI API
export function getAISystemPrompt(): string {
  return `You are an ESG (Environmental, Social, Governance) analyst providing extremely concise, actionable insights based on project metrics. Focus on specific, practical actions stakeholders can take to mitigate risks. Format your response as bullet points with 3-4 specific actionable recommendations. For each bullet point, start with a bolded title followed by a colon and then a brief explanation. Refer to objective standards, frameworks, or research when possible in your assessment. Each bullet point should be no more than 20 words. DO NOT use markdown formatting like **Title**. Instead, structure each bullet like 'Title: Detail' where the title will be styled separately.`;
}
