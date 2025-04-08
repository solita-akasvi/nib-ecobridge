import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import RiskForm from "@/components/dashboard/risk-form";
import RiskVisualization from "@/components/dashboard/risk-visualization";
import ProjectGallery from "@/components/dashboard/project-gallery";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Project, RiskAssessment } from "@/types";

export default function Dashboard() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentRiskAssessment, setCurrentRiskAssessment] = useState<RiskAssessment | null>(null);
  
  const handleAssessmentComplete = (data: { project: Project; riskAssessment: RiskAssessment }) => {
    setCurrentProject(data.project);
    setCurrentRiskAssessment(data.riskAssessment);
    // Invalidate projects cache to update the project gallery
    queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
  };
  
  return (
    <>
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">Dashboard</h1>
              <p className="mt-1 text-neutral-500">
                Monitor ESG risk assessment and explore sustainable projects in Global South countries
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button className="ml-3 flex items-center">
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" /> Add Project
              </Button>
            </div>
          </div>

          {/* Risk Assessment Tool Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-neutral-800 mb-4">ESG Risk Assessment</h2>
              <RiskForm onAssessmentComplete={handleAssessmentComplete} />
            </div>
            
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              {currentProject && currentRiskAssessment ? (
                <RiskVisualization 
                  project={currentProject} 
                  riskAssessment={currentRiskAssessment}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-300 mb-4"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18 9l-6-6-7 7" />
                    <path d="M14 10l4 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">No Risk Assessment Yet</h3>
                  <p className="text-neutral-500 max-w-md">
                    Fill out the form on the left to generate a comprehensive ESG risk assessment for your project.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Project Gallery Section */}
          <ProjectGallery />
        </div>
      </main>
    </>
  );
}
