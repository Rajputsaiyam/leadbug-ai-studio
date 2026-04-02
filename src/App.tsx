import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingLanding from "./pages/onboarding/OnboardingLanding";
import OnboardingWizard from "./pages/onboarding/OnboardingWizard";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import NewTemplate from "./pages/NewTemplate";
import Sequences from "./pages/Sequences";
import CreateSequence from "./pages/CreateSequence";
import Chatbot from "./pages/Chatbot";
import Inbox from "./pages/Inbox";
import Contacts from "./pages/Contacts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Onboarding - No shell */}
          <Route path="/onboarding" element={<AuthLayout><OnboardingLanding /></AuthLayout>} />
          <Route path="/onboarding/setup" element={<AuthLayout><OnboardingWizard /></AuthLayout>} />
          
          {/* Main app - With shell */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/templates" element={<AppLayout><Templates /></AppLayout>} />
          <Route path="/templates/new" element={<AppLayout><NewTemplate /></AppLayout>} />
          <Route path="/sequences" element={<AppLayout><Sequences /></AppLayout>} />
          <Route path="/sequences/new" element={<AppLayout><CreateSequence /></AppLayout>} />
          <Route path="/chatbot" element={<AppLayout><Chatbot /></AppLayout>} />
          <Route path="/inbox" element={<AppLayout><Inbox /></AppLayout>} />
          <Route path="/contacts" element={<AppLayout><Contacts /></AppLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
