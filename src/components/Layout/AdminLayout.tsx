import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  LogOut, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  Users
} from 'lucide-react';

export function AdminLayout() {
  const { currentUser, logout, setCurrentView } = useStore();

  const menuItems = [
    {
      title: 'Ponto de Venda',
      description: 'Realizar vendas e gerenciar pedidos',
      icon: ShoppingCart,
      action: () => setCurrentView('pdv'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Produtos',
      description: 'Gerenciar catálogo de produtos',
      icon: Package,
      action: () => setCurrentView('produtos'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Estoque',
      description: 'Controlar inventário e alertas',
      icon: Package,
      action: () => setCurrentView('estoque'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Relatórios',
      description: 'Vendas, financeiro e analytics',
      icon: BarChart3,
      action: () => setCurrentView('relatorios'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-acai-light to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-button rounded-full flex items-center justify-center">
                <span className="text-xl">🍇</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Açaí Shop</h1>
                <p className="text-sm text-muted-foreground">Sistema Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <Badge variant="secondary" className="text-xs">
                  Administrador
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h2>
            <p className="text-muted-foreground">
              Gerencie todos os aspectos do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-card"
                  onClick={item.action}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-2xl">→</span>
                      </motion.div>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-gradient-acai text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Resumo Rápido - Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">15</p>
                    <p className="text-white/80">Pedidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">R$ 420,00</p>
                    <p className="text-white/80">Faturamento</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">R$ 28,00</p>
                    <p className="text-white/80">Ticket Médio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}