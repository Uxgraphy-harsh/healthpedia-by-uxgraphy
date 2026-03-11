import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Track from "./pages/Track";
import Records from "./pages/Records";
import Reminders from "./pages/Reminders";
import Timeline from "./pages/Timeline";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const showNav = ["/chat", "/dashboard", "/track", "/records", "/reminders", "/profile", "/timeline"].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track" element={<Track />} />
        <Route path="/records" element={<Records />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/profile" element={<Profile />} />
        {/* Legacy redirects */}
        <Route path="/stats" element={<Navigate to="/dashboard" replace />} />
        <Route path="/symptoms" element={<Navigate to="/track" replace />} />
        <Route path="/vault" element={<Navigate to="/records" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
