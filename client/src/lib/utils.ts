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
