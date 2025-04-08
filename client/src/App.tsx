import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import RiskAssessment from "@/pages/risk-assessment";
import ProjectGallery from "@/pages/project-gallery";
import Resources from "@/pages/resources";
import Project from "@/pages/project";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="page-transition">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/risk-assessment" component={RiskAssessment} />
        <Route path="/project-gallery" component={ProjectGallery} />
        <Route path="/resources" component={Resources} />
        <Route path="/projects/:id" component={Project} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
