import React, { useState, useEffect } from 'react';
import { ProductService, InventoryLogService } from '../../services/api';
import { Product, InventoryLog } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Package,
  Activity,
  BarChart2
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';

export const WarehouseDashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
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
    const [p, logs] = await Promise.all([
      ProductService.getAll(),
      InventoryLogService.getAll()
    ]);
    setProducts(p);
    setInventoryLogs(logs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockAlerts = products.filter(p => p.stock <= p.minStock);
  const todayStockIn = inventoryLogs.filter(l => l.movement === 'IN').reduce((acc, l) => acc + l.quantity, 0);
  const todayStockOut = inventoryLogs.filter(l => l.movement === 'OUT').reduce((acc, l) => acc + l.quantity, 0);

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
    await ProductService.stockMovement(selectedProductId, stockQty, 'IN', stockReason, user);
    setIsStockInModalOpen(false);
    loadData();
  };

  const handleStockOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !user) return;
    try {
      await ProductService.stockMovement(selectedProductId, stockQty, 'OUT', stockReason, user);
      setIsStockOutModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await ProductService.create(productForm as any);
    setIsProductModalOpen(false);
    loadData();
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/30"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30"
          >
            <ArrowUpRight className="w-4 h-4" /> Stock In
          </button>
          <button
            onClick={() => setIsStockOutModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30"
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
                {lowStockAlerts.map(p => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-semibold text-white">{p.name}</td>
                    <td className="py-2.5 font-mono text-slate-400">{p.sku}</td>
                    <td className="py-2.5 font-bold text-rose-400">{p.stock}</td>
                    <td className="py-2.5 text-slate-400">{p.minStock}</td>
                    <td className="py-2.5">
                      <button
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setIsStockInModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]"
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
            {inventoryLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-dark-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log.movement === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {log.movement === 'IN' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{log.product?.name || 'Product'}</p>
                    <p className="text-[10px] text-slate-400">{log.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold ${log.movement === 'IN' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {log.movement === 'IN' ? `+${log.quantity}` : `-${log.quantity}`}
                  </span>
                  <p className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Stock In Modal */}
      <Modal isOpen={isStockInModalOpen} onClose={() => setIsStockInModalOpen(false)} title="Stock In Transaction">
        <form onSubmit={handleStockIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Product</label>
            <select required className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={selectedProductId} onChange={e => setSelectedProductId(Number(e.target.value))}>
              <option value={0}>Choose product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
            <input required type="number" min={1} className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={stockReason} onChange={e => setStockReason(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg">
            Record Stock IN
          </button>
        </form>
      </Modal>

      {/* Stock Out Modal */}
      <Modal isOpen={isStockOutModalOpen} onClose={() => setIsStockOutModalOpen(false)} title="Stock Out Transaction">
        <form onSubmit={handleStockOut} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Product</label>
            <select required className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={selectedProductId} onChange={e => setSelectedProductId(Number(e.target.value))}>
              <option value={0}>Choose product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Available Stock: {p.stock})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Quantity</label>
            <input required type="number" min={1} className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Order Ref</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={stockReason} onChange={e => setStockReason(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg">
            Record Stock OUT
          </button>
        </form>
      </Modal>

      {/* Create Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Create New Product">
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
          <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg">
            Save Product
          </button>
        </form>
      </Modal>
    </div>
  );
};
