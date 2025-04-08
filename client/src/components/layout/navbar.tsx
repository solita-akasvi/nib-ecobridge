import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Risk Assessment", path: "/risk-assessment" },
    { name: "Project Gallery", path: "/project-gallery" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <img src="/images/logo.png" alt="EcoBridge Logo" className="h-10 w-auto transition-transform duration-200 ease-in-out hover:scale-105" onError={(e) => { 
                    // Fallback if image doesn't load
                    e.currentTarget.src = "/logo.png"; 
                  }} />
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer",
                      location === item.path
                        ? "border-green-300 text-white"
                        : "border-transparent text-green-100 hover:border-green-200 hover:text-white"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="p-1 rounded-full text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                    <span className="font-medium text-green-800">JD</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
