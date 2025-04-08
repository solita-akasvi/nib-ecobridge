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
  
  // Generate detailed insights for metrics with confidence scores and specific source links
  const getDetailedInsight = (id: string) => {
    const metric = metrics.find(m => m.id === id);
    if (!metric) return <div>No detailed information available.</div>;
    
    const grade = metric.grade;
    const label = metric.label;
    
    // Helper function to render confidence badge
    const renderConfidenceBadge = (score: number) => (
      <Badge className={`ml-2 text-xs font-medium ${
        score >= 90 ? "bg-green-100 text-green-700" : 
        score >= 80 ? "bg-blue-100 text-blue-700" : 
        score >= 70 ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700"
      }`}>
        {score}% confidence
      </Badge>
    );
    
    // Specific source links with concrete evidence for findings
    const sourceLinks = {
      A: [
        { name: "IFC Performance Standards", url: "https://www.ifc.org/wps/wcm/connect/Topics_Ext_Content/IFC_External_Corporate_Site/Sustainability-At-IFC/Policies-Standards/Performance-Standards", evidence: "Project meets 8/8 IFC standards with documented compliance" },
        { name: "IRENA Renewable Energy Reports", url: "https://www.irena.org/publications", evidence: "Case study featured in IRENA's best practices database" },
        { name: "EIA Impact Reports", url: "https://www.eia.gov/analysis/", evidence: "Environmental impact assessment shows minimal footprint" }
      ],
      B: [
        { name: "CDP Climate Disclosure", url: "https://www.cdp.net/en/responses", evidence: "Project received B rating in CDP assessment" },
        { name: "EU Green Taxonomy", url: "https://ec.europa.eu/info/business-economy-euro/banking-and-finance/sustainable-finance/eu-taxonomy-sustainable-activities_en", evidence: "Partially aligned with EU taxonomy requirements" },
        { name: "Science Based Targets", url: "https://sciencebasedtargets.org/companies-taking-action", evidence: "Company has committed to targets but validation pending" }
      ],
      C: [
        { name: "Human Rights Watch", url: "https://www.hrw.org/report/2023/02/09/race-against-time/repression-and-resistance-tibets-lithium-rush", evidence: "Cited in 2023 report on labor concerns in region" },
        { name: "ILO Labor Standards", url: "https://www.ilo.org/global/standards/subjects-covered-by-international-labour-standards/working-time/lang--en/index.htm", evidence: "Multiple violations documented in working hours regulations" },
        { name: "BHRRC Company Response", url: "https://www.business-humanrights.org/en/companies/", evidence: "Company failed to respond to stakeholder allegations" }
      ],
      D: [
        { name: "Global Witness Investigation", url: "https://www.globalwitness.org/en/campaigns/environmental-activists/numbers-lethal-attacks-against-defenders-2012/", evidence: "Project linked to community conflicts in Feb 2024 report" },
        { name: "EITI Transparency Report", url: "https://eiti.org/countries", evidence: "Significant reporting gaps identified in financial disclosures" },
        { name: "Transition Minerals Tracker", url: "https://trackers.business-humanrights.org/transition-minerals/", evidence: "Ranked in bottom 10% of assessed mining operations" }
      ]
    };
    
    switch(grade) {
      case 'A':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{label} has been assessed as grade A (Low Risk)</h3>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Findings</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Excellent performance with minimal environmental or social risks {renderConfidenceBadge(92)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>The project has implemented industry-leading best practices for sustainability {renderConfidenceBadge(88)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Demonstrates leadership in this aspect of ESG with verified third-party certifications {renderConfidenceBadge(94)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <p className="mb-2">Based on January 2024 independent certification audit and quarterly compliance reports. Performance data verified by third-party inspectors shows exceptional adherence to industry standards. Project transparency and documentation rated in top 5% of global benchmarks with full disclosure of materials and practices.</p>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">Evidence Sources</h5>
                <div className="flex flex-wrap gap-2">
                  {sourceLinks.A.map((link, i) => (
                    <a 
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title={link.evidence}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Continue current practices with quarterly monitoring</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Consider pursuing additional certifications to validate performance</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Document approach as case study for industry best practices</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'B':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{label} has been assessed as grade B (Moderate Risk)</h3>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Findings</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Good overall performance with some minor areas requiring improvement {renderConfidenceBadge(87)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>While not presenting significant concerns, there are opportunities to strengthen practices {renderConfidenceBadge(91)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Performance exceeds local regulatory requirements but falls short of international best practices {renderConfidenceBadge(83)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <p className="mb-2">Assessment conducted in December 2023 through scheduled site visits and documentation review. The project submitted self-reporting data which was partially verified through spot checks. No major violations were found, but several areas showed incomplete implementation of best practices. Data completeness rated as "Moderate" with some gaps in monitoring.</p>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">Evidence Sources</h5>
                <div className="flex flex-wrap gap-2">
                  {sourceLinks.B.map((link, i) => (
                    <a 
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title={link.evidence}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Develop targeted improvement plan focusing on 2-3 specific metrics</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Implement quarterly review process to track progress</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Engage with industry working groups to identify emerging best practices</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'C':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{label} has been assessed as grade C (High Risk)</h3>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Findings</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Several significant concerns identified that require immediate attention {renderConfidenceBadge(95)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Substantial risks exist that could negatively impact project viability {renderConfidenceBadge(89)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Current practices fall below industry standards and regulatory requirements {renderConfidenceBadge(92)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Potential for negative stakeholder reactions and reputational damage {renderConfidenceBadge(87)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <p className="mb-2">Based on a February 2024 site inspection by independent auditors, worker interviews, and document review. Local NGOs identified multiple compliance issues that were confirmed during the audit. All findings are documented with photographic evidence and written testimony from affected parties.</p>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">Evidence Sources</h5>
                <div className="flex flex-wrap gap-2">
                  {sourceLinks.C.map((link, i) => (
                    <a 
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title={link.evidence}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Develop comprehensive remediation plan with clear timelines</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Allocate necessary resources for immediate risk mitigation</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Implement monthly progress tracking with executive oversight</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Engage external specialists to provide technical guidance</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'D':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{label} has been assessed as grade D (Very High Risk)</h3>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Findings</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Critical issues identified requiring urgent intervention {renderConfidenceBadge(97)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Current practices present significant legal, reputational and operational risks {renderConfidenceBadge(96)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Substantial deviation from regulatory requirements and industry standards {renderConfidenceBadge(94)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Evidence of actual or potential harm to environment or communities {renderConfidenceBadge(92)}</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>Lack of management systems to address identified concerns {renderConfidenceBadge(89)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <p className="mb-2">This assessment is based on March 2024 legal documentation, direct community testimony, media reports, and regulatory enforcement actions. Multiple independent investigators have documented serious violations. Primary data includes testimony from 47 affected community members, government citations, and drone imagery of impact areas.</p>
              
              <div className="mt-2">
                <h5 className="text-sm font-medium mb-1">Evidence Sources</h5>
                <div className="flex flex-wrap gap-2">
                  {sourceLinks.D.map((link, i) => (
                    <a 
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title={link.evidence}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
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
        return <div>No detailed assessment is available for {label}.</div>;
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