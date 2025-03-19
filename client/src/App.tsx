import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";

// Importaciones dinámicas para cargar los componentes de administración bajo demanda
import { lazy, Suspense } from "react";
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminAppointments = lazy(() => import("@/pages/admin/appointments"));
const AdminServices = lazy(() => import("@/pages/admin/services"));
const AdminStylists = lazy(() => import("@/pages/admin/stylists"));
const AdminAvailability = lazy(() => import("@/pages/admin/availability"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#165C5C]"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Rutas públicas */}
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        
        {/* Rutas de administración (protegidas) */}
        <ProtectedRoute 
          path="/admin/dashboard" 
          component={() => <AdminDashboard />} 
          adminOnly 
        />
        <ProtectedRoute 
          path="/admin/appointments" 
          component={() => <AdminAppointments />} 
          adminOnly 
        />
        <ProtectedRoute 
          path="/admin/services" 
          component={() => <AdminServices />} 
          adminOnly 
        />
        <ProtectedRoute 
          path="/admin/stylists" 
          component={() => <AdminStylists />} 
          adminOnly 
        />
        <ProtectedRoute 
          path="/admin/availability" 
          component={() => <AdminAvailability />} 
          adminOnly 
        />
        
        {/* Fallback a 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
