import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import RiskForm from "@/components/dashboard/risk-form";
import RiskVisualization from "@/components/dashboard/risk-visualization";
import { Project, RiskAssessment } from "@/types";

export default function RiskAssessmentPage() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentRiskAssessment, setCurrentRiskAssessment] = useState<RiskAssessment | null>(null);
  
  const handleAssessmentComplete = (data: { project: Project; riskAssessment: RiskAssessment }) => {
    setCurrentProject(data.project);
    setCurrentRiskAssessment(data.riskAssessment);
  };
  
  return (
    <>
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">
                ESG Risk Assessment Tool
              </h1>
              <p className="mt-1 text-neutral-500">
                Evaluate the sustainability risks for your projects in Global South countries
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-neutral-800 mb-4">Project Details</h2>
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
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">Enter Project Details</h3>
                  <p className="text-neutral-500 max-w-md">
                    Fill out the form on the left to generate a comprehensive risk assessment for your ESG project.
                  </p>
                  <div className="mt-6 space-y-4 text-left max-w-md">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-800">How it works:</h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-neutral-600 space-y-1">
                        <li>Enter basic information about your project</li>
                        <li>Our algorithm analyzes political, environmental, social, regulatory, and supply chain risks</li>
                        <li>Get a detailed risk profile with specific insights for your project type and location</li>
                        <li>Use the assessment to develop risk mitigation strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
