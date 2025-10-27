import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MyAgents from "./pages/MyAgents";
import Payments from "./pages/Payments";
import AnalyticsPage from "./pages/AnalyticsPage";
import SDK from "./pages/SDK";
import Docs from "./pages/Docs";
import DocsGettingStarted from "./pages/DocsGettingStarted";
import DocsArchitecture from "./pages/DocsArchitecture";
import DocsSDK from "./pages/DocsSDK";
import DocsGasless from "./pages/DocsGasless";
import DocsHTTP402 from "./pages/DocsHTTP402";
import DocsMonitoring from "./pages/DocsMonitoring";
import UseCases from "./pages/UseCases";
import WaitList from "./pages/Waitlist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletContextProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<MyAgents />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/sdk" element={<SDK />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/getting-started" element={<DocsGettingStarted />} />
            <Route path="/docs/architecture" element={<DocsArchitecture />} />
            <Route path="/docs/sdk" element={<DocsSDK />} />
            <Route path="/docs/gasless" element={<DocsGasless />} />
            <Route path="/docs/http-402" element={<DocsHTTP402 />} />
            <Route path="/docs/monitoring" element={<DocsMonitoring />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/waitlist" element={<WaitList />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
