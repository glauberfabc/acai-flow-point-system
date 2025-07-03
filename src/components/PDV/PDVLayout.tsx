import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  LogOut, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard,
  DollarSign,
  Smartphone,
  AlertTriangle,
  Check
} from 'lucide-react';
import { ProductSize, PaymentMethod, OrderItem } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';

export function PDVLayout() {
  const { 
    currentUser, 
    logout, 
    products, 
    currentOrder, 
    addToCurrentOrder, 
    updateOrderItem, 
    removeFromCurrentOrder, 
    clearCurrentOrder,
    finalizeOrder,
    getStockByProduct
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [customerName, setCustomerName] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const acaiProduct = products.find(p => p.category === 'acai');
  const toppings = products.filter(p => p.category === 'cobertura');

  const getAcaiPrice = (size: ProductSize) => {
    return acaiProduct?.sizes.find(s => s.size === size)?.price || 0;
  };

  const addAcaiToOrder = () => {
    if (!acaiProduct) return;

    const stock = getStockByProduct(acaiProduct.id, selectedSize);
    if (!stock || stock.availablePots < 1) {
      alert('Estoque insuficiente para este tamanho!');
      return;
    }

    const selectedToppingProducts = selectedToppings.map(id => {
      const topping = toppings.find(t => t.id === id);
      return {
        id: topping!.id,
        name: topping!.name,
        price: topping!.sizes[0].price
      };
    });

    const orderItem: Omit<OrderItem, 'id'> = {
      productId: acaiProduct.id,
      productName: acaiProduct.name,
      size: selectedSize,
      price: getAcaiPrice(selectedSize),
      quantity: 1,
      toppings: selectedToppingProducts
    };

    addToCurrentOrder(orderItem);
    setSelectedToppings([]);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCurrentOrder(id);
    } else {
      updateOrderItem(id, { quantity: newQuantity });
    }
  };

  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const toppingsTotal = item.toppings.reduce((sum, topping) => sum + topping.price, 0) * item.quantity;
      return total + itemTotal + toppingsTotal;
    }, 0);
  };

  const handleFinalizarPedido = async () => {
    const success = finalizeOrder(paymentMethod, customerName);
    
    if (success) {
      setOrderSuccess(true);
      setShowPayment(false);
      setCustomerName('');
      
      setTimeout(() => {
        setOrderSuccess(false);
      }, 3000);
    } else {
      alert('Erro ao finalizar pedido. Verifique o estoque.');
    }
  };

  const paymentIcons = {
    pix: Smartphone,
    dinheiro: DollarSign,
    credito: CreditCard,
    debito: CreditCard
  };

  const paymentLabels = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    credito: 'Cartão de Crédito',
    debito: 'Cartão de Débito'
  };

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
                <h1 className="text-xl font-bold text-foreground">Açaí Shop PDV</h1>
                <p className="text-sm text-muted-foreground">Ponto de Venda</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <Badge variant="outline" className="text-xs">
                  Operador
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seleção de Produtos */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-card shadow-card-acai">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-2">🍇</span>
                    Monte seu Açaí
                  </CardTitle>
                  <CardDescription>
                    Escolha o tamanho e adicione coberturas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Seleção de Tamanho */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Tamanho</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {acaiProduct?.sizes.map((sizeOption) => {
                        const stock = getStockByProduct(acaiProduct.id, sizeOption.size);
                        const isLowStock = stock && stock.availablePots < stock.minimumLevel;
                        const isOutOfStock = !stock || stock.availablePots === 0;
                        
                        return (
                          <motion.button
                            key={sizeOption.size}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedSize(sizeOption.size)}
                            disabled={isOutOfStock}
                            className={`
                              p-4 rounded-lg border-2 transition-all relative
                              ${selectedSize === sizeOption.size 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border bg-card hover:border-primary/50'
                              }
                              ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            <div className="text-lg font-bold">{sizeOption.size}</div>
                            <div className="text-sm text-muted-foreground">
                              R$ {sizeOption.price.toFixed(2)}
                            </div>
                            {stock && (
                              <div className="text-xs mt-1">
                                {isOutOfStock ? (
                                  <Badge variant="destructive" className="text-xs">
                                    Sem estoque
                                  </Badge>
                                ) : isLowStock ? (
                                  <Badge variant="secondary" className="text-xs bg-warning text-warning-foreground">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {stock.availablePots}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">
                                    {stock.availablePots} disponíveis
                                  </span>
                                )}
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Coberturas */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Coberturas (opcionais)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {toppings.map((topping) => (
                        <motion.button
                          key={topping.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedToppings(prev => 
                              prev.includes(topping.id)
                                ? prev.filter(id => id !== topping.id)
                                : [...prev, topping.id]
                            );
                          }}
                          className={`
                            p-3 rounded-lg border-2 transition-all text-left
                            ${selectedToppings.includes(topping.id)
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card hover:border-primary/50'
                            }
                          `}
                        >
                          <div className="font-medium">{topping.name}</div>
                          <div className="text-sm text-muted-foreground">
                            +R$ {topping.sizes[0].price.toFixed(2)}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={addAcaiToOrder}
                    className="w-full bg-gradient-button hover:opacity-90 shadow-button-acai"
                    size="lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar ao Pedido
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Pedido Atual */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Pedido
                    </span>
                    <Badge variant="secondary">
                      {currentOrder.length} {currentOrder.length === 1 ? 'item' : 'itens'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {currentOrder.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhum item no pedido</p>
                      </motion.div>
                    ) : (
                      currentOrder.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-muted/50 rounded-lg p-3 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.productName} {item.size}</h4>
                              <p className="text-sm text-muted-foreground">
                                R$ {item.price.toFixed(2)}
                              </p>
                              {item.toppings.length > 0 && (
                                <div className="mt-1">
                                  {item.toppings.map((topping) => (
                                    <span key={topping.id} className="text-xs text-muted-foreground block">
                                      + {topping.name} (R$ {topping.price.toFixed(2)})
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium">
                                R$ {((item.price + item.toppings.reduce((sum, t) => sum + t.price, 0)) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>

                  {currentOrder.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>R$ {calculateTotal().toFixed(2)}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearCurrentOrder}
                            className="w-full"
                          >
                            Limpar Pedido
                          </Button>
                          
                          <Dialog open={showPayment} onOpenChange={setShowPayment}>
                            <DialogTrigger asChild>
                              <Button 
                                className="w-full bg-gradient-button hover:opacity-90 shadow-button-acai"
                                size="lg"
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Finalizar Pedido
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Finalizar Pedido</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="customer">Nome do Cliente (opcional)</Label>
                                  <Input
                                    id="customer"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Digite o nome do cliente"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Forma de Pagamento</Label>
                                  <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(paymentLabels).map(([value, label]) => {
                                        const Icon = paymentIcons[value as PaymentMethod];
                                        return (
                                          <SelectItem key={value} value={value}>
                                            <div className="flex items-center">
                                              <Icon className="w-4 h-4 mr-2" />
                                              {label}
                                            </div>
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="bg-muted rounded-lg p-4">
                                  <div className="flex justify-between text-lg font-bold">
                                    <span>Total a Pagar:</span>
                                    <span>R$ {calculateTotal().toFixed(2)}</span>
                                  </div>
                                </div>

                                <Button 
                                  onClick={handleFinalizarPedido}
                                  className="w-full bg-gradient-button hover:opacity-90"
                                  size="lg"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Confirmar Pagamento
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-card rounded-lg p-8 text-center shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-success rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-success-foreground" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Pedido Finalizado!
              </h3>
              <p className="text-muted-foreground">
                Pagamento processado com sucesso
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}