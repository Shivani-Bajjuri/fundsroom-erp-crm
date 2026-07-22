import React, { useState, useEffect } from 'react';
import { ProductService, InventoryLogService } from '../../services/api';
import { Product, InventoryLog } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { useAuth } from '../../context/AuthContext';
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Activity,
  BarChart2,
  Package,
  Tag,
  DollarSign,
  Layers,
  FileText,
  MapPin
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';

export const WarehouseDashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [stockQty, setStockQty] = useState<number>(10);
  const [stockReason, setStockReason] = useState('Stock replenishment');

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Hardware',
    unitPrice: 1000,
    stock: 20,
    minStock: 5,
    location: 'Warehouse Section A'
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, logs] = await Promise.all([
        ProductService.getAll(),
        InventoryLogService.getAll()
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setInventoryLogs(Array.isArray(logs) ? logs : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch warehouse inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Accessing Warehouse & Inventory System..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-white">Warehouse & Inventory Command Center</h1>
        <ErrorAlert title="Warehouse Dashboard Error" message={error} onRetry={loadData} />
      </div>
    );
  }

  const totalStockItems = (products || []).reduce((acc, p) => acc + (p?.stock || 0), 0);
  const lowStockAlerts = (products || []).filter(p => p && p.stock <= p.minStock);
  const todayStockIn = (inventoryLogs || []).filter(l => l && l.movement === 'IN').reduce((acc, l) => acc + (l?.quantity || 0), 0);
  const todayStockOut = (inventoryLogs || []).filter(l => l && l.movement === 'OUT').reduce((acc, l) => acc + (l?.quantity || 0), 0);

  const stockMovementChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Stock IN',
        data: [40, 65, 30, 80, 55, todayStockIn || 90],
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Stock OUT',
        data: [20, 35, 45, 50, 30, todayStockOut || 60],
        backgroundColor: '#f97316',
      }
    ]
  };

  const warehouseDistributionData = {
    labels: ['Section A', 'Section B', 'Section C', 'Overflow Storage'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ['#f59e0b', '#f97316', '#d97706', '#b45309']
      }
    ]
  };

  const handleStockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !user) return;
    try {
      await ProductService.stockMovement(selectedProductId, stockQty, 'IN', stockReason, user);
      setIsStockInModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Stock IN failed');
    }
  };

  const handleStockOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !user) return;
    try {
      await ProductService.stockMovement(selectedProductId, stockQty, 'OUT', stockReason, user);
      setIsStockOutModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Stock OUT failed');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProductService.create(productForm as any);
      setIsProductModalOpen(false);
      setProductForm({ name: '', sku: '', category: 'Hardware', unitPrice: 1000, stock: 20, minStock: 5, location: 'Warehouse Section A' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-dark-800 to-orange-950/40 border border-amber-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Warehouse & Inventory Command Center
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Amber Theme
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time stock control, inventory movement tracking, and low-stock alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowUpRight className="w-4 h-4" /> Stock In
          </button>
          <button
            onClick={() => setIsStockOutModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowDownLeft className="w-4 h-4" /> Stock Out
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Inventory Summary"
          value={`${totalStockItems} Units`}
          icon={Boxes}
          accentColor="text-amber-400"
          subtitle="Total aggregate items in stock"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockAlerts.length}
          isPositive={false}
          icon={AlertTriangle}
          accentColor="text-rose-400"
          subtitle="Products at min threshold"
        />
        <StatCard
          title="Today's Stock In"
          value={`+${todayStockIn} Units`}
          icon={ArrowUpRight}
          accentColor="text-emerald-400"
          subtitle="Received shipments today"
        />
        <StatCard
          title="Today's Stock Out"
          value={`-${todayStockOut} Units`}
          icon={ArrowDownLeft}
          accentColor="text-orange-400"
          subtitle="Dispatched orders today"
        />
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" /> Stock Movement History (IN vs OUT)
          </h3>
          <div className="h-64">
            <Bar data={stockMovementChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4">Warehouse Zone Storage</h3>
          <div className="h-56 flex items-center justify-center">
            <Pie data={warehouseDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Tables Row: Low Stock Alerts & Inventory Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Running Low */}
        <div className="glass-card p-5 rounded-2xl border-l-4 border-rose-500">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Low Stock Alerts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Current</th>
                  <th className="pb-2">Min Level</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {(lowStockAlerts || []).map(p => (
                  <tr key={p?.id}>
                    <td className="py-2.5 font-semibold text-white">{p?.name}</td>
                    <td className="py-2.5 font-mono text-slate-400">{p?.sku}</td>
                    <td className="py-2.5 font-bold text-rose-400">{p?.stock}</td>
                    <td className="py-2.5 text-slate-400">{p?.minStock}</td>
                    <td className="py-2.5">
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setIsStockInModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inventory Logs */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> Recent Inventory Logs
          </h3>
          <div className="space-y-3">
            {(inventoryLogs || []).slice(0, 4).map(log => (
              <div key={log?.id} className="p-3 rounded-xl bg-dark-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log?.movement === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {log?.movement === 'IN' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{log?.product?.name || 'Product'}</p>
                    <p className="text-[10px] text-slate-400">{log?.reason || 'Stock Update'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold ${log?.movement === 'IN' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {log?.movement === 'IN' ? `+${log?.quantity || 0}` : `-${log?.quantity || 0}`}
                  </span>
                  <p className="text-[10px] text-slate-500">{log?.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* 1. STOCK IN MODAL */}
      <Modal
        isOpen={isStockInModalOpen}
        onClose={() => setIsStockInModalOpen(false)}
        title="Stock In Transaction"
        subtitle="Record restocked inventory items entering the warehouse"
      >
        <form onSubmit={handleStockIn} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Select Product
            </label>
            <select
              required
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={selectedProductId}
              onChange={e => setSelectedProductId(Number(e.target.value))}
            >
              <option value={0}>Choose product...</option>
              {(products || []).map(p => (
                <option key={p?.id} value={p?.id}>{p?.name} (Stock: {p?.stock})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Quantity
            </label>
            <input
              required
              type="number"
              min={1}
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={stockQty}
              onChange={e => setStockQty(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Reason / Invoice Reference
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Stock replenishment batch #2026"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={stockReason}
              onChange={e => setStockReason(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <ArrowUpRight className="w-4 h-4" /> Record Stock IN
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. STOCK OUT MODAL */}
      <Modal
        isOpen={isStockOutModalOpen}
        onClose={() => setIsStockOutModalOpen(false)}
        title="Stock Out Transaction"
        subtitle="Record inventory items dispatched or removed from stock"
      >
        <form onSubmit={handleStockOut} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-400" /> Select Product
            </label>
            <select
              required
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
              value={selectedProductId}
              onChange={e => setSelectedProductId(Number(e.target.value))}
            >
              <option value={0}>Choose product...</option>
              {(products || []).map(p => (
                <option key={p?.id} value={p?.id}>{p?.name} (Available Stock: {p?.stock})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-rose-400" /> Dispatch Quantity
            </label>
            <input
              required
              type="number"
              min={1}
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
              value={stockQty}
              onChange={e => setStockQty(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" /> Reason / Sales Order Reference
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Sales Challan SCH-2026-001 dispatch"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
              value={stockReason}
              onChange={e => setStockReason(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <ArrowDownLeft className="w-4 h-4" /> Record Stock OUT
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. CREATE PRODUCT MODAL */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Create New Product"
        subtitle="Catalog a new product SKU into warehouse stock"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" /> Product Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Cat6 Shielded Patch Cable 10m"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={productForm.name}
              onChange={e => setProductForm({...productForm, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> SKU Code
              </label>
              <input
                required
                type="text"
                placeholder="CAB-C6-10M"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                value={productForm.sku}
                onChange={e => setProductForm({...productForm, sku: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Unit Price (₹)
              </label>
              <input
                required
                type="number"
                placeholder="650"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                value={productForm.unitPrice}
                onChange={e => setProductForm({...productForm, unitPrice: Number(e.target.value)})}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Warehouse Section Location
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Warehouse Section A - Bay 12"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={productForm.location}
              onChange={e => setProductForm({...productForm, location: e.target.value})}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" /> Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
