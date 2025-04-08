import { FilterOptions } from '@/types';

export const COUNTRIES = [
  "South Africa",
  "Kenya",
  "Namibia",
  "Ghana",
  "Nigeria",
  "Tanzania",
  "Ethiopia",
  "Senegal",
  "Rwanda",
  "Uganda",
  "Zambia",
  "Mozambique",
  "Botswana",
  "Malawi",
  "Zimbabwe",
];

export const CATEGORIES = [
  "Renewable Energy",
  "Conservation",
  "Sustainable Agriculture",
  "Water Management",
  "Waste Management",
  "Green Building",
  "Climate Resilience",
  "Health & Sanitation",
  "Education",
  "Sustainable Transportation",
];

export const PROJECT_SIZES = [
  "Small (< $1M)",
  "Medium ($1M - $10M)",
  "Large ($10M - $50M)",
  "Extra Large (> $50M)",
];

export const RISK_LEVELS = [
  "Low",
  "Moderate",
  "High",
  "Very High",
];

export const getLevelColor = (level: string | undefined): {
  bg: string;
  text: string;
  barColor: string;
} => {
  if (!level) {
    return { bg: "bg-gray-100", text: "text-gray-800", barColor: "bg-gray-500" };
  }
  
  switch (level) {
    case "Low":
      return { bg: "bg-green-100", text: "text-green-800", barColor: "bg-green-500" };
    case "Moderate":
      return { bg: "bg-yellow-100", text: "text-yellow-800", barColor: "bg-yellow-500" };
    case "High":
      return { bg: "bg-orange-100", text: "text-orange-800", barColor: "bg-orange-500" };
    case "Very High":
      return { bg: "bg-red-100", text: "text-red-800", barColor: "bg-red-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", barColor: "bg-gray-500" };
  }
};

export const getCategoryColor = (category: string | undefined): {
  bg: string;
  text: string;
} => {
  if (!category) {
    return { bg: "bg-gray-100", text: "text-gray-800" };
  }
  
  switch (category) {
    case "Renewable Energy":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "Conservation":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "Sustainable Agriculture":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "Water Management":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "Waste Management":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
};

export const buildQueryString = (filters: FilterOptions): string => {
  const params = new URLSearchParams();
  
  if (filters.country && filters.country !== "all") {
    params.append('country', filters.country);
  }
  
  if (filters.category && filters.category !== "all") {
    params.append('category', filters.category);
  }
  
  if (filters.riskLevel && filters.riskLevel !== "all") {
    params.append('riskLevel', filters.riskLevel);
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  return params.toString();
};
