import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./project-card";
import FilterBar from "./filter-bar";
import { Button } from "@/components/ui/button";
import { Project, FilterOptions } from "@/types";
import { buildQueryString } from "@/lib/data";
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGallery() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['/api/projects', filters],
    queryFn: async ({ queryKey }) => {
      const [_path, filterOptions] = queryKey;
      const queryString = buildQueryString(filterOptions as FilterOptions);
      const url = `/api/projects${queryString ? `?${queryString}` : ''}`;
      const res = await fetch(url, { credentials: 'include' });
      
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      return res.json() as Promise<Project[]>;
    }
  });
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Calculate pagination
  const filteredProjects = projects;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-neutral-200">
        <div className="flex items-center justify-end">
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
            </Button>
          </div>
        </div>
      </div>
      
      <FilterBar onFilterChange={handleFilterChange} />
      
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading projects. Please try again.</p>
          </div>
        ) : paginatedProjects.length === 0 ? (
          <div className="text-center py-8 text-neutral-600">
            <p>No projects found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-neutral-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredProjects.length)}
              </span>{" "}
              of <span className="font-medium">{filteredProjects.length}</span> projects
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    className="relative inline-flex items-center px-4 py-2"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
