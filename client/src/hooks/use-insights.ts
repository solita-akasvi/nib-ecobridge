import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface UseInsightsProps {
  projectId: number;
}

export function useInsights({ projectId }: UseInsightsProps) {
  const [environmentInsights, setEnvironmentInsights] = useState<string | null>(null);
  const [socialInsights, setSocialInsights] = useState<string | null>(null);
  const [governanceInsights, setGovernanceInsights] = useState<string | null>(null);
  
  const [environmentLoading, setEnvironmentLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [governanceLoading, setGovernanceLoading] = useState(false);
  
  const [environmentError, setEnvironmentError] = useState<string | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [governanceError, setGovernanceError] = useState<string | null>(null);
  
  // Function to fetch environment insights
  const fetchEnvironmentInsights = async () => {
    setEnvironmentLoading(true);
    setEnvironmentError(null);
    
    try {
      const response = await apiRequest("/api/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          category: "environment",
        }),
      });
      
      setEnvironmentInsights(response.insights);
    } catch (error) {
      console.error("Error fetching environment insights:", error);
      setEnvironmentError("Failed to fetch environment insights");
    } finally {
      setEnvironmentLoading(false);
    }
  };
  
  // Function to fetch social insights
  const fetchSocialInsights = async () => {
    setSocialLoading(true);
    setSocialError(null);
    
    try {
      const response = await apiRequest("/api/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          category: "social",
        }),
      });
      
      setSocialInsights(response.insights);
    } catch (error) {
      console.error("Error fetching social insights:", error);
      setSocialError("Failed to fetch social insights");
    } finally {
      setSocialLoading(false);
    }
  };
  
  // Function to fetch governance insights
  const fetchGovernanceInsights = async () => {
    setGovernanceLoading(true);
    setGovernanceError(null);
    
    try {
      const response = await apiRequest("/api/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          category: "governance",
        }),
      });
      
      setGovernanceInsights(response.insights);
    } catch (error) {
      console.error("Error fetching governance insights:", error);
      setGovernanceError("Failed to fetch governance insights");
    } finally {
      setGovernanceLoading(false);
    }
  };
  
  return {
    environmentInsights,
    socialInsights,
    governanceInsights,
    environmentLoading,
    socialLoading,
    governanceLoading,
    environmentError,
    socialError,
    governanceError,
    fetchEnvironmentInsights,
    fetchSocialInsights,
    fetchGovernanceInsights,
  };
}