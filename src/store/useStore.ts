import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Product, StockItem, OrderItem, Order, PaymentMethod, ProductSize } from '../types';

// Dados mockados iniciais
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Açaí Tradicional',
    description: 'Açaí puro batido na hora',
    sizes: [
      { size: 'PP', price: 8.00 },
      { size: 'P', price: 12.00 },
      { size: 'M', price: 16.00 },
      { size: 'G', price: 22.00 }
    ],
    category: 'acai',
    active: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Granola',
    description: 'Granola crocante',
    sizes: [{ size: 'P', price: 2.50 }],
    category: 'cobertura',
    active: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Banana',
    description: 'Banana fatiada',
    sizes: [{ size: 'P', price: 1.50 }],
    category: 'cobertura',
    active: true,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Leite Condensado',
    description: 'Leite condensado cremoso',
    sizes: [{ size: 'P', price: 2.00 }],
    category: 'cobertura',
    active: true,
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Suco de Laranja',
    description: 'Suco natural de laranja',
    sizes: [
      { size: 'P', price: 4.00 },
      { size: 'M', price: 6.00 },
      { size: 'G', price: 8.00 }
    ],
    category: 'bebidas',
    active: true,
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Água Mineral',
    description: 'Água mineral 500ml',
    sizes: [{ size: 'P', price: 2.50 }],
    category: 'bebidas',
    active: true,
    createdAt: new Date()
  },
  {
    id: '7',
    name: 'Guardanapo',
    description: 'Guardanapo descartável',
    sizes: [{ size: 'P', price: 0.50 }],
    category: 'outros',
    active: true,
    createdAt: new Date()
  }
];

const mockStock: StockItem[] = [
  {
    id: '1',
    productId: '1',
    size: 'PP',
    packages: 4,
    potsPerPackage: 25,
    availablePots: 100,
    minimumLevel: 10,
    lastUpdated: new Date()
  },
  {
    id: '2',
    productId: '1',
    size: 'P',
    packages: 3,
    potsPerPackage: 25,
    availablePots: 75,
    minimumLevel: 10,
    lastUpdated: new Date()
  },
  {
    id: '3',
    productId: '1',
    size: 'M',
    packages: 2,
    potsPerPackage: 25,
    availablePots: 50,
    minimumLevel: 10,
    lastUpdated: new Date()
  },
  {
    id: '4',
    productId: '1',
    size: 'G',
    packages: 1,
    potsPerPackage: 25,
    availablePots: 25,
    minimumLevel: 10,
    lastUpdated: new Date()
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'admin',
    email: 'admin@acaishop.com'
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'funcionario',
    email: 'funcionario@acaishop.com'
  }
];

interface StoreActions {
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
  
  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Stock Actions
  updateStock: (productId: string, size: ProductSize, packages: number) => void;
  consumeStock: (productId: string, size: ProductSize, quantity: number) => boolean;
  getStockByProduct: (productId: string, size: ProductSize) => StockItem | undefined;
  
  // Order Actions
  addToCurrentOrder: (item: Omit<OrderItem, 'id'>) => void;
  updateOrderItem: (id: string, updates: Partial<OrderItem>) => void;
  removeFromCurrentOrder: (id: string) => void;
  clearCurrentOrder: () => void;
  finalizeOrder: (paymentMethod: PaymentMethod, customerName?: string) => boolean;
  
  // Report Actions
  getOrdersByDateRange: (startDate: Date, endDate: Date) => Order[];
  getOrdersByPaymentMethod: (paymentMethod: PaymentMethod) => Order[];
  getDailySales: (date: string) => Order[];
  calculateDailyTotal: (date: string) => number;
}

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      products: mockProducts,
      stock: mockStock,
      currentOrder: [],
      orders: [],
      dailySales: [],
      isLoading: false,
      currentView: 'login',

      // Auth Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Mock authentication - em produção seria uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email);
        
        if (user && password === '123456') {
          set({ 
            currentUser: user, 
            isAuthenticated: true, 
            isLoading: false,
            currentView: user.role === 'admin' ? 'admin' : 'pdv'
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ 
          currentUser: null, 
          isAuthenticated: false, 
          currentView: 'login',
          currentOrder: []
        });
      },

      setCurrentView: (view) => {
        set({ currentView: view });
      },

      // Product Actions
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        
        set(state => ({
          products: [...state.products, newProduct]
        }));
      },

      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }));
      },

      // Stock Actions
      updateStock: (productId, size, packages) => {
        set(state => ({
          stock: state.stock.map(item => {
            if (item.productId === productId && item.size === size) {
              return {
                ...item,
                packages,
                availablePots: packages * item.potsPerPackage,
                lastUpdated: new Date()
              };
            }
            return item;
          })
        }));
      },

      consumeStock: (productId, size, quantity) => {
        const { stock } = get();
        const stockItem = stock.find(item => 
          item.productId === productId && item.size === size
        );
        
        if (!stockItem || stockItem.availablePots < quantity) {
          return false;
        }
        
        set(state => ({
          stock: state.stock.map(item => {
            if (item.productId === productId && item.size === size) {
              const newAvailablePots = item.availablePots - quantity;
              return {
                ...item,
                availablePots: newAvailablePots,
                packages: Math.floor(newAvailablePots / item.potsPerPackage),
                lastUpdated: new Date()
              };
            }
            return item;
          })
        }));
        
        return true;
      },

      getStockByProduct: (productId, size) => {
        const { stock } = get();
        return stock.find(item => 
          item.productId === productId && item.size === size
        );
      },

      // Order Actions
      addToCurrentOrder: (itemData) => {
        const newItem: OrderItem = {
          ...itemData,
          id: Date.now().toString()
        };
        
        set(state => ({
          currentOrder: [...state.currentOrder, newItem]
        }));
      },

      updateOrderItem: (id, updates) => {
        set(state => ({
          currentOrder: state.currentOrder.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        }));
      },

      removeFromCurrentOrder: (id) => {
        set(state => ({
          currentOrder: state.currentOrder.filter(item => item.id !== id)
        }));
      },

      clearCurrentOrder: () => {
        set({ currentOrder: [] });
      },

      finalizeOrder: (paymentMethod, customerName) => {
        const { currentOrder, currentUser, consumeStock } = get();
        
        if (!currentOrder.length || !currentUser) return false;
        
        // Verificar e consumir estoque para cada item
        for (const item of currentOrder) {
          if (item.productName === 'Açaí Tradicional') {
            const success = consumeStock(item.productId, item.size, item.quantity);
            if (!success) return false;
          }
        }
        
        const total = currentOrder.reduce((sum, item) => {
          const itemTotal = item.price * item.quantity;
          const toppingsTotal = item.toppings.reduce((tSum, topping) => tSum + topping.price, 0);
          return sum + itemTotal + (toppingsTotal * item.quantity);
        }, 0);
        
        const newOrder: Order = {
          id: Date.now().toString(),
          items: currentOrder,
          total,
          paymentMethod,
          customerName,
          status: 'completed',
          createdAt: new Date(),
          completedAt: new Date(),
          cashierId: currentUser.id,
          cashierName: currentUser.name
        };
        
        set(state => ({
          orders: [...state.orders, newOrder],
          currentOrder: []
        }));
        
        return true;
      },

      // Report Actions
      getOrdersByDateRange: (startDate, endDate) => {
        const { orders } = get();
        return orders.filter(order => {
          const orderDate = order.createdAt;
          return orderDate >= startDate && orderDate <= endDate;
        });
      },

      getOrdersByPaymentMethod: (paymentMethod) => {
        const { orders } = get();
        return orders.filter(order => order.paymentMethod === paymentMethod);
      },

      getDailySales: (date) => {
        const { orders } = get();
        const targetDate = new Date(date);
        
        return orders.filter(order => {
          const orderDate = order.createdAt;
          return orderDate.toDateString() === targetDate.toDateString();
        });
      },

      calculateDailyTotal: (date) => {
        const { getDailySales } = get();
        const orders = getDailySales(date);
        return orders.reduce((total, order) => total + order.total, 0);
      }
    }),
    {
      name: 'acai-pdv-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        products: state.products,
        stock: state.stock,
        orders: state.orders,
        currentView: state.currentView
      })
    }
  )
);