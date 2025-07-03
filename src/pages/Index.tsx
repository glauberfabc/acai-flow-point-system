import { useStore } from "../store/useStore";
import { Login } from "../components/Login";
import { AdminLayout } from "../components/Layout/AdminLayout";
import { PDVLayout } from "../components/PDV/PDVLayout";

const Index = () => {
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
      return currentUser?.role === 'admin' ? <div>Estoque em construção...</div> : <PDVLayout />;
    case 'relatorios':
      return currentUser?.role === 'admin' ? <div>Relatórios em construção...</div> : <PDVLayout />;
    default:
      return currentUser?.role === 'admin' ? <AdminLayout /> : <PDVLayout />;
  }
};

export default Index;
