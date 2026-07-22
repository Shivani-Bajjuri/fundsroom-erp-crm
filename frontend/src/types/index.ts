export type Role = 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';
export type CustomerStatus = 'LEAD' | 'ACTIVE' | 'INACTIVE';

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gst?: string | null;
  type: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  stock: number;
  minStock: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'IN' | 'OUT';

export interface InventoryLog {
  id: number;
  productId: number;
  quantity: number;
  movement: MovementType;
  reason: string;
  createdAt: string;
  createdBy: number;
  user?: { name: string; email: string };
  product?: { name: string; sku: string };
}

export type ChallanStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface SalesChallanItem {
  id?: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface SalesChallan {
  id: number;
  challanNumber: string;
  customerId: number;
  status: ChallanStatus;
  totalQuantity: number;
  createdBy: number;
  createdAt: string;
  customer?: Customer;
  user?: User;
  items: SalesChallanItem[];
}
