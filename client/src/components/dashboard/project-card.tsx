import { useState } from "react";
import { Link } from "wouter";
import { Project } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Bookmark } from "lucide-react";
import { getLevelColor, getCategoryColor } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Function to get project images from stock photos
function getProjectImage(projectId: number): string {
  const stockImages: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2344&auto=format&fit=crop",
    2: "https://images.unsplash.com/photo-1636606648999-b97d2910a2e0?q=80&w=2456&auto=format&fit=crop",
    3: "https://images.unsplash.com/photo-1627483262769-04d0a1401487?q=80&w=2370&auto=format&fit=crop",
    4: "https://images.unsplash.com/photo-1605937363875-1fd4fd6110c5?q=80&w=2370&auto=format&fit=crop",
    5: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2344&auto=format&fit=crop",
    6: "https://images.unsplash.com/photo-1640465695297-294f4b50a8d5?q=80&w=2532&auto=format&fit=crop"
  };
  
  return stockImages[projectId] || 
    `https://via.placeholder.com/800x450/1e88e5/ffffff?text=Project+${projectId}`;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      // In a real app, we would use actual user ID
      const userId = 1;
      const data = {
        userId,
        projectId: project.id
      };
      return await apiRequest("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      setIsBookmarked(true);
      toast({
        title: "Project Saved",
        description: "This project has been added to your bookmarks.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to bookmark project. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const categoryColors = getCategoryColor(project.category);
  const riskColors = getLevelColor(project.riskLevel);
  
  const handleSave = () => {
    if (!isBookmarked) {
      bookmarkMutation.mutate();
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden bg-slate-100">
        <img 
          className="h-full w-full object-cover transition-opacity duration-300" 
          src={getProjectImage(project.id)} 
          alt={project.name}
          loading="eager"
          onError={(e) => {
            if (e.currentTarget) {
              // Prevent blinking by setting opacity to 0 first
              e.currentTarget.style.opacity = '0';
              // Use a placeholder showing the project category
              setTimeout(() => {
                if (e.currentTarget) {
                  e.currentTarget.src = `https://via.placeholder.com/800x450/e2e8f0/0f172a?text=${encodeURIComponent(project.category)}`;
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.onerror = null;
                }
              }, 100);
            }
          }}
        />
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${categoryColors.bg} ${categoryColors.text}`}>
            {project.category}
          </Badge>
          <Badge className={`${riskColors.bg} ${riskColors.text}`}>
            {project.riskLevel} Risk ({project.riskScore}/100)
          </Badge>
        </div>
        
        <h3 className="text-lg font-medium text-neutral-900 mb-1">{project.name}</h3>
        <p className="text-sm text-neutral-700 mb-3">{project.description}</p>
        
        <div className="flex items-center text-xs text-neutral-500 mb-4">
          <span className="flex items-center mr-4">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {project.country}
          </span>
          {project.funding && (
            <span className="flex items-center">
              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
              </svg>
              {project.funding} Funding
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-neutral-50 rounded">
            <div className={`text-lg font-semibold text-secondary-600`}>
              {project.environmentGrade || 'N/A'}
            </div>
            <div className="text-xs text-neutral-500">Environment</div>
          </div>
          <div className="text-center p-2 bg-neutral-50 rounded">
            <div className={`text-lg font-semibold ${project.socialGrade === 'C' ? 'text-yellow-600' : 'text-primary-600'}`}>
              {project.socialGrade || 'N/A'}
            </div>
            <div className="text-xs text-neutral-500">Social</div>
          </div>
          <div className="text-center p-2 bg-neutral-50 rounded">
            <div className={`text-lg font-semibold ${
              project.governanceGrade === 'D' ? 'text-red-600' : 
              project.governanceGrade === 'C' ? 'text-yellow-600' : 
              'text-primary-600'
            }`}>
              {project.governanceGrade || 'N/A'}
            </div>
            <div className="text-xs text-neutral-500">Governance</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center"
            onClick={handleSave}
            disabled={isBookmarked || bookmarkMutation.isPending}
          >
            <Bookmark className="mr-1.5 h-4 w-4" />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          <Link href={`/projects/${project.id}`}>
            <Button className="flex-1 flex items-center justify-center">
              <Info className="mr-1.5 h-4 w-4" />
              Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
