import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "./store/useStore";
import { Login } from "./components/Login";
import { AdminLayout } from "./components/Layout/AdminLayout";
import { PDVLayout } from "./components/PDV/PDVLayout";
import { EstoqueLayout } from "./components/Estoque/EstoqueLayout";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, currentUser, currentView } = useStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  // Renderizar baseado na view atual e role do usuário
  switch (currentView) {
    case 'admin':
      return currentUser?.role === 'admin' ? <AdminLayout /> : <PDVLayout />;
    case 'pdv':
      return <PDVLayout />;
    case 'produtos':
      return currentUser?.role === 'admin' ? <div>Produtos em construção...</div> : <PDVLayout />;
    case 'estoque':
      return currentUser?.role === 'admin' ? <EstoqueLayout /> : <PDVLayout />;
    case 'relatorios':
      return currentUser?.role === 'admin' ? <div>Relatórios em construção...</div> : <PDVLayout />;
    default:
      return currentUser?.role === 'admin' ? <AdminLayout /> : <PDVLayout />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
