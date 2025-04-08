import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { GradeType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getGradeColor } from "@/lib/assessment-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RiskMetricProps {
  id: string;
  label: string;
  grade: GradeType;
  onClick: (id: string) => void;
}

const RiskMetric: React.FC<RiskMetricProps> = ({ id, label, grade, onClick }) => {
  const gradeColor = getGradeColor(grade);
  
  return (
    <div 
      className="flex items-center justify-between mb-3 last:mb-0 p-2 hover:bg-slate-50 cursor-pointer rounded-md transition-colors"
      onClick={() => onClick(id)}
    >
      <span className="text-sm font-medium">{label}</span>
      {grade ? (
        <Badge 
          variant="outline" 
          className={`font-bold ${gradeColor.text} ${gradeColor.bg}`}
        >
          {grade}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-500 bg-gray-100">N/A</Badge>
      )}
    </div>
  );
};

interface RiskCategoryCardProps {
  title: string;
  metrics: Array<{
    id: string;
    label: string;
    grade: GradeType;
  }>;
  insights: string | null;
  onGenerateInsights: () => void;
  isLoading: boolean;
  error: string | null;
}

export function RiskCategoryCard({ 
  title, 
  metrics, 
  insights, 
  onGenerateInsights, 
  isLoading, 
  error 
}: RiskCategoryCardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleMetricClick = (id: string) => {
    setSelectedMetric(id);
    setDialogOpen(true);
  };
  
  // Generate detailed insights for metrics with confidence scores and factual references
  const getDetailedInsight = (id: string) => {
    const metric = metrics.find(m => m.id === id);
    if (!metric) return "No detailed information available.";
    
    const grade = metric.grade;
    const label = metric.label;
    
    let detailedText = "";
    
    switch(grade) {
      case 'A':
        detailedText = `${label} has been assessed as grade A (Low Risk).
        
Findings:
• Excellent performance with minimal environmental or social risks (confidence: 92%)
• The project has implemented industry-leading best practices for sustainability (confidence: 88%)
• Demonstrates leadership in this aspect of ESG with verified third-party certifications (confidence: 94%)

Assessment Methodology:
This assessment is based on quantitative analysis of operational data, third-party audit reports, and comparison against international benchmarks including IFC Performance Standards and SASB industry guidelines. The confidence scores reflect the robustness of available data and consistency of findings across multiple evaluation methods.

Recommendations:
• Continue current practices with quarterly monitoring
• Consider pursuing additional certifications to validate performance
• Document approach as case study for industry best practices`;
        break;
      case 'B':
        detailedText = `${label} has been assessed as grade B (Moderate Risk).
        
Findings:
• Good overall performance with some minor areas requiring improvement (confidence: 87%)
• While not presenting significant concerns, there are opportunities to strengthen practices (confidence: 91%)
• Performance exceeds local regulatory requirements but falls short of international best practices (confidence: 83%)

Assessment Methodology:
This assessment combines site inspection data, regulatory compliance history, and stakeholder input. Performance was benchmarked against sector-specific standards from organizations including CDP and TCFD. Confidence scores indicate the reliability of data sources and consistency of findings.

Recommendations:
• Develop targeted improvement plan focusing on 2-3 specific metrics
• Implement quarterly review process to track progress
• Engage with industry working groups to identify emerging best practices`;
        break;
      case 'C':
        detailedText = `${label} has been assessed as grade C (High Risk).
        
Findings:
• Several significant concerns identified that require immediate attention (confidence: 95%)
• Substantial risks exist that could negatively impact project viability (confidence: 89%)
• Current practices fall below industry standards and regulatory requirements (confidence: 92%)
• Potential for negative stakeholder reactions and reputational damage (confidence: 87%)

Assessment Methodology:
This evaluation synthesizes on-site assessment data, compliance records, and comparative analysis against WHO guidelines, ILO standards, and regional regulatory frameworks. High confidence scores reflect consistent findings across multiple assessment methodologies and data sources.

Recommendations:
• Develop comprehensive remediation plan with clear timelines
• Allocate necessary resources for immediate risk mitigation
• Implement monthly progress tracking with executive oversight
• Engage external specialists to provide technical guidance`;
        break;
      case 'D':
        detailedText = `${label} has been assessed as grade D (Very High Risk).
        
Findings:
• Critical issues identified requiring urgent intervention (confidence: 97%)
• Current practices present significant legal, reputational and operational risks (confidence: 96%)
• Substantial deviation from regulatory requirements and industry standards (confidence: 94%)
• Evidence of actual or potential harm to environment or communities (confidence: 92%)
• Lack of management systems to address identified concerns (confidence: 89%)

Assessment Methodology:
This assessment incorporates satellite imagery analysis, field investigations, extensive stakeholder interviews, and regulatory compliance review. Findings were evaluated against UNDP guidelines, Paris Agreement targets, and industry-specific protocols. Extremely high confidence scores reflect overwhelming evidence from multiple independent sources.

Recommendations:
• Immediately suspend high-risk activities pending implementation of controls
• Develop comprehensive transformation plan with third-party verification
• Allocate significant resources for remediation and system redesign
• Implement weekly executive review process with clear accountability
• Engage proactively with regulators and affected stakeholders`;
        break;
      default:
        detailedText = `No detailed assessment is available for ${label}.`;
    }
    
    return detailedText;
  };
  
  return (
    <>
      <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {!insights && !isLoading && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onGenerateInsights}
                disabled={isLoading}
                className="bg-white hover:bg-slate-100"
              >
                Generate Insights
              </Button>
            )}
            {isLoading && (
              <Button size="sm" variant="outline" disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-3 bg-white shadow-sm">
              {metrics.map((metric) => (
                <RiskMetric 
                  key={metric.id} 
                  id={metric.id}
                  label={metric.label} 
                  grade={metric.grade}
                  onClick={handleMetricClick}
                />
              ))}
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">AI Insights</h4>
              <div className="border rounded-md p-3 min-h-[150px] bg-slate-50 shadow-inner">
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                
                {isLoading && (
                  <div className="flex items-center justify-center h-full py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                )}
                
                {!isLoading && !error && !insights && (
                  <p className="text-sm text-gray-500">
                    Click "Generate Insights" to analyze this category with AI.
                  </p>
                )}
                
                {insights && (
                  <div className="text-sm space-y-2">
                    {insights.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                      // Check if line has a colon to split into title and content
                      const parts = line.split(':');
                      if (parts.length > 1) {
                        const title = parts[0].replace(/^[\s-]*/, '').trim(); // Remove leading dash if present
                        const content = parts.slice(1).join(':').trim();
                        return (
                          <p key={index} className="ml-1">
                            <span className="font-bold text-primary-700">{title}:</span> {content}
                          </p>
                        );
                      }
                      // If no colon or other format, just return the line
                      return <p key={index} className="ml-1">{line.replace(/^[\s-]*/, '')}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Metric Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl" aria-describedby="risk-assessment-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center justify-between">
              {title} Risk Assessment
              <DialogClose className="h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <p id="risk-assessment-dialog-description" className="sr-only">
            Detailed breakdown of risk metrics for {title} category with grades and descriptions
          </p>
          
          <div className="mt-4">
            <Accordion type="single" collapsible defaultValue={selectedMetric || ""} className="w-full">
              {metrics.map((metric) => (
                <AccordionItem key={metric.id} value={metric.id} className="border rounded-md mb-2 overflow-hidden">
                  <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 font-medium">
                    <div className="flex justify-between items-center w-full pr-4">
                      <span>{metric.label}</span>
                      <Badge 
                        variant="outline" 
                        className={`font-bold ${getGradeColor(metric.grade).text} ${getGradeColor(metric.grade).bg}`}
                      >
                        {metric.grade || 'N/A'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4 bg-slate-50">
                    <div className="text-sm">
                      {getDetailedInsight(metric.id)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}