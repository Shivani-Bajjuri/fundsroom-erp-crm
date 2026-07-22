import { Customer, Product, SalesChallan, InventoryLog } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'rajesh@techcorp.in',
    mobile: '+91 98765 43210',
    businessName: 'TechCorp Solutions Pvt Ltd',
    gst: '27AAAAA0000A1Z5',
    type: 'WHOLESALE',
    address: 'Suite 402, Trade Tower, BKC, Mumbai',
    status: 'ACTIVE',
    followUpDate: '2026-07-25',
    notes: 'Requested bulk pricing for Q3 hardware refresh.',
    createdAt: '2026-06-15T10:30:00Z',
    updatedAt: '2026-07-20T14:10:00Z'
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'priya@apexretail.com',
    mobile: '+91 98123 45678',
    businessName: 'Apex Retail Outlets',
    gst: '27BBBCA1111B1Z2',
    type: 'RETAIL',
    address: 'Shop 12, High Street Mall, MG Road, Pune',
    status: 'ACTIVE',
    followUpDate: '2026-07-23',
    notes: 'Interested in new inventory catalog demo.',
    createdAt: '2026-06-18T11:20:00Z',
    updatedAt: '2026-07-21T09:00:00Z'
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit@pateltrading.org',
    mobile: '+91 97654 32109',
    businessName: 'Patel Trading House',
    gst: '24CCCDE2222C1Z8',
    type: 'DISTRIBUTOR',
    address: 'Ring Road Industrial Area, Surat, Gujarat',
    status: 'LEAD',
    followUpDate: '2026-07-24',
    notes: 'Initial discussion completed. Pending proposal confirmation.',
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-15T16:45:00Z'
  },
  {
    id: 4,
    name: 'Sunita Reddy',
    email: 'sunita@deccangroup.co.in',
    mobile: '+91 99887 76655',
    businessName: 'Deccan Group',
    gst: '36DDDDF3333D1Z9',
    type: 'WHOLESALE',
    address: 'HITEC City, Phase 2, Hyderabad',
    status: 'ACTIVE',
    followUpDate: null,
    notes: 'Regular monthly order customer.',
    createdAt: '2026-05-10T14:00:00Z',
    updatedAt: '2026-07-10T11:20:00Z'
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    email: 'vikram@mehtaenterprises.com',
    mobile: '+91 91234 56789',
    businessName: 'Mehta Enterprises',
    gst: '07EEEFG4444E1Z1',
    type: 'LEAD' as any,
    address: 'Connaught Place, New Delhi',
    status: 'LEAD',
    followUpDate: '2026-07-28',
    notes: 'Requested product specification brochure.',
    createdAt: '2026-07-19T08:30:00Z',
    updatedAt: '2026-07-19T08:30:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Enterprise Server Rack 42U',
    sku: 'SRK-42U-001',
    category: 'Hardware',
    unitPrice: 45000,
    stock: 18,
    minStock: 5,
    location: 'Warehouse A - Bay 12',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-07-22T08:00:00Z'
  },
  {
    id: 2,
    name: 'Gigabit Managed Switch 48-Port',
    sku: 'SWT-48P-GB',
    category: 'Networking',
    unitPrice: 28500,
    stock: 4,
    minStock: 10, // LOW STOCK ALERT
    location: 'Warehouse A - Shelf 04',
    createdAt: '2026-05-05T12:00:00Z',
    updatedAt: '2026-07-21T15:30:00Z'
  },
  {
    id: 3,
    name: 'Cat6 Shielded Patch Cable 10m',
    sku: 'CAB-C6-10M',
    category: 'Cables & Accessories',
    unitPrice: 650,
    stock: 350,
    minStock: 50,
    location: 'Warehouse B - Bin 88',
    createdAt: '2026-05-10T14:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 4,
    name: 'High Performance Router Pro',
    sku: 'RTR-PRO-100',
    category: 'Networking',
    unitPrice: 18900,
    stock: 3,
    minStock: 8, // LOW STOCK ALERT
    location: 'Warehouse A - Shelf 02',
    createdAt: '2026-06-01T09:00:00Z',
    updatedAt: '2026-07-22T09:15:00Z'
  },
  {
    id: 5,
    name: 'Smart Fiber Optic Transceiver',
    sku: 'TRN-FO-10G',
    category: 'Networking',
    unitPrice: 4200,
    stock: 85,
    minStock: 20,
    location: 'Warehouse B - Bin 14',
    createdAt: '2026-06-12T11:00:00Z',
    updatedAt: '2026-07-18T16:00:00Z'
  }
];

export const INITIAL_CHALLANS: SalesChallan[] = [
  {
    id: 101,
    challanNumber: 'SCH-2026-001',
    customerId: 1,
    status: 'CONFIRMED',
    totalQuantity: 6,
    createdBy: 2,
    createdAt: '2026-07-21T14:30:00Z',
    customer: INITIAL_CUSTOMERS[0],
    items: [
      { id: 1, productId: 1, productName: 'Enterprise Server Rack 42U', unitPrice: 45000, quantity: 2 },
      { id: 2, productId: 2, productName: 'Gigabit Managed Switch 48-Port', unitPrice: 28500, quantity: 4 }
    ]
  },
  {
    id: 102,
    challanNumber: 'SCH-2026-002',
    customerId: 2,
    status: 'DRAFT',
    totalQuantity: 20,
    createdBy: 2,
    createdAt: '2026-07-22T09:00:00Z',
    customer: INITIAL_CUSTOMERS[1],
    items: [
      { id: 3, productId: 3, productName: 'Cat6 Shielded Patch Cable 10m', unitPrice: 650, quantity: 20 }
    ]
  },
  {
    id: 103,
    challanNumber: 'SCH-2026-003',
    customerId: 4,
    status: 'CONFIRMED',
    totalQuantity: 12,
    createdBy: 1,
    createdAt: '2026-07-20T11:15:00Z',
    customer: INITIAL_CUSTOMERS[3],
    items: [
      { id: 4, productId: 5, productName: 'Smart Fiber Optic Transceiver', unitPrice: 4200, quantity: 10 },
      { id: 5, productId: 1, productName: 'Enterprise Server Rack 42U', unitPrice: 45000, quantity: 2 }
    ]
  },
  {
    id: 104,
    challanNumber: 'SCH-2026-004',
    customerId: 3,
    status: 'CANCELLED',
    totalQuantity: 5,
    createdBy: 2,
    createdAt: '2026-07-19T16:00:00Z',
    customer: INITIAL_CUSTOMERS[2],
    items: [
      { id: 6, productId: 4, productName: 'High Performance Router Pro', unitPrice: 18900, quantity: 5 }
    ]
  }
];

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 501,
    productId: 2,
    quantity: 10,
    movement: 'IN',
    reason: 'Vendor stock shipment received',
    createdAt: '2026-07-21T09:30:00Z',
    createdBy: 3,
    user: { name: 'Warehouse Mgr', email: 'warehouse@fundsroom.com' },
    product: { name: 'Gigabit Managed Switch 48-Port', sku: 'SWT-48P-GB' }
  },
  {
    id: 502,
    productId: 1,
    quantity: 2,
    movement: 'OUT',
    reason: 'Sales Challan SCH-2026-001 dispatch',
    createdAt: '2026-07-21T15:00:00Z',
    createdBy: 3,
    user: { name: 'Warehouse Mgr', email: 'warehouse@fundsroom.com' },
    product: { name: 'Enterprise Server Rack 42U', sku: 'SRK-42U-001' }
  },
  {
    id: 503,
    productId: 4,
    quantity: 5,
    movement: 'IN',
    reason: 'Restock batch addition',
    createdAt: '2026-07-22T08:15:00Z',
    createdBy: 3,
    user: { name: 'Warehouse Mgr', email: 'warehouse@fundsroom.com' },
    product: { name: 'High Performance Router Pro', sku: 'RTR-PRO-100' }
  }
];
