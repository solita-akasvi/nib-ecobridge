import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import logoImage from "@assets/Logo.png";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Risk Assessment", path: "/risk-assessment" },
    { name: "My Projects", path: "/project-gallery" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <img 
                    src={logoImage} 
                    alt="EcoBridge Logo" 
                    className="h-10 w-auto transition-transform duration-200 ease-in-out hover:scale-105" 
                  />
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer",
                      location === item.path
                        ? "border-primary-500 text-neutral-900"
                        : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-white p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                    <span className="font-medium text-primary-700">JD</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden mt-1">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
