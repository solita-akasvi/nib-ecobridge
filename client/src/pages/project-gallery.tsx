import Navbar from "@/components/layout/navbar";
import ProjectGallery from "@/components/dashboard/project-gallery";

export default function ProjectGalleryPage() {
  return (
    <>
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-5">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">
                My Projects
              </h1>
            </div>
          </div>
          
          <ProjectGallery />
        </div>
      </main>
    </>
  );
}
