import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt
} from 'lucide-react';
import { PaymentMethod } from '../../types';

export function RelatoriosLayout() {
  const { orders, getDailySales, calculateDailyTotal, getOrdersByPaymentMethod } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | 'all'>('all');

  const todayOrders = getDailySales(selectedDate);
  const dailyTotal = calculateDailyTotal(selectedDate);

  const paymentMethods = [
    { value: 'all', label: 'Todos', icon: Receipt },
    { value: 'pix', label: 'PIX', icon: Smartphone },
    { value: 'dinheiro', label: 'Dinheiro', icon: Banknote },
    { value: 'credito', label: 'Crédito', icon: CreditCard },
    { value: 'debito', label: 'Débito', icon: CreditCard }
  ];

  const filteredOrders = selectedPaymentMethod === 'all' 
    ? todayOrders 
    : todayOrders.filter(order => order.paymentMethod === selectedPaymentMethod);

  const paymentBreakdown = {
    pix: todayOrders.filter(o => o.paymentMethod === 'pix').reduce((sum, o) => sum + o.total, 0),
    dinheiro: todayOrders.filter(o => o.paymentMethod === 'dinheiro').reduce((sum, o) => sum + o.total, 0),
    credito: todayOrders.filter(o => o.paymentMethod === 'credito').reduce((sum, o) => sum + o.total, 0),
    debito: todayOrders.filter(o => o.paymentMethod === 'debito').reduce((sum, o) => sum + o.total, 0)
  };

  const averageOrderValue = todayOrders.length > 0 ? dailyTotal / todayOrders.length : 0;

  const exportToCSV = () => {
    const csvContent = [
      ['Data', 'Pedido', 'Cliente', 'Total', 'Pagamento', 'Funcionário'],
      ...filteredOrders.map(order => [
        order.createdAt.toLocaleDateString('pt-BR'),
        order.id,
        order.customerName || 'N/A',
        `R$ ${order.total.toFixed(2)}`,
        order.paymentMethod.toUpperCase(),
        order.cashierName
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-acai-light to-accent/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios Financeiros</h1>
            <p className="text-muted-foreground">Acompanhe vendas e performance</p>
          </div>
          
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Forma de Pagamento</Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod | 'all')}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <method.icon className="w-4 h-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-acai text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Faturamento Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">R$ {dailyTotal.toFixed(2)}</span>
                  <DollarSign className="w-6 h-6 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{todayOrders.length}</span>
                  <Receipt className="w-6 h-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">R$ {averageOrderValue.toFixed(2)}</span>
                  <TrendingUp className="w-6 h-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Horário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Breakdown por Forma de Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Breakdown por Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-green-500" />
                    <span>PIX</span>
                  </div>
                  <span className="font-medium">R$ {paymentBreakdown.pix.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span>Dinheiro</span>
                  </div>
                  <span className="font-medium">R$ {paymentBreakdown.dinheiro.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    <span>Crédito</span>
                  </div>
                  <span className="font-medium">R$ {paymentBreakdown.credito.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span>Débito</span>
                  </div>
                  <span className="font-medium">R$ {paymentBreakdown.debito.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método mais usado:</span>
                  <Badge variant="secondary">
                    {Object.entries(paymentBreakdown)
                      .sort(([,a], [,b]) => b - a)[0]?.[0]?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horário de pico:</span>
                  <span className="font-medium">14:00 - 16:00</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status do dia:</span>
                  <Badge variant={dailyTotal > 300 ? "default" : "secondary"}>
                    {dailyTotal > 300 ? "Excelente" : "Bom"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos do Dia ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Relatório detalhado dos pedidos em {new Date(selectedDate).toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido encontrado para os filtros selecionados
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Funcionário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.createdAt.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                      <TableCell>{order.customerName || 'Cliente'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.quantity}x {item.productName} ({item.size})
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.paymentMethod.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.cashierName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}