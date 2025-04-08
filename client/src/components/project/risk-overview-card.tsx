import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Project, RiskAssessment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getGradeLabel } from "@/lib/assessment-data";

interface RiskOverviewCardProps {
  project: Project;
  riskAssessment: RiskAssessment;
}

export function RiskOverviewCard({ project, riskAssessment }: RiskOverviewCardProps) {
  // Calculate progress score - assuming 100 is max
  const progressScore = riskAssessment.overallScore ? Math.min(100, riskAssessment.overallScore) : 0;
  
  // Determine risk level from overall grade
  const riskLevel = getGradeLabel(riskAssessment.overallGrade);
  
  // Get appropriate color for risk level
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low Risk":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "Moderate Risk":
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
      case "High Risk":
        return { bg: "bg-orange-100", text: "text-orange-800" };
      case "Very High Risk":
        return { bg: "bg-red-100", text: "text-red-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };
  
  const riskLevelColors = getRiskLevelColor(riskLevel);
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
            <p className="text-gray-700 mb-4">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Country</h3>
                <p>{project.country}{project.region ? `, ${project.region}` : ''}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p>{project.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p>{project.size}</p>
              </div>
            </div>
          </div>
          
          <div className="min-w-[250px] flex flex-col items-center justify-center border rounded-lg p-4 shadow-md">
            <div className="mb-3 text-center">
              <div className="text-base font-medium text-gray-700 mb-2">Risk Level</div>
              <Badge className={`${riskLevelColors.bg} ${riskLevelColors.text} text-lg py-1.5 px-3 font-bold`}>
                {riskLevel}
              </Badge>
            </div>
            
            <div className="w-full mb-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Risk Score</span>
                <span className="font-bold">{progressScore.toFixed(0)}%</span>
              </div>
              <Progress value={progressScore} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 w-full mt-3 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500">Environment</div>
                <Badge variant="outline" className="bg-green-50 text-green-700 mt-1 w-full">
                  {project.environmentGrade || 'N/A'}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-gray-500">Social</div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 mt-1 w-full">
                  {project.socialGrade || 'N/A'}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-gray-500">Governance</div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 mt-1 w-full">
                  {project.governanceGrade || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}