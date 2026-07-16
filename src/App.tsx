import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLockProvider } from "@/contexts/AppLockContext";
import Index from "./pages/Index";
import AIChat from "./pages/AIChat";
import Dashboard from "./pages/Dashboard";
import Track from "./pages/Track";
import Records from "./pages/Records";
import Reminders from "./pages/Reminders";
import Timeline from "./pages/Timeline";
import Profile from "./pages/Profile";
import AppLockSettings from "./pages/AppLockSettings";
import NotFound from "./pages/NotFound";

// Mini apps
import Vault from "./pages/apps/Vault";
import Prescriptions from "./pages/apps/Prescriptions";
import Appointments from "./pages/apps/Appointments";
import Symptoms from "./pages/apps/Symptoms";
import Cycle from "./pages/apps/Cycle";
import CycleOnboarding from "./pages/apps/CycleOnboarding";
import CycleLogNow from "./pages/apps/CycleLogNow";
import CycleLogPeriod from "./pages/apps/CycleLogPeriod";
import CycleInsights from "./pages/apps/CycleInsights";
import Fitness from "./pages/apps/Fitness";
import Allergies from "./pages/apps/Allergies";
import FamilyHistory from "./pages/apps/FamilyHistory";
import Childcare from "./pages/apps/Childcare";
import Contacts from "./pages/apps/Contacts";
import Insurance from "./pages/apps/Insurance";
import Notes from "./pages/apps/Notes";
import Impact from "./pages/apps/Impact";
import Shop from "./pages/apps/Shop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLockProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/track" element={<Track />} />
              <Route path="/records" element={<Records />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings/app-lock" element={<AppLockSettings />} />

              {/* Mini apps */}
              <Route path="/apps/vault" element={<Vault />} />
              <Route path="/apps/prescriptions" element={<Prescriptions />} />
              <Route path="/apps/appointments" element={<Appointments />} />
              <Route path="/apps/symptoms" element={<Symptoms />} />
              <Route path="/apps/cycle" element={<Cycle />} />
              <Route path="/apps/cycle/onboarding" element={<CycleOnboarding />} />
              <Route path="/apps/cycle/log" element={<CycleLogNow />} />
              <Route path="/apps/cycle/log-period" element={<CycleLogPeriod />} />
              <Route path="/apps/cycle/insights" element={<CycleInsights />} />
              <Route path="/apps/fitness" element={<Fitness />} />
              <Route path="/apps/allergies" element={<Allergies />} />
              <Route path="/apps/family" element={<FamilyHistory />} />
              <Route path="/apps/childcare" element={<Childcare />} />
              <Route path="/apps/contacts" element={<Contacts />} />
              <Route path="/apps/insurance" element={<Insurance />} />
              <Route path="/apps/notes" element={<Notes />} />
              <Route path="/apps/impact" element={<Impact />} />
              <Route path="/apps/shop" element={<Shop />} />

              {/* Legacy redirects */}
              <Route path="/home" element={<Navigate to="/chat" replace />} />
              <Route path="/apps" element={<Navigate to="/chat" replace />} />
              <Route path="/stats" element={<Navigate to="/dashboard" replace />} />
              <Route path="/symptoms" element={<Navigate to="/apps/symptoms" replace />} />
              <Route path="/vault" element={<Navigate to="/apps/vault" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLockProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
