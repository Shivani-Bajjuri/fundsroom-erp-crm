import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomerService, ProductService, ChallanService, InventoryLogService } from '../../services/api';
import { Customer, Product, SalesChallan, InventoryLog } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Package,
  Boxes,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States for Quick Actions
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);

  // Form inputs
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', mobile: '', businessName: '', type: 'WHOLESALE', address: '' });
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: 'Hardware', unitPrice: 0, stock: 0, minStock: 5, location: 'Warehouse Main' });
  const [selectedProdForStock, setSelectedProdForStock] = useState<number>(0);
  const [stockQty, setStockQty] = useState<number>(10);
  const [stockReason, setStockReason] = useState('Admin manual stock addition');

  const loadData = async () => {
    setLoading(true);
    const [c, p, ch, logs] = await Promise.all([
      CustomerService.getAll(),
      ProductService.getAll(),
      ChallanService.getAll(),
      InventoryLogService.getAll()
    ]);
    setCustomers(c);
    setProducts(p);
    setChallans(ch);
    setInventoryLogs(logs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Metrics
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.unitPrice * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  
  const draftChallans = challans.filter(c => c.status === 'DRAFT').length;
  const confirmedChallans = challans.filter(c => c.status === 'CONFIRMED').length;
  const cancelledChallans = challans.filter(c => c.status === 'CANCELLED').length;
  
  const totalRevenue = challans
    .filter(c => c.status === 'CONFIRMED')
    .reduce((acc, c) => acc + c.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0), 0);

  // Chart Data Configurations
  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: [120000, 190000, 300000, 250000, 420000, 510000, totalRevenue || 680000],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const customerGrowthData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'New Customers Acquired',
        data: [14, 28, 45, 62],
        backgroundColor: '#6366f1'
      }
    ]
  };

  const inventoryCategoryData = {
    labels: ['Hardware', 'Networking', 'Cables', 'Accessories'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
        borderWidth: 0
      }
    ]
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    await CustomerService.create(customerForm as any);
    setIsCustomerModalOpen(false);
    loadData();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await ProductService.create(productForm as any);
    setIsProductModalOpen(false);
    loadData();
  };

  const handleStockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdForStock || !user) return;
    await ProductService.stockMovement(selectedProdForStock, stockQty, 'IN', stockReason, user);
    setIsStockInModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-dark-800 to-cyan-950/40 border border-indigo-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Super Admin Control Center
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              Full System Access
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-department monitoring across Customers, Products, Inventory, and Sales.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/30"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30"
          >
            <ArrowUpRight className="w-4 h-4" /> Stock In
          </button>
        </div>
      </div>

      {/* Admin Summary Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          change="+18% vs last month"
          icon={Users}
          accentColor="text-indigo-400"
          subtitle="Active retail & wholesale client base"
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          accentColor="text-cyan-400"
          subtitle="Cataloged SKUs in warehouse"
        />
        <StatCard
          title="Inventory Value"
          value={`₹${inventoryValue.toLocaleString('en-IN')}`}
          change="+8.4%"
          icon={Boxes}
          accentColor="text-amber-400"
          subtitle="Total asset value of stock"
        />
        <StatCard
          title="Low Stock Products"
          value={lowStockProducts.length}
          isPositive={false}
          change={lowStockProducts.length > 0 ? 'Requires Stock In' : 'Stock Optimal'}
          icon={AlertTriangle}
          accentColor="text-rose-400"
          subtitle="Products at or below min threshold"
        />
      </div>

      {/* Sales Challan Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-indigo-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Sales Challans</p>
            <h4 className="text-xl font-bold text-white mt-1">{challans.length}</h4>
          </div>
          <FileSpreadsheet className="w-8 h-8 text-indigo-400/80" />
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-amber-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Draft Challans</p>
            <h4 className="text-xl font-bold text-amber-400 mt-1">{draftChallans}</h4>
          </div>
          <Clock className="w-8 h-8 text-amber-400/80" />
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Confirmed Challans</p>
            <h4 className="text-xl font-bold text-emerald-400 mt-1">{confirmedChallans}</h4>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400/80" />
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-rose-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Cancelled Challans</p>
            <h4 className="text-xl font-bold text-rose-400 mt-1">{cancelledChallans}</h4>
          </div>
          <XCircle className="w-8 h-8 text-rose-400/80" />
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Revenue & Monthly Sales Trend
            </h3>
            <span className="text-xs text-slate-400">YTD 2026</span>
          </div>
          <div className="h-64">
            <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4">Inventory Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut data={inventoryCategoryData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activities & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stock Movements */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Recent Stock Movements
          </h3>
          <div className="space-y-3">
            {inventoryLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-dark-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log.movement === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {log.movement === 'IN' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{log.product?.name || 'Product'}</p>
                    <p className="text-[10px] text-slate-400">{log.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold ${log.movement === 'IN' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {log.movement === 'IN' ? `+${log.quantity}` : `-${log.quantity}`}
                  </span>
                  <p className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" /> Cataloged Product Inventory Status
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {products.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-semibold text-white">{p.name}</td>
                    <td className="py-2.5 font-mono text-slate-400">{p.sku}</td>
                    <td className="py-2.5 text-cyan-400 font-bold">₹{p.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock <= p.minStock ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODALS */}
      {/* 1. Add Customer Modal */}
      <Modal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} title="Create New Customer">
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input required type="email" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile</label>
              <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={customerForm.mobile} onChange={e => setCustomerForm({...customerForm, mobile: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={customerForm.businessName} onChange={e => setCustomerForm({...customerForm, businessName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
            <textarea required className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" rows={2} value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg">
            Save Customer
          </button>
        </form>
      </Modal>

      {/* 2. Add Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Create New Product SKU">
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU</label>
              <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={productForm.sku} onChange={e => setProductForm({...productForm, sku: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Price (₹)</label>
              <input required type="number" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={productForm.unitPrice} onChange={e => setProductForm({...productForm, unitPrice: Number(e.target.value)})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock</label>
              <input required type="number" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Threshold</label>
              <input required type="number" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={productForm.minStock} onChange={e => setProductForm({...productForm, minStock: Number(e.target.value)})} />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-lg">
            Save Product SKU
          </button>
        </form>
      </Modal>

      {/* 3. Stock In Modal */}
      <Modal isOpen={isStockInModalOpen} onClose={() => setIsStockInModalOpen(false)} title="Stock In - Add Quantity">
        <form onSubmit={handleStockIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Product</label>
            <select required className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={selectedProdForStock} onChange={e => setSelectedProdForStock(Number(e.target.value))}>
              <option value={0}>Choose a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Current Stock: {p.stock})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity to Add</label>
            <input required type="number" min={1} className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Reference</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={stockReason} onChange={e => setStockReason(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg">
            Confirm Stock In
          </button>
        </form>
      </Modal>
    </div>
  );
};
