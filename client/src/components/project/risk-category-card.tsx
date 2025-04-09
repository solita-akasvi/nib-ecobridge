import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger, 
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getGradeColor, GradeType } from "@/lib/assessment-data";

interface RiskMetricProps {
  id: string;
  label: string;
  grade: GradeType;
  onClick: (id: string) => void;
}

function RiskMetric({ id, label, grade, onClick }: RiskMetricProps) {
  return (
    <div 
      className="flex justify-between py-1.5 px-1 border-b last:border-0 cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(id)}
    >
      <span className="text-sm">{label}</span>
      <Badge 
        variant="outline" 
        className={`font-bold ${getGradeColor(grade).text} ${getGradeColor(grade).bg}`}
      >
        {grade || 'N/A'}
      </Badge>
    </div>
  );
}

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  const handleMetricClick = (id: string) => {
    setSelectedMetric(id);
    setDialogOpen(true);
  };
  
  // Source links with evidence
  const sourceLinks = {
    A: [
      { name: "GHG Protocol", url: "https://ghgprotocol.org/", evidence: "Best practice guidelines for carbon accounting" },
      { name: "IRENA", url: "https://www.irena.org/", evidence: "Renewable energy technology assessments" },
      { name: "IEA", url: "https://www.iea.org/", evidence: "Global energy transition analysis" }
    ],
    B: [
      { name: "ESG Reports", url: "https://www.arabfund.org/", evidence: "Financial institution ESG requirements" },
      { name: "CDM", url: "https://cdm.unfccc.int/", evidence: "Clean Development Mechanism projects" },
      { name: "UNEP FI", url: "https://www.unepfi.org/", evidence: "Sustainable finance principles" }
    ],
    C: [
      { name: "Moroccan Law", url: "https://www.environnement.gov.ma/fr/", evidence: "Environmental regulations in Morocco" },
      { name: "GCF", url: "https://www.greenclimate.fund/", evidence: "Climate financing conditions" },
      { name: "MASEN", url: "https://www.masen.ma/", evidence: "Moroccan renewable energy standards" }
    ],
    D: [
      { name: "Transparency", url: "https://www.transparency.org/en/countries/morocco", evidence: "Governance risk assessment for Morocco" },
      { name: "IFC Standards", url: "https://www.ifc.org/", evidence: "Performance standards for project finance" },
      { name: "World Bank", url: "https://www.worldbank.org/", evidence: "Development project safeguards" }
    ]
  };
  
  const getDetailedInsight = (metricId: string) => {
    // Find the metric label for reference
    const metricLabel = metrics.find(m => m.id === metricId)?.label || '';
    const metricGrade = metrics.find(m => m.id === metricId)?.grade || '';
    
    switch(metricGrade) {
      case 'A':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Comprehensive third-party verification of energy performance metrics</li>
                <li>Multi-year trend analysis showing continuous improvement</li>
                <li>Benchmark comparison against global best-in-class projects</li>
                <li>Independent monitoring and validation of efficiency metrics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Key Findings</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3 py-1.5 bg-green-50 rounded-r">
                  <strong>Industry leading performance:</strong> Exceeds international benchmarks with documented evidence from IRENA
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-1.5 bg-green-50 rounded-r">
                  <strong>Exceptional disclosures:</strong> Comprehensive public reporting aligned with GHG Protocol
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-1.5 bg-green-50 rounded-r">
                  <strong>Verified carbon reduction:</strong> Third-party validated emissions reduction with clear methodology
                </div>
              </div>
            </div>
            
            {/* Evidence Sources section removed as requested */}
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Share best practices with industry partners and stakeholders</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Continue current approach with minor enhancements to reporting</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Consider leadership role in developing sector standards</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'B':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Primary data analysis using industry-standard metrics</li>
                <li>Comparative analysis with similar projects in region</li>
                <li>Review of management systems and operational procedures</li>
                <li>Stakeholder interviews and documentation review</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Key Findings</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3 py-1.5 bg-blue-50 rounded-r">
                  <strong>Robust monitoring system:</strong> Established procedures for tracking performance against CDM standards
                </div>
                <div className="border-l-4 border-blue-500 pl-3 py-1.5 bg-blue-50 rounded-r">
                  <strong>Above average reporting:</strong> Regular disclosure exceeding minimum requirements
                </div>
                <div className="border-l-4 border-blue-500 pl-3 py-1.5 bg-blue-50 rounded-r">
                  <strong>Strong policy foundation:</strong> Well-developed internal policies aligned with UNEP FI guidelines
                </div>
              </div>
            </div>
            
            {/* Evidence Sources removed as requested */}
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Strengthen third-party verification processes</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Enhance data collection consistency across operations</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Implement identified improvement opportunities within 6 months</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Increase transparency in sustainability reporting</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'C':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gap analysis against minimum regulatory requirements</li>
                <li>Review of documented incidents and non-compliance records</li>
                <li>Assessment of current management response to identified issues</li>
                <li>Evaluation of improvement plans and implementation status</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Key Findings</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-amber-500 pl-3 py-1.5 bg-amber-50 rounded-r">
                  <strong>Compliance gaps:</strong> Multiple instances of non-compliance with Moroccan environmental regulations
                </div>
                <div className="border-l-4 border-amber-500 pl-3 py-1.5 bg-amber-50 rounded-r">
                  <strong>Limited transparency:</strong> Insufficient public disclosure of performance data
                </div>
                <div className="border-l-4 border-amber-500 pl-3 py-1.5 bg-amber-50 rounded-r">
                  <strong>Reactive management:</strong> Response to issues occurs after regulatory intervention
                </div>
              </div>
            </div>
            
            {/* Evidence Sources section removed as requested */}
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Conduct comprehensive compliance audit within 30 days</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Develop remediation plan with clear timelines and responsibilities</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Implement monthly management review of progress</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Enhance training and awareness for operational staff</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'D':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Forensic analysis of historical performance and compliance</li>
                <li>Critical incident investigation and root cause analysis</li>
                <li>Review of enforcement actions and regulatory notices</li>
                <li>Stakeholder and affected community interviews</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Key Findings</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-3 py-1.5 bg-red-50 rounded-r">
                  <strong>Significant non-compliance:</strong> Systematic violations of core requirements per Transparency International assessment
                </div>
                <div className="border-l-4 border-red-500 pl-3 py-1.5 bg-red-50 rounded-r">
                  <strong>Absence of controls:</strong> No effective management systems for IFC Performance Standards compliance
                </div>
                <div className="border-l-4 border-red-500 pl-3 py-1.5 bg-red-50 rounded-r">
                  <strong>Financial governance:</strong> Forensic accounting analysis by Transparency International of climate financing allocated to the project, revealing significant discrepancies
                </div>
              </div>
            </div>
            
            {/* Evidence Sources section removed as requested */}
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Immediately suspend high-risk activities pending implementation of controls</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Develop comprehensive transformation plan with third-party verification</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Allocate significant resources for remediation and system redesign</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Implement weekly executive review process with clear accountability</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Engage proactively with regulators and affected stakeholders</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>No detailed assessment is available for {metricLabel}.</div>;
    }
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
              <h4 className="text-sm font-medium mb-2">AI Summary</h4>
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
                        let content = parts.slice(1).join(':').trim();
                        // Remove confidence percentages if they exist
                        content = content.replace(/\(confidence: \d+%\)/g, '').trim();
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
            <DialogTitle className="text-xl font-semibold">
              {title} Risk Assessment
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
                      {insights ? (
                        getDetailedInsight(metric.id)
                      ) : (
                        <p className="text-gray-500 italic py-4 text-center">
                          Click "Generate Insights" to see detailed assessment for this category.
                        </p>
                      )}
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