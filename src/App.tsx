import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GenderFilterProvider } from "@/contexts/GenderFilterContext";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <GenderFilterProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GenderFilterProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
