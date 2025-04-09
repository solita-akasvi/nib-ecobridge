import React from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Project, RiskAssessment, RiskCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useInsights } from "@/hooks/use-insights";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskOverviewCard } from "@/components/project/risk-overview-card";
import { RiskCategoryCard } from "@/components/project/risk-category-card";
import { RISK_CATEGORIES } from "@/lib/assessment-data";
import { Link } from "wouter";
import { hasOpenAIApiKey } from "@/lib/utils";

export default function ProjectPage() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params ? parseInt(params.id) : null;
  const { toast } = useToast();

  // Check if OpenAI API key exists
  const hasOpenAIKey = import.meta.env.VITE_HAS_OPENAI_API_KEY === "true";

  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["/api/projects", projectId],
    queryFn: () => apiRequest<Project>(`/api/projects/${projectId}`),
    enabled: !!projectId,
  });

  // Fetch risk assessment data
  const {
    data: riskAssessment,
    isLoading: riskAssessmentLoading,
    error: riskAssessmentError,
  } = useQuery({
    queryKey: ["/api/risk-assessments", projectId],
    queryFn: () => apiRequest<RiskAssessment>(`/api/risk-assessments/${projectId}`),
    enabled: !!projectId,
  });

  // Hook for AI-generated insights
  const {
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
  } = useInsights({ projectId: projectId || 0 });

  // Group metrics by category
  const getEnvironmentMetrics = () => {
    if (!riskAssessment) return [];

    return [
      { id: "projectType", label: "Project Type", grade: riskAssessment.projectType },
      { id: "energyUse", label: "Energy Use", grade: riskAssessment.energyUse },
      { id: "resourceUse", label: "Resource Use", grade: riskAssessment.resourceUse },
      { id: "pollutionWaste", label: "Pollution & Waste", grade: riskAssessment.pollutionWaste },
      { id: "biodiversityImpact", label: "Biodiversity Impact", grade: riskAssessment.biodiversityImpact },
      { id: "climateRisk", label: "Climate Risk", grade: riskAssessment.climateRisk },
    ];
  };

  const getSocialMetrics = () => {
    if (!riskAssessment) return [];

    return [
      { id: "laborPractices", label: "Labor Practices", grade: riskAssessment.laborPractices },
      { id: "communityImpact", label: "Community Impact", grade: riskAssessment.communityImpact },
      { id: "humanRights", label: "Human Rights", grade: riskAssessment.humanRights },
    ];
  };

  const getGovernanceMetrics = () => {
    if (!riskAssessment) return [];

    return [
      { id: "responsibleOperation", label: "Responsible Operation", grade: riskAssessment.responsibleOperation },
      { id: "corruptionEthics", label: "Corruption & Ethics", grade: riskAssessment.corruptionEthics },
    ];
  };

  // Loading state
  if (projectLoading || riskAssessmentLoading) {
    return (
      <div className="container py-8 px-4 mx-auto">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Loading project data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (projectError || riskAssessmentError || !project || !riskAssessment) {
    return (
      <div className="container py-8 px-4 mx-auto">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Error loading project data</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="mb-6">
        <Link href="/project-gallery">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>
      </div>

      <RiskOverviewCard project={project} riskAssessment={riskAssessment} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Environment Card */}
        <RiskCategoryCard
          title="Environment"
          metrics={getEnvironmentMetrics()}
          insights={environmentInsights}
          onGenerateInsights={() => {
            if (!hasOpenAIKey) {
              toast({
                title: "API Key Required",
                description: "OpenAI API key is required to generate insights. Please add it in your environment variables.",
                variant: "destructive",
              });
              return;
            }
            fetchEnvironmentInsights();
          }}
          isLoading={environmentLoading}
          error={environmentError}
        />

        {/* Social Card */}
        <RiskCategoryCard
          title="Social"
          metrics={getSocialMetrics()}
          insights={socialInsights}
          onGenerateInsights={() => {
            if (!hasOpenAIKey) {
              toast({
                title: "API Key Required",
                description: "OpenAI API key is required to generate insights. Please add it in your environment variables.",
                variant: "destructive",
              });
              return;
            }
            fetchSocialInsights();
          }}
          isLoading={socialLoading}
          error={socialError}
        />

        {/* Governance Card */}
        <RiskCategoryCard
          title="Governance"
          metrics={getGovernanceMetrics()}
          insights={governanceInsights}
          onGenerateInsights={() => {
            if (!hasOpenAIKey) {
              toast({
                title: "API Key Required",
                description: "OpenAI API key is required to generate insights. Please add it in your environment variables.",
                variant: "destructive",
              });
              return;
            }
            fetchGovernanceInsights();
          }}
          isLoading={governanceLoading}
          error={governanceError}
        />
      </div>
    </div>
  );
}