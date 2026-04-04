import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "./pages/Login";
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
import LandingHome from "./pages/landing/LandingHome";
import LandingFeatures from "./pages/landing/LandingFeatures";
import LandingPricing from "./pages/landing/LandingPricing";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Landing pages */}
            <Route path="/landing" element={<LandingHome />} />
            <Route path="/landing/features" element={<LandingFeatures />} />
            <Route path="/landing/pricing" element={<LandingPricing />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<ProtectedRoute><AuthLayout><OnboardingLanding /></AuthLayout></ProtectedRoute>} />
            <Route path="/onboarding/setup" element={<ProtectedRoute><AuthLayout><OnboardingWizard /></AuthLayout></ProtectedRoute>} />

            {/* Main app */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><AppLayout><Templates /></AppLayout></ProtectedRoute>} />
            <Route path="/templates/new" element={<ProtectedRoute><AppLayout><NewTemplate /></AppLayout></ProtectedRoute>} />
            <Route path="/sequences" element={<ProtectedRoute><AppLayout><Sequences /></AppLayout></ProtectedRoute>} />
            <Route path="/sequences/new" element={<ProtectedRoute><AppLayout><CreateSequence /></AppLayout></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><AppLayout><Chatbot /></AppLayout></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><AppLayout><Inbox /></AppLayout></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><AppLayout><Contacts /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
