import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  ArrowLeft,
  Package,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';
import { ProductSize } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';

export function EstoqueLayout() {
  const { 
    setCurrentView, 
    stock, 
    updateStock, 
    products 
  } = useStore();

  const [selectedStock, setSelectedStock] = useState<string>('');
  const [newPackages, setNewPackages] = useState<number>(0);

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Produto não encontrado';
  };

  const isLowStock = (item: typeof stock[0]) => {
    return item.availablePots < item.minimumLevel;
  };

  const handleUpdateStock = (productId: string, size: ProductSize, packages: number) => {
    updateStock(productId, size, packages);
    setSelectedStock('');
    setNewPackages(0);
  };

  const lowStockItems = stock.filter(isLowStock);
  const totalStockValue = stock.reduce((total, item) => total + (item.packages * 50), 0); // Estimativa de R$ 50 por pacote

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-acai-light to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('admin')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-button rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Controle de Estoque</h1>
                <p className="text-sm text-muted-foreground">Gerencie seu inventário</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alertas de Estoque Baixo */}
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning">
                <strong>{lowStockItems.length}</strong> {lowStockItems.length === 1 ? 'item está' : 'itens estão'} com estoque baixo!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Total de Pacotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stock.reduce((total, item) => total + item.packages, 0)}
                </div>
                <p className="text-sm text-muted-foreground">pacotes em estoque</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <span className="text-2xl mr-2">🍇</span>
                  Potes Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stock.reduce((total, item) => total + item.availablePots, 0)}
                </div>
                <p className="text-sm text-muted-foreground">potes prontos para venda</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {lowStockItems.length}
                </div>
                <p className="text-sm text-muted-foreground">itens com estoque baixo</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Lista de Estoque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inventário Detalhado</CardTitle>
              <CardDescription>
                Controle de pacotes e potes por produto e tamanho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stock.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${isLowStock(item) 
                        ? 'border-warning bg-warning/5' 
                        : 'border-border bg-card'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold
                            ${isLowStock(item) 
                              ? 'bg-warning' 
                              : 'bg-gradient-button'
                            }
                          `}>
                            {item.size}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {getProductName(item.productId)} - {item.size}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.packages} pacotes • {item.availablePots} potes disponíveis
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {isLowStock(item) && (
                          <Badge variant="secondary" className="bg-warning text-warning-foreground">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Estoque Baixo
                          </Badge>
                        )}

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Mínimo: {item.minimumLevel}</p>
                          <p className="text-xs text-muted-foreground">
                            Atualizado: {item.lastUpdated.toLocaleDateString()}
                          </p>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedStock(item.id);
                                setNewPackages(item.packages);
                              }}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Atualizar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Atualizar Estoque - {getProductName(item.productId)} {item.size}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-muted rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Pacotes Atuais:</p>
                                    <p className="font-semibold">{item.packages}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Potes Disponíveis:</p>
                                    <p className="font-semibold">{item.availablePots}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="packages">Nova Quantidade de Pacotes</Label>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewPackages(Math.max(0, newPackages - 1))}
                                    className="h-10 w-10 p-0"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <Input
                                    id="packages"
                                    type="number"
                                    value={newPackages}
                                    onChange={(e) => setNewPackages(parseInt(e.target.value) || 0)}
                                    className="text-center"
                                    min="0"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewPackages(newPackages + 1)}
                                    className="h-10 w-10 p-0"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Isso resultará em {newPackages * item.potsPerPackage} potes disponíveis
                                </p>
                              </div>

                              <Button 
                                onClick={() => handleUpdateStock(item.productId, item.size, newPackages)}
                                className="w-full"
                                variant="acai"
                              >
                                Atualizar Estoque
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}