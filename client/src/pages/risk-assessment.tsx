import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import AssessmentForm from "@/components/dashboard/assessment-form";
import RiskVisualization from "@/components/dashboard/risk-visualization";
import { Project, RiskAssessment } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RiskAssessmentPage() {
  const [assessmentResult, setAssessmentResult] = useState<{ 
    project: Project; 
    riskAssessment: RiskAssessment 
  } | null>(null);
  
  const handleAssessmentComplete = (data: { project: Project; riskAssessment: RiskAssessment }) => {
    setAssessmentResult(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const startNewAssessment = () => {
    setAssessmentResult(null);
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
                Evaluate the sustainability risks for your projects using our structured grading system
              </p>
            </div>
          </div>

          {assessmentResult ? (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-neutral-800">Assessment Results</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startNewAssessment}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> New Assessment
                  </Button>
                </div>
                <RiskVisualization 
                  project={assessmentResult.project} 
                  riskAssessment={assessmentResult.riskAssessment}
                />
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-medium text-neutral-800 mb-4">How to Use This Tool</h2>
                <div className="prose prose-neutral max-w-none">
                  <p>
                    This step-by-step assessment tool helps you evaluate the ESG risks of your project using a 
                    standardized A-D grading system:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 font-medium text-sm mr-2">A</span>
                      <span>Low risk - Excellent ESG performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm mr-2">B</span>
                      <span>Moderate risk - Good ESG performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mr-2">C</span>
                      <span>High risk - Fair ESG performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-800 font-medium text-sm mr-2">D</span>
                      <span>Very high risk - Poor ESG performance</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    Complete all sections for a comprehensive analysis of your project's ESG risks and receive 
                    tailored improvement suggestions.
                  </p>
                </div>
              </div>
              
              <AssessmentForm onAssessmentComplete={handleAssessmentComplete} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
