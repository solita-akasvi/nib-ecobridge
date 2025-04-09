import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { COUNTRIES, CATEGORIES, PROJECT_SIZES } from "@/lib/data";
import { RISK_CATEGORIES, getGradeColor, getGradeLabel } from "@/lib/assessment-data";
import { GradeType, Project, ProjectFormData, RiskAssessment, RiskCategory } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, ChevronRightIcon, ChevronLeftIcon, CheckIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form schema for project details
const formSchema = z.object({
  name: z.string().min(3, "Project name is required"),
  description: z.string().min(10, "Please provide a description (min 10 characters)"),
  country: z.string().min(1, "Country is required"),
  category: z.string().min(1, "Category is required"),
  size: z.string().min(1, "Project size is required"),
  region: z.string().optional(),
});

interface AssessmentFormProps {
  onAssessmentComplete: (data: { project: Project; riskAssessment: RiskAssessment }) => void;
}

export default function AssessmentForm({ onAssessmentComplete }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectFormData | null>(null);
  const [categories, setCategories] = useState<RiskCategory[]>(
    RISK_CATEGORIES.map(cat => ({ ...cat, grade: "" as GradeType }))
  );

  // Form for project details
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      country: "",
      category: "",
      size: "",
      region: "",
    },
  });

  // Mutation for creating a project and risk assessment
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      // Create the project
      const project = await apiRequest<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Calculate overall score and grade
      const overallScore = Math.round(
        categories.reduce((sum, cat) => {
          const gradeValue = cat.grade === "A" ? 4 : cat.grade === "B" ? 3 : cat.grade === "C" ? 2 : cat.grade === "D" ? 1 : 0;
          return sum + gradeValue;
        }, 0) / categories.length * 100
      );
      
      const overallGrade: GradeType = 
        overallScore >= 75 ? "A" : 
        overallScore >= 50 ? "B" : 
        overallScore >= 25 ? "C" : "D";
      
      // Create category notes
      const lowGradeCategories = categories
        .filter(cat => cat.grade === "C" || cat.grade === "D")
        .map(cat => cat.title)
        .join(", ");
      
      const overallNotes = lowGradeCategories.length > 0 
        ? `This project has significant ESG concerns in the following areas: ${lowGradeCategories}. Consider implementing mitigation strategies in these categories.` 
        : "This project demonstrates good ESG practices overall. Continue to monitor and improve performance in all categories.";
      
      // Calculate separate E, S, G grades
      const environmentalCategories = categories.slice(0, 6); // First 6 are environmental (including Climate Risk)
      const socialCategories = categories.slice(6, 9); // Next 3 are social
      const governanceCategories = categories.slice(9); // Last 2 are governance
      
      const calcAvgGrade = (cats: RiskCategory[]): string => {
        const avg = cats.reduce((sum, cat) => {
          const gradeValue = cat.grade === "A" ? 4 : cat.grade === "B" ? 3 : cat.grade === "C" ? 2 : cat.grade === "D" ? 1 : 0;
          return sum + gradeValue;
        }, 0) / cats.length;
        
        return avg >= 3.5 ? "A" : avg >= 2.5 ? "B" : avg >= 1.5 ? "C" : "D";
      };
      
      const environmentGrade = calcAvgGrade(environmentalCategories);
      const socialGrade = calcAvgGrade(socialCategories);
      const governanceGrade = calcAvgGrade(governanceCategories);
      
      // Determine risk level
      const riskLevel = 
        overallGrade === "A" ? "Low" : 
        overallGrade === "B" ? "Moderate" : 
        overallGrade === "C" ? "High" : "Very High";
      
      // Create the risk assessment
      const riskAssessmentData = {
        projectId: project.id,
        // Add grades for each category
        projectType: categories[0].grade,
        energyUse: categories[1].grade,
        resourceUse: categories[2].grade,
        pollutionWaste: categories[3].grade,
        biodiversityImpact: categories[4].grade,
        climateRisk: categories[5].grade,
        laborPractices: categories[6].grade,
        communityImpact: categories[7].grade,
        humanRights: categories[8].grade,
        responsibleOperation: categories[9].grade,
        corruptionEthics: categories[10].grade,
        overallGrade,
        overallScore,
        riskLevel,
        overallNotes,
      };
      
      const riskAssessment = await apiRequest<RiskAssessment>("/api/risk-assessments", {
        method: "POST",
        body: JSON.stringify(riskAssessmentData),
      });
      
      // Update the project with calculated grades and risk level
      const updatedProject = await apiRequest<Project>(`/api/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          environmentGrade,
          socialGrade,
          governanceGrade,
          riskScore: overallScore,
          riskLevel,
        }),
      });
      
      return {
        project: updatedProject,
        riskAssessment,
      };
    },
    onSuccess: (data) => {
      // Toast notification
      toast({
        title: "Assessment completed successfully",
        description: "Your ESG risk assessment has been created.",
      });
      
      // Pass data back to parent component
      onAssessmentComplete(data);
    },
    onError: (error) => {
      console.error("Error creating assessment:", error);
      toast({
        title: "Error creating assessment",
        description: "There was a problem creating your assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission (first step)
  function onSubmitProjectDetails(values: z.infer<typeof formSchema>) {
    setProjectData(values);
    setCurrentStep(2);
  }

  // Handle grade change for a category
  const handleGradeChange = (categoryId: string, grade: GradeType) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, grade } : cat
      )
    );
  };

  // Check if all categories have grades
  const allCategoriesGraded = categories.every((cat) => cat.grade !== "");

  // Handle final submission
  const handleSubmitAssessment = () => {
    if (!projectData) return;
    
    // Submit the data
    createProjectMutation.mutate(projectData);
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Group categories by type
  const environmentalCategories = categories.slice(0, 6); // First 6 are environmental (including Climate Risk)
  const socialCategories = categories.slice(6, 9); // Next 3 are social
  const governanceCategories = categories.slice(9); // Last 2 are governance

  // Helper to render grade selector
  const renderGradeSelector = (category: RiskCategory) => {
    return (
      <RadioGroup
        value={category.grade}
        onValueChange={(value) => handleGradeChange(category.id, value as GradeType)}
        className="flex space-x-2"
      >
        {["A", "B", "C", "D"].map((grade) => (
          <div key={grade} className="flex flex-col items-center">
            <RadioGroupItem
              value={grade}
              id={`${category.id}-${grade}`}
              className={`peer sr-only`}
            />
            <label
              htmlFor={`${category.id}-${grade}`}
              className={`
                flex h-10 w-10 cursor-pointer items-center justify-center rounded-full
                border-2 font-medium transition-colors
                ${category.grade === grade 
                  ? `ring-2 ring-offset-2 ${getGradeColor(grade as GradeType).bg} ${getGradeColor(grade as GradeType).text}` 
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                }
              `}
            >
              {grade}
            </label>
            <span className="mt-1 text-xs text-neutral-500">
              {grade === "A" ? "Low" : grade === "B" ? "Moderate" : grade === "C" ? "High" : "Very High"}
            </span>
          </div>
        ))}
      </RadioGroup>
    );
  };

  // Render a category assessment section
  const renderCategoryAssessment = (category: RiskCategory) => {
    return (
      <div key={category.id} className="mb-6 pb-6 border-b border-neutral-200 last:border-none">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium">{category.title}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-8 h-8 p-0 ml-1">
                    <InfoIcon className="h-4 w-4" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>{category.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {category.grade && (
              <Badge className={`ml-2 ${getGradeColor(category.grade).bg} ${getGradeColor(category.grade).text}`}>
                {getGradeLabel(category.grade)}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-neutral-600 mb-4">{category.description}</p>
        
        <div className="flex flex-col">
          <p className="text-sm font-medium mb-2">Risk Level:</p>
          {renderGradeSelector(category)}
        </div>
      </div>
    );
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Enter the basic information about your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitProjectDetails)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Sustainable Energy Initiative" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Western Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_SIZES.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a brief description of your project..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Next Step
                      <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
        
      case 2:
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant="outline" className="mb-2">Environmental Factors</Badge>
                  <CardTitle>Environmental Assessment</CardTitle>
                  <CardDescription>
                    Evaluate the environmental impact of your project
                  </CardDescription>
                </div>
                <div className="text-sm text-neutral-500">
                  Step 2 of 4
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {environmentalCategories.map(renderCategoryAssessment)}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={environmentalCategories.some(cat => cat.grade === "")}
                >
                  Next Step
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 3:
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant="outline" className="mb-2">Social Factors</Badge>
                  <CardTitle>Social Impact Assessment</CardTitle>
                  <CardDescription>
                    Evaluate the social impact of your project
                  </CardDescription>
                </div>
                <div className="text-sm text-neutral-500">
                  Step 3 of 4
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {socialCategories.map(renderCategoryAssessment)}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)}
                  disabled={socialCategories.some(cat => cat.grade === "")}
                >
                  Next Step
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 4:
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant="outline" className="mb-2">Governance Factors</Badge>
                  <CardTitle>Governance Assessment</CardTitle>
                  <CardDescription>
                    Evaluate the governance aspects of your project
                  </CardDescription>
                </div>
                <div className="text-sm text-neutral-500">
                  Step 4 of 4
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {governanceCategories.map(renderCategoryAssessment)}
              
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-medium mb-4">Review and Submit</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium mb-1">Environmental</p>
                    <p className={`text-lg font-semibold ${
                      environmentalCategories.some(cat => cat.grade === "") 
                        ? 'text-neutral-400' 
                        : getGradeColor(
                          environmentalCategories.every(cat => cat.grade) 
                            ? 'A' 
                            : environmentalCategories.some(cat => cat.grade === 'D') 
                              ? 'D' 
                              : 'B'
                        ).text
                    }`}>
                      {environmentalCategories.every(cat => cat.grade) 
                        ? environmentalCategories.some(cat => cat.grade === 'D') 
                          ? 'High Risk' 
                          : 'Low Risk'
                        : 'Incomplete'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Social</p>
                    <p className={`text-lg font-semibold ${
                      socialCategories.some(cat => cat.grade === "") 
                        ? 'text-neutral-400' 
                        : getGradeColor(
                          socialCategories.every(cat => cat.grade) 
                            ? 'A' 
                            : socialCategories.some(cat => cat.grade === 'D') 
                              ? 'D' 
                              : 'B'
                        ).text
                    }`}>
                      {socialCategories.every(cat => cat.grade) 
                        ? socialCategories.some(cat => cat.grade === 'D') 
                          ? 'High Risk' 
                          : 'Low Risk'
                        : 'Incomplete'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Governance</p>
                    <p className={`text-lg font-semibold ${
                      governanceCategories.some(cat => cat.grade === "") 
                        ? 'text-neutral-400' 
                        : getGradeColor(
                          governanceCategories.every(cat => cat.grade) 
                            ? 'A' 
                            : governanceCategories.some(cat => cat.grade === 'D') 
                              ? 'D' 
                              : 'B'
                        ).text
                    }`}>
                      {governanceCategories.every(cat => cat.grade) 
                        ? governanceCategories.some(cat => cat.grade === 'D') 
                          ? 'High Risk' 
                          : 'Low Risk'
                        : 'Incomplete'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeftIcon className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleSubmitAssessment}
                    disabled={!allCategoriesGraded || createProjectMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createProjectMutation.isPending ? (
                      <div className="flex items-center">
                        <span className="loading loading-spinner loading-xs mr-2"></span>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Complete Assessment
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">ESG Assessment Form</h2>
            <div className="text-sm text-neutral-500">
              Step {currentStep} of 4
            </div>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex bg-neutral-200 rounded">
                <div
                  style={{ width: `${currentStep * 25}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-600 mt-1">
                <div className={currentStep >= 1 ? "text-primary font-medium" : ""}>Project Details</div>
                <div className={currentStep >= 2 ? "text-primary font-medium" : ""}>Environmental</div>
                <div className={currentStep >= 3 ? "text-primary font-medium" : ""}>Social</div>
                <div className={currentStep >= 4 ? "text-primary font-medium" : ""}>Governance</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}