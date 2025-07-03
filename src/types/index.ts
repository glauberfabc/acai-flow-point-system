export type UserRole = 'admin' | 'funcionario';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export type ProductSize = 'PP' | 'P' | 'M' | 'G';

export interface Product {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: ProductSize;
    price: number;
  }[];
  category: 'acai' | 'cobertura' | 'bebidas' | 'outros';
  active: boolean;
  createdAt: Date;
}

export interface StockItem {
  id: string;
  productId: string;
  size: ProductSize;
  packages: number; // Quantidade de pacotes
  potsPerPackage: number; // Potes por pacote (normalmente 25)
  availablePots: number; // Auto calculado: packages * potsPerPackage
  minimumLevel: number; // Nível mínimo de alerta
  lastUpdated: Date;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'credito' | 'debito';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  size: ProductSize;
  price: number;
  quantity: number;
  toppings: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  customerName?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  cashierId: string;
  cashierName: string;
}

export interface DailySales {
  date: string; // YYYY-MM-DD
  orders: Order[];
  totalSales: number;
  paymentBreakdown: {
    pix: number;
    dinheiro: number;
    credito: number;
    debito: number;
  };
  totalOrders: number;
  averageOrderValue: number;
}

export interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Products
  products: Product[];
  
  // Stock
  stock: StockItem[];
  
  // Orders
  currentOrder: OrderItem[];
  orders: Order[];
  
  // Sales & Reports
  dailySales: DailySales[];
  
  // UI State
  isLoading: boolean;
  currentView: 'login' | 'pdv' | 'admin' | 'produtos' | 'estoque' | 'relatorios';
}