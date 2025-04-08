import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">
                ESG Resources
              </h1>
              <p className="mt-1 text-neutral-500">
                Access guides, datasets, and tools to support your sustainable infrastructure projects
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="guides" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guides">Guides & Best Practices</TabsTrigger>
              <TabsTrigger value="data">ESG Datasets</TabsTrigger>
              <TabsTrigger value="tools">Assessment Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ESG Implementation Guides</CardTitle>
                  <CardDescription>
                    Best practices for implementing sustainable projects in Global South countries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResourceCard
                      title="Community Engagement Framework"
                      description="Guidelines for effective stakeholder consultation in rural communities"
                      link="#"
                    />
                    <ResourceCard
                      title="Regulatory Navigation Guide"
                      description="Step-by-step approach to permitting for renewable energy projects"
                      link="#"
                    />
                    <ResourceCard
                      title="Environmental Impact Assessment"
                      description="Methods for conducting thorough environmental assessments"
                      link="#"
                    />
                    <ResourceCard
                      title="Risk Mitigation Strategies"
                      description="Practical risk management approaches for sustainability projects"
                      link="#"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ESG Data Sources</CardTitle>
                  <CardDescription>
                    Reliable datasets for ESG risk analysis and project planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResourceCard
                      title="World Bank Climate Data"
                      description="Comprehensive climate risk data for developing countries"
                      link="https://climateknowledgeportal.worldbank.org/"
                    />
                    <ResourceCard
                      title="ND-GAIN Country Index"
                      description="Country-level vulnerability and readiness indicators"
                      link="https://gain.nd.edu/our-work/country-index/"
                    />
                    <ResourceCard
                      title="UNDP Human Development Reports"
                      description="Social development metrics across Global South countries"
                      link="http://hdr.undp.org/"
                    />
                    <ResourceCard
                      title="Transparency International"
                      description="Corruption perception indices and governance data"
                      link="https://www.transparency.org/"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Specialized Assessment Tools</CardTitle>
                  <CardDescription>
                    Complementary tools for detailed sustainability analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResourceCard
                      title="GRESB Infrastructure Assessment"
                      description="Benchmarking tool for infrastructure sustainability performance"
                      link="https://gresb.com/infrastructure-asset-assessment/"
                    />
                    <ResourceCard
                      title="IFC Environmental & Social Performance Standards"
                      description="Framework for managing environmental and social risks"
                      link="https://www.ifc.org/performancestandards"
                    />
                    <ResourceCard
                      title="SASB Materiality Map"
                      description="Industry-specific sustainability disclosure topics"
                      link="https://materiality.sasb.org/"
                    />
                    <ResourceCard
                      title="SDG Impact Standards"
                      description="Guidelines for aligning investments with SDGs"
                      link="https://sdgimpact.undp.org/"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}

function ResourceCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
      <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        Access resource <ExternalLink className="ml-1 h-3.5 w-3.5" />
      </a>
    </div>
  );
}
