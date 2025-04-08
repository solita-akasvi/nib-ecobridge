import Navbar from "@/components/layout/navbar";
import ProjectGallery from "@/components/dashboard/project-gallery";

export default function ProjectGalleryPage() {
  return (
    <>
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">
                ESG Project Gallery
              </h1>
              <p className="mt-1 text-neutral-500">
                Discover sustainable infrastructure projects across Global South countries
              </p>
            </div>
          </div>
          
          <ProjectGallery />
        </div>
      </main>
    </>
  );
}
