import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GradeType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getGradeColor } from "@/lib/assessment-data";

interface RiskMetricProps {
  label: string;
  grade: GradeType;
}

const RiskMetric: React.FC<RiskMetricProps> = ({ label, grade }) => {
  const gradeColor = getGradeColor(grade);
  
  return (
    <div className="flex items-center justify-between mb-3 last:mb-0">
      <span className="text-sm">{label}</span>
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
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {!insights && !isLoading && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onGenerateInsights}
              disabled={isLoading}
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
          <div className="border rounded-md p-3">
            {metrics.map((metric) => (
              <RiskMetric key={metric.id} label={metric.label} grade={metric.grade} />
            ))}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">AI Insights</h4>
            <div className="border rounded-md p-3 min-h-[150px] bg-slate-50">
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
  );
}