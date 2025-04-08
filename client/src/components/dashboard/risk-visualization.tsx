import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { RiskAssessment, Project } from "@/types";
import { getLevelColor, getCategoryColor } from "@/lib/data";

interface RiskVisualizationProps {
  project: Project;
  riskAssessment: RiskAssessment;
}

export default function RiskVisualization({ 
  project, 
  riskAssessment 
}: RiskVisualizationProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation when component mounts or risk assessment changes
    setAnimate(false);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [riskAssessment]);
  
  const riskCategories = [
    { 
      name: "Political Risk", 
      score: riskAssessment.politicalRisk, 
      notes: riskAssessment.politicalNotes,
      level: getRiskLevel(riskAssessment.politicalRisk)
    },
    { 
      name: "Environmental Risk", 
      score: riskAssessment.environmentalRisk, 
      notes: riskAssessment.environmentalNotes,
      level: getRiskLevel(riskAssessment.environmentalRisk)
    },
    { 
      name: "Social/Community Risk", 
      score: riskAssessment.socialRisk, 
      notes: riskAssessment.socialNotes,
      level: getRiskLevel(riskAssessment.socialRisk)
    },
    { 
      name: "Regulatory/Permits Risk", 
      score: riskAssessment.regulatoryRisk, 
      notes: riskAssessment.regulatoryNotes,
      level: getRiskLevel(riskAssessment.regulatoryRisk)
    },
    { 
      name: "Supply Chain/Logistics Risk", 
      score: riskAssessment.supplyChainRisk, 
      notes: riskAssessment.supplyChainNotes,
      level: getRiskLevel(riskAssessment.supplyChainRisk)
    },
  ];
  
  function getRiskLevel(score: number): "Low" | "Medium" | "High" {
    if (score < 40) return "Low";
    if (score > 60) return "High";
    return "Medium";
  }
  
  const categoryColors = getCategoryColor(project.category);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-neutral-800">Risk Profile</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className={`${categoryColors.bg} ${categoryColors.text}`}>
            {project.country}
          </Badge>
          <Badge variant="outline" className={`${categoryColors.bg} ${categoryColors.text}`}>
            {project.category}
          </Badge>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-neutral-500 mb-4">{project.name}</h3>
      
      <div className="space-y-5 mb-8">
        {riskCategories.map((risk, index) => {
          const colors = getLevelColor(risk.level);
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-neutral-700">{risk.name}</span>
                  <Badge variant="outline" className={`ml-2 ${colors.bg} ${colors.text}`}>
                    {risk.level}
                  </Badge>
                </div>
                <span className="text-sm text-neutral-500">{risk.score}/100</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2.5">
                <div 
                  className={`${colors.barColor} h-2.5 rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: animate ? `${risk.score}%` : '0%' }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-neutral-500">{risk.notes}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Overall Risk Assessment</h4>
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-800">Risk Score</span>
            <span className={`text-lg font-semibold ${getLevelColor(riskAssessment.riskLevel).text}`}>
              {riskAssessment.riskLevel} ({riskAssessment.overallRisk}/100)
            </span>
          </div>
          <p className="text-sm text-neutral-600">{riskAssessment.overallNotes}</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button className="flex items-center">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
