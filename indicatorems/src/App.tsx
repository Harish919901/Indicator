import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import ExcelDashboard from "./pages/ExcelDashboard";
import ExcelQuote from "./pages/ExcelQuote";
import AiInsights from "./pages/AiInsights";
import SapBridge from "./pages/SapBridge";
import DragDropBuilder from "./pages/DragDropBuilder";
import Reports from "./pages/Reports";
import Templates from "./pages/Templates";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/excel-dashboard" element={<ExcelDashboard />} />
            <Route path="/excel-quote" element={<ExcelQuote />} />
            <Route path="/ai-insights" element={<AiInsights />} />
            <Route path="/sap-bridge" element={<SapBridge />} />
            <Route path="/drag-drop" element={<DragDropBuilder />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
