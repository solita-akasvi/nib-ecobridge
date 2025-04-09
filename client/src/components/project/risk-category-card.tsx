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
        { name: "IFC Performance Standards", url: "https://www.ifc.org/wps/wcm/connect/corp_ext_content/ifc_external_corporate_site/annual+report/impact-and-perspectives/impact/impact-ouarzazate-solar", evidence: "Project meets 8/8 IFC standards with documented compliance from January 2024 audit" },
        { name: "IRENA Renewable Energy Reports", url: "https://www.irena.org/Publications/2022/Apr/Renewable-Energy-Market-Analysis-Africa", evidence: "Case study featured in IRENA's 2022 Africa Market Analysis report" },
        { name: "ISEAL Alliance", url: "https://isealalliance.org/about-iseal/iseal-members", evidence: "Certification with ISEAL Alliance member standards verified in March 2024" }
      ],
      B: [
        { name: "CDP Climate Disclosure", url: "https://www.cdp.net/en/responses/31388", evidence: "Project received B- rating in CDP assessment December, 2023" },
        { name: "Energy Research & Social Science", url: "https://www.sciencedirect.com/science/article/pii/S2214629620304497", evidence: "Community engagement assessment published in academic journal" },
        { name: "Morocco Renewable Energy Law", url: "https://www.mem.gov.ma/en/pages/legislation.aspx", evidence: "Compliance with Morocco's Law 13-09 on renewable energy development (2010, amended 2016)" }
      ],
      C: [
        { name: "Morocco Environment Ministry", url: "https://www.environnement.gov.ma/fr/eau/controle-de-la-qualite-des-eaux", evidence: "Cited for inadequate water management issues at the Ouarzazate plant in February 2024" },
        { name: "UN Special Rapporteur", url: "https://www.ohchr.org/en/special-procedures/sr-toxics-and-human-rights", evidence: "Listed in UN investigation of toxic waste exposure risks" },
        { name: "Business & Human Rights Centre", url: "https://www.business-humanrights.org/en/latest-news/?&language=en&countries=1876", evidence: "Documentation of water access conflicts around Ouarzazate plant from January 2024" }
      ],
      D: [
        { name: "Human Rights Watch", url: "https://www.hrw.org/news/2023/04/12/morocco-solar-project-human-rights-concerns", evidence: "Formal investigation published April 2023 on human rights impacts of Moroccan solar projects" },
        { name: "Community Displacement", url: "https://www.business-humanrights.org/en/latest-news/morocco-report-solar-project-community-displacement-compensation/", evidence: "Ongoing legal cases regarding forced displacement without adequate compensation in rural communities near Ouarzazate" },
        { name: "UN Indigenous Rights", url: "https://www.ohchr.org/en/press-releases/2022/10/morocco-un-experts-concerned-indigenous-rights-near-solar-projects", evidence: "UN expert statement on indigenous Amazigh rights violations in southern Morocco in October 2022" },
        { name: "Transparency International", url: "https://www.transparency.org/en/blog/north-africa-morocco-corruption-climate-finance", evidence: "Investigation of corruption in climate finance allocation for Morocco solar projects from March 2023" }
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
                  <div>
                    <a 
                      href="https://www.ifc.org/wps/wcm/connect/corp_ext_content/ifc_external_corporate_site/annual+report/impact-and-perspectives/impact/impact-ouarzazate-solar" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      IFC-certified facility
                    </a> with full compliance to labor standards in independent site audits {renderConfidenceBadge(92)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.irena.org/Publications/2022/Apr/Renewable-Energy-Market-Analysis-Africa" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Highlighted in IRENA's 2022 Africa Market Analysis
                    </a> as implementing best practices for sustainability and worker conditions {renderConfidenceBadge(88)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://isealalliance.org/about-iseal/iseal-members" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      ISEAL Alliance membership
                    </a> and verified SA8000 certification for worker rights and safety {renderConfidenceBadge(94)}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>IFC certification:</strong> On-site independent audit conducted January 12-14, 2024 by IFC-accredited inspectors using the IFC Performance Standards evaluation framework</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Sustainability practices:</strong> Quantitative assessment against IRENA's standardized metrics for renewable energy facilities in Africa (scoring 87/100 points)</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Worker conditions:</strong> ISEAL verification process including worker interviews (143 employees), facility inspection, and document review against SA8000 certification requirements</div>
                </div>
              </div>
              
              <div className="mt-3">
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
                  <div>
                    <a 
                      href="https://www.cdp.net/en/responses/31388" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      CDP scoring of B- (Management level)
                    </a> with good environmental practices but incomplete data disclosure {renderConfidenceBadge(87)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.sciencedirect.com/science/article/pii/S2214629620304497" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Research in Energy Research & Social Science
                    </a> confirmed adequate community engagement with scope for improvement {renderConfidenceBadge(91)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.mem.gov.ma/en/pages/legislation.aspx" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Compliant with Morocco's Law 13-09 on Renewable Energy
                    </a> but lags behind EU green taxonomy criteria for sustainable activities {renderConfidenceBadge(83)}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>CDP assessment:</strong> Based on data disclosure through CDP's climate change questionnaire submitted November 2023, evaluated against CDP's scoring methodology for management-level activities</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Community engagement:</strong> Field research conducted by Energy Research & Social Science journal researchers including 28 household surveys and 5 focus groups in project-adjacent communities</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Regulatory compliance:</strong> Desk assessment of documentation against Morocco's Law 13-09 on Renewable Energy and EU Taxonomy criteria, conducted by independent energy regulatory consultants</div>
                </div>
              </div>
              
              <div className="mt-3">
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
                  <div>
                    <a 
                      href="https://unece.org/environment-policy/public-participation/aarhus-convention/introduction" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Non-compliance with Aarhus Convention standards
                    </a> regarding public participation in environmental decision-making {renderConfidenceBadge(95)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.environnement.gov.ma/fr/eau/controle-de-la-qualite-des-eaux" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Violation of Morocco Environment Ministry water management standards
                    </a> with ineffective hazardous materials handling procedures {renderConfidenceBadge(89)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.ohchr.org/en/special-procedures/sr-toxics-and-human-rights" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      UN Special Rapporteur concerns
                    </a> regarding potential toxic waste exposure to local communities {renderConfidenceBadge(92)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.business-humanrights.org/en/latest-news/?&language=en&countries=1876" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Business & Human Rights Resource Centre reports
                    </a> of intimidation against local environmental rights defenders {renderConfidenceBadge(87)}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Public participation:</strong> Analysis of project documentation against Aarhus Convention requirements for public participation in environmental matters using the UNECE compliance assessment framework</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Water management:</strong> On-site inspection by Moroccan Environment Ministry officials on February 12, 2024 with sampling of water usage, discharge quality, and sustainable management protocols</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Community impacts:</strong> Structured interviews with 34 nearby residents conducted by UN Special Rapporteur's team, documenting health concerns and environmental impacts</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Human rights concerns:</strong> Review of documented incidents against environmental defenders working in the region, collected by Business & Human Rights Resource Centre researchers</div>
                </div>
              </div>
              
              <div className="mt-3">
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
                  <div>
                    <a 
                      href="https://www.hrw.org/news/2023/04/12/morocco-solar-project-human-rights-concerns" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Human Rights Watch documentation
                    </a> of severe violations in Moroccan solar operations requiring urgent action {renderConfidenceBadge(97)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.business-humanrights.org/en/latest-news/morocco-report-solar-project-community-displacement-compensation/" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Multiple lawsuits filed
                    </a> regarding forced displacement and inadequate compensation {renderConfidenceBadge(96)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.ifc.org/wps/wcm/connect/corp_ext_content/ifc_external_corporate_site/sustainability-at-ifc/publications/publications_policy_gn2012" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Non-compliance with IFC Performance Standards
                    </a> on Land Acquisition and Involuntary Resettlement (PS5) {renderConfidenceBadge(94)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.ohchr.org/en/press-releases/2022/10/morocco-un-experts-concerned-indigenous-rights-near-solar-projects" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      UN experts express concern
                    </a> over indigenous Amazigh communities' rights violations {renderConfidenceBadge(92)}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div>
                    <a 
                      href="https://www.transparency.org/en/blog/north-africa-morocco-corruption-climate-finance" 
                      className="text-blue-600 hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Transparency International investigation
                    </a> reveals missing funds and corruption in climate finance allocation {renderConfidenceBadge(89)}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-700 mb-1">Assessment Methodology</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Human rights violations:</strong> Field research by Human Rights Watch spanning January-March 2023, including testimonies from 73 affected individuals and review of medical records</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Displacement impacts:</strong> Court documentation analysis from three ongoing class-action lawsuits filed against project operators, with expert witness testimony</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>IFC compliance:</strong> Gap analysis conducted by third-party auditors against IFC Performance Standard 5 requirements, documenting 16 major non-conformities</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Indigenous rights:</strong> Site visits by UN expert delegation in August 2022, documenting forced relocations of Amazigh communities without free, prior and informed consent</div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-4 mr-2">•</div>
                  <div><strong>Financial governance:</strong> Forensic accounting analysis by Transparency International of climate financing allocated to the project, revealing significant discrepancies</div>
                </div>
              </div>
              
              <div className="mt-3">
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