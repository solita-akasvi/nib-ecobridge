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
  
  // Generate sample detailed insights for metrics (later this will come from API)
  const getDetailedInsight = (id: string) => {
    const metric = metrics.find(m => m.id === id);
    if (!metric) return "No detailed information available.";
    
    const grade = metric.grade;
    const label = metric.label;
    
    let detailedText = "";
    
    switch(grade) {
      case 'A':
        detailedText = `${label} has been assessed as grade A (Low Risk). This indicates excellent performance in this area with minimal environmental or social risks. The project has implemented best practices and demonstrates leadership in this aspect of ESG.`;
        break;
      case 'B':
        detailedText = `${label} has been assessed as grade B (Moderate Risk). This indicates good performance with some minor areas for improvement. While not presenting significant concerns, there are opportunities to strengthen practices in this area.`;
        break;
      case 'C':
        detailedText = `${label} has been assessed as grade C (High Risk). This indicates several significant concerns that require attention. There are substantial risks in this area that need to be addressed to improve the project's overall ESG profile.`;
        break;
      case 'D':
        detailedText = `${label} has been assessed as grade D (Very High Risk). This indicates serious concerns with major risks identified. Immediate action is recommended to address fundamental issues in this area that could impact the overall viability of the project.`;
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
                  <div className="text-sm whitespace-pre-line">{insights}</div>
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
            <Accordion type="single" collapsible className="w-full">
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