import { GradeType, RiskCategory } from "@/types";

// Helper function to get color for a grade
export const getGradeColor = (grade: GradeType) => {
  switch (grade) {
    case "A":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      };
    case "B":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      };
    case "C":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
      };
    case "D":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
      };
    default:
      return {
        bg: "bg-neutral-100",
        text: "text-neutral-800",
        border: "border-neutral-200",
      };
  }
};

// Helper function to get label for a grade
export const getGradeLabel = (grade: GradeType) => {
  switch (grade) {
    case "A":
      return "Low Risk";
    case "B":
      return "Moderate Risk";
    case "C":
      return "High Risk";
    case "D":
      return "Very High Risk";
    default:
      return "Not Assessed";
  }
};

// Risk assessment categories
export const RISK_CATEGORIES: RiskCategory[] = [
  // Environmental Categories
  {
    id: "project_type",
    title: "Project Type",
    description: "Assess the inherent environmental impact of the project's primary activities.",
    tooltip: "Consider the core operations and whether they are environmentally intensive. Projects with higher environmental impact (e.g., mining, heavy industries) generally carry higher ESG risk than those with lower impact (e.g., education, healthcare).",
    grade: "" as GradeType,
  },
  {
    id: "energy_use",
    title: "Energy Use",
    description: "Evaluate energy consumption patterns and sources (renewable vs. non-renewable).",
    tooltip: "Consider energy efficiency measures, reliance on fossil fuels vs. renewables, and strategies to reduce energy consumption. Grade 'A' for highly efficient, mostly renewable energy use; 'D' for inefficient, fossil fuel-dependent operations with no improvement plans.",
    grade: "" as GradeType,
  },
  {
    id: "resource_use",
    title: "Resource Use",
    description: "Assess consumption of natural resources, recycling practices, and waste reduction.",
    tooltip: "Evaluate water use efficiency, material sourcing practices, recycling programs, and circular economy principles. Grade 'A' for circular, efficient resource use with extensive recycling; 'D' for wasteful practices with high virgin material consumption.",
    grade: "" as GradeType,
  },
  {
    id: "pollution_waste",
    title: "Pollution & Waste",
    description: "Evaluate emissions, waste management practices, and pollution prevention.",
    tooltip: "Consider air, water and soil pollution potential, waste disposal methods, and hazardous material management. Grade 'A' for minimal pollution with excellent waste management; 'D' for significant pollution with inadequate controls.",
    grade: "" as GradeType,
  },
  {
    id: "biodiversity_impact",
    title: "Biodiversity Impact",
    description: "Assess potential impacts on local ecosystems, habitat preservation efforts.",
    tooltip: "Consider habitat disruption, ecosystem conservation efforts, and impact on wildlife. Grade 'A' for projects that actively protect or enhance biodiversity; 'D' for those causing significant habitat destruction without mitigation.",
    grade: "" as GradeType,
  },
  {
    id: "climate_risk",
    title: "Climate Risk",
    description: "Evaluate risks related to climate change and adaptation/mitigation strategies.",
    tooltip: "Consider exposure to climate hazards, adaptation measures, and contribution to climate resilience. Grade 'A' for projects with robust climate adaptation and minimal emissions; 'D' for projects highly vulnerable to climate impacts with no resilience measures.",
    grade: "" as GradeType,
  },
  
  // Social Categories
  {
    id: "labor_practices",
    title: "Labor Practices",
    description: "Evaluate working conditions, fair wages, and employee health and safety measures.",
    tooltip: "Consider workplace safety records, compensation policies, work hours, and benefits. Grade 'A' for excellent labor standards exceeding local requirements; 'D' for poor conditions with safety issues or labor rights violations.",
    grade: "" as GradeType,
  },
  {
    id: "community_impact",
    title: "Community Impact",
    description: "Assess engagement with local communities and benefit-sharing initiatives.",
    tooltip: "Consider community consultation processes, local economic benefits, and cultural respect. Grade 'A' for projects with strong community support and significant local benefits; 'D' for those causing community disruption with minimal engagement.",
    grade: "" as GradeType,
  },
  {
    id: "human_rights",
    title: "Human Rights",
    description: "Evaluate potential human rights risks and due diligence measures.",
    tooltip: "Consider risks of forced labor, child labor, discrimination, or indigenous rights violations. Grade 'A' for robust human rights protections and screening; 'D' for operations in high-risk contexts without adequate safeguards.",
    grade: "" as GradeType,
  },
  
  // Governance Categories
  {
    id: "responsible_operation",
    title: "Responsible Operation",
    description: "Assess project governance structure, accountability, and management quality.",
    tooltip: "Consider management structure, stakeholder engagement processes, and decision-making transparency. Grade 'A' for inclusive, transparent governance with clear accountability; 'D' for opaque management with minimal oversight.",
    grade: "" as GradeType,
  },
  {
    id: "corruption_ethics",
    title: "Corruption & Ethics",
    description: "Evaluate anti-corruption measures and ethical business practices.",
    tooltip: "Consider anti-bribery policies, conflict of interest management, and ethical conduct standards. Grade 'A' for comprehensive ethics programs with strong enforcement; 'D' for weak controls in high-corruption environments.",
    grade: "" as GradeType,
  },
  {
    id: "legal_compliance",
    title: "Legal Compliance",
    description: "Assess compliance with relevant laws, regulations, and permit requirements.",
    tooltip: "Consider regulatory history, permitting status, and compliance systems. Grade 'A' for perfect compliance record with proactive approach; 'D' for significant violations or operating without required permits.",
    grade: "" as GradeType,
  },
];

// Calculate overall score from a set of risk categories
export const calculateOverallScore = (categories: RiskCategory[]): number => {
  if (categories.some(cat => cat.grade === "")) {
    return 0; // Return 0 if any category is not assessed
  }
  
  return Math.round(
    categories.reduce((sum, cat) => {
      const gradeValue = cat.grade === "A" ? 4 : cat.grade === "B" ? 3 : cat.grade === "C" ? 2 : cat.grade === "D" ? 1 : 0;
      return sum + gradeValue;
    }, 0) / categories.length * 100
  );
};

// Calculate overall grade from a score
export const calculateOverallGrade = (score: number): GradeType => {
  if (score === 0) return "" as GradeType;
  if (score >= 75) return "A";
  if (score >= 50) return "B";
  if (score >= 25) return "C";
  return "D";
};

// Generate improvement suggestions based on low-scored categories
export const getImprovementSuggestions = (categories: RiskCategory[]): string => {
  const lowGradeCategories = categories
    .filter(cat => cat.grade === "C" || cat.grade === "D")
    .map(cat => {
      let suggestion = "";
      
      switch (cat.id) {
        case "project_type":
          suggestion = "Consider redesigning high-impact aspects of the project to reduce environmental footprint.";
          break;
        case "energy_use":
          suggestion = "Implement energy efficiency measures and increase renewable energy sourcing.";
          break;
        case "resource_use":
          suggestion = "Adopt circular economy principles and improve material efficiency in operations.";
          break;
        case "pollution_waste":
          suggestion = "Strengthen waste management practices and implement pollution prevention technologies.";
          break;
        case "biodiversity_impact":
          suggestion = "Develop habitat conservation plans and minimize disturbance to natural ecosystems.";
          break;
        case "climate_risk":
          suggestion = "Implement climate adaptation measures and reduce climate vulnerability in project design.";
          break;
        case "labor_practices":
          suggestion = "Improve workplace safety standards and ensure fair compensation policies.";
          break;
        case "community_impact":
          suggestion = "Strengthen community engagement processes and develop local benefit-sharing initiatives.";
          break;
        case "human_rights":
          suggestion = "Implement human rights due diligence processes throughout operations and supply chain.";
          break;
        case "responsible_operation":
          suggestion = "Enhance management transparency and create clear accountability mechanisms.";
          break;
        case "corruption_ethics":
          suggestion = "Strengthen anti-corruption policies and provide ethics training to all staff.";
          break;
        case "legal_compliance":
          suggestion = "Review regulatory requirements and develop robust compliance monitoring systems.";
          break;
      }
      
      return `${cat.title}: ${suggestion}`;
    });
  
  if (lowGradeCategories.length === 0) {
    return "No significant ESG concerns were identified. Continue monitoring all ESG aspects to maintain strong performance.";
  }
  
  return lowGradeCategories.join("\n");
};