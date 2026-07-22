import axios from 'axios';
import { Customer, Product, SalesChallan, InventoryLog, User, Role } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_CHALLANS, INITIAL_INVENTORY_LOGS } from './mockData';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('erp_user');
      localStorage.removeItem('erp_token');
    }
    return Promise.reject(error);
  }
);

// Mock Storage Helpers
const getStorage = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(`mock_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(`mock_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to set mock storage for key ${key}`, err);
  }
};

// Initialize Mock Storage if empty
if (!localStorage.getItem('mock_customers')) setStorage('customers', INITIAL_CUSTOMERS);
if (!localStorage.getItem('mock_products')) setStorage('products', INITIAL_PRODUCTS);
if (!localStorage.getItem('mock_challans')) setStorage('challans', INITIAL_CHALLANS);
if (!localStorage.getItem('mock_inventory_logs')) setStorage('inventory_logs', INITIAL_INVENTORY_LOGS);

export const AuthService = {
  login: async (email: string, password?: string): Promise<{ token: string; user: User }> => {
    try {
      const res = await api.post('/auth/login', { email, password: password || '123456' });
      if (res.data && res.data.success) {
        return res.data;
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch {
      // Mock Fallback matching roles
      let role: Role = 'ADMIN';
      let name = 'Admin User';
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('sales')) {
        role = 'SALES';
        name = 'Sales Representative';
      } else if (lowerEmail.includes('warehouse')) {
        role = 'WAREHOUSE';
        name = 'Warehouse Manager';
      } else if (lowerEmail.includes('accounts')) {
        role = 'ACCOUNTS';
        name = 'Accounts Controller';
      }

      // Check registered mock users first
      const mockUsers = getStorage<User[]>('registered_users', []);
      const found = mockUsers.find(u => u && u.email && u.email.toLowerCase() === lowerEmail);
      if (found) {
        const mockToken = `mock-jwt-token-${found.role.toLowerCase()}-${Date.now()}`;
        return { token: mockToken, user: found };
      }

      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        name,
        email,
        role,
      };

      const mockToken = `mock-jwt-token-${role.toLowerCase()}-${Date.now()}`;
      return { token: mockToken, user: mockUser };
    }
  },

  signup: async (data: { name: string; email: string; password: string; role: Role }): Promise<{ token: string; user: User }> => {
    try {
      const res = await api.post('/auth/signup', data);
      if (res.data && res.data.success) {
        return res.data;
      }
      throw new Error(res.data?.message || 'Sign up failed');
    } catch {
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: data.role,
      };

      const existingUsers = getStorage<User[]>('registered_users', []);
      setStorage('registered_users', [...existingUsers, newUser]);

      const mockToken = `mock-jwt-token-${data.role.toLowerCase()}-${Date.now()}`;
      return { token: mockToken, user: newUser };
    }
  }
};

export const CustomerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const res = await api.get('/customers');
      return res.data?.data || res.data || [];
    } catch {
      return getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
    }
  },
  getById: async (id: number): Promise<Customer | null> => {
    try {
      const res = await api.get(`/customers/${id}`);
      return res.data?.data || null;
    } catch {
      const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
      return list.find(c => c && c.id === id) || null;
    }
  },
  create: async (data: Partial<Customer>): Promise<Customer> => {
    try {
      const res = await api.post('/customers', data);
      return res.data?.data;
    } catch {
      const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
      const newCustomer: Customer = {
        id: Date.now(),
        name: data.name || '',
        email: data.email || '',
        mobile: data.mobile || '',
        businessName: data.businessName || '',
        gst: data.gst || null,
        type: data.type || 'RETAIL',
        address: data.address || '',
        status: data.status || 'LEAD',
        followUpDate: data.followUpDate || null,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newCustomer, ...list];
      setStorage('customers', updated);
      return newCustomer;
    }
  },
  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    try {
      const res = await api.put(`/customers/${id}`, data);
      return res.data?.data;
    } catch {
      const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
      const index = list.findIndex(c => c && c.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
        setStorage('customers', list);
        return list[index];
      }
      throw new Error('Customer not found');
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/customers/${id}`);
    } catch {
      const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
      setStorage('customers', list.filter(c => c && c.id !== id));
    }
  },
  addNote: async (id: number, note: string): Promise<Customer> => {
    try {
      const res = await api.post(`/customers/${id}/notes`, { note });
      return res.data?.data;
    } catch {
      const list = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
      const index = list.findIndex(c => c && c.id === id);
      if (index !== -1) {
        const existingNotes = list[index].notes ? `${list[index].notes}\n` : '';
        list[index].notes = `${existingNotes}[${new Date().toLocaleDateString()}] ${note}`;
        setStorage('customers', list);
        return list[index];
      }
      throw new Error('Customer not found');
    }
  }
};

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const res = await api.get('/products');
      return res.data?.data || res.data || [];
    } catch {
      return getStorage<Product[]>('products', INITIAL_PRODUCTS);
    }
  },
  getLowStock: async (): Promise<Product[]> => {
    try {
      const res = await api.get('/products/low-stock');
      return res.data?.data || [];
    } catch {
      const list = getStorage<Product[]>('products', INITIAL_PRODUCTS);
      return list.filter(p => p && p.stock <= p.minStock);
    }
  },
  create: async (data: Partial<Product>): Promise<Product> => {
    try {
      const res = await api.post('/products', data);
      return res.data?.data;
    } catch {
      const list = getStorage<Product[]>('products', INITIAL_PRODUCTS);
      const newProd: Product = {
        id: Date.now(),
        name: data.name || '',
        sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
        category: data.category || 'General',
        unitPrice: Number(data.unitPrice) || 0,
        stock: Number(data.stock) || 0,
        minStock: Number(data.minStock) || 5,
        location: data.location || 'Warehouse Main',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newProd, ...list];
      setStorage('products', updated);
      return newProd;
    }
  },
  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data?.data;
    } catch {
      const list = getStorage<Product[]>('products', INITIAL_PRODUCTS);
      const index = list.findIndex(p => p && p.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
        setStorage('products', list);
        return list[index];
      }
      throw new Error('Product not found');
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch {
      const list = getStorage<Product[]>('products', INITIAL_PRODUCTS);
      setStorage('products', list.filter(p => p && p.id !== id));
    }
  },
  stockMovement: async (productId: number, quantity: number, movement: 'IN' | 'OUT', reason: string, user: User): Promise<Product> => {
    const list = getStorage<Product[]>('products', INITIAL_PRODUCTS);
    const prodIndex = list.findIndex(p => p && p.id === productId);
    if (prodIndex === -1) throw new Error('Product not found');
    
    if (movement === 'OUT' && list[prodIndex].stock < quantity) {
      throw new Error(`Insufficient stock. Current stock is ${list[prodIndex].stock}`);
    }

    const qtyNumber = Number(quantity);
    list[prodIndex].stock += movement === 'IN' ? qtyNumber : -qtyNumber;
    list[prodIndex].updatedAt = new Date().toISOString();
    setStorage('products', list);

    // Record Log
    const logs = getStorage<InventoryLog[]>('inventory_logs', INITIAL_INVENTORY_LOGS);
    const newLog: InventoryLog = {
      id: Date.now(),
      productId,
      quantity: qtyNumber,
      movement,
      reason,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      user: { name: user.name, email: user.email },
      product: { name: list[prodIndex].name, sku: list[prodIndex].sku }
    };
    setStorage('inventory_logs', [newLog, ...logs]);

    return list[prodIndex];
  }
};

export const ChallanService = {
  getAll: async (): Promise<SalesChallan[]> => {
    try {
      const res = await api.get('/challans');
      return res.data?.data || res.data || [];
    } catch {
      return getStorage<SalesChallan[]>('challans', INITIAL_CHALLANS);
    }
  },
  create: async (data: { customerId: number; items: { productId: number; quantity: number }[] }, user: User): Promise<SalesChallan> => {
    try {
      const res = await api.post('/challans', data);
      return res.data?.data;
    } catch {
      const list = getStorage<SalesChallan[]>('challans', INITIAL_CHALLANS);
      const customers = getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
      const products = getStorage<Product[]>('products', INITIAL_PRODUCTS);

      const customer = customers.find(c => c && c.id === data.customerId);
      const challanItems = (data.items || []).map(item => {
        const prod = products.find(p => p && p.id === item.productId);
        return {
          id: Date.now() + Math.floor(Math.random() * 100),
          productId: item.productId,
          productName: prod ? prod.name : 'Product',
          unitPrice: prod ? prod.unitPrice : 0,
          quantity: item.quantity
        };
      });

      const totalQty = challanItems.reduce((acc, curr) => acc + curr.quantity, 0);

      const newChallan: SalesChallan = {
        id: Date.now(),
        challanNumber: `SCH-2026-${(list.length + 1).toString().padStart(3, '0')}`,
        customerId: data.customerId,
        status: 'DRAFT',
        totalQuantity: totalQty,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        customer,
        user,
        items: challanItems
      };

      const updated = [newChallan, ...list];
      setStorage('challans', updated);
      return newChallan;
    }
  },
  updateStatus: async (id: number, status: 'CONFIRMED' | 'CANCELLED'): Promise<SalesChallan> => {
    try {
      const res = await api.patch(`/challans/${id}/status`, { status });
      return res.data?.data;
    } catch {
      const list = getStorage<SalesChallan[]>('challans', INITIAL_CHALLANS);
      const index = list.findIndex(c => c && c.id === id);
      if (index !== -1) {
        list[index].status = status;
        setStorage('challans', list);
        return list[index];
      }
      throw new Error('Sales Challan not found');
    }
  }
};

export const InventoryLogService = {
  getAll: async (): Promise<InventoryLog[]> => {
    try {
      return getStorage<InventoryLog[]>('inventory_logs', INITIAL_INVENTORY_LOGS);
    } catch {
      return INITIAL_INVENTORY_LOGS;
    }
  }
};
