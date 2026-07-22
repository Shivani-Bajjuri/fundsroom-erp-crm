import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/api';
import { Product } from '../../types';
import { Search, Plus, Package, Tag, DollarSign, Boxes, AlertTriangle, MapPin } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Hardware',
    unitPrice: 0,
    stock: 0,
    minStock: 5,
    location: 'Main Warehouse'
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingSpinner message="Fetching catalog SKUs..." />;
  if (error) return <ErrorAlert title="Products Catalog Error" message={error} onRetry={loadData} />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProductService.create(form as any);
      setIsModalOpen(false);
      setForm({ name: '', sku: '', category: 'Hardware', unitPrice: 0, stock: 0, minStock: 5, location: 'Main Warehouse' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const filtered = (products || []).filter(p =>
    (p?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p?.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Products Catalog & SKUs</h1>
          <p className="text-xs text-slate-400">Inventory item definitions, prices, and locations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Add Product SKU
        </button>
      </div>

      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Unit Price</th>
                <th className="pb-3">Stock Level</th>
                <th className="pb-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(p => (
                <tr key={p?.id}>
                  <td className="py-3 font-semibold text-white">{p?.name}</td>
                  <td className="py-3 font-mono text-cyan-400">{p?.sku}</td>
                  <td className="py-3 text-slate-300">{p?.category}</td>
                  <td className="py-3 text-white font-bold">₹{(p?.unitPrice || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${(p?.stock || 0) <= (p?.minStock || 0) ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {p?.stock || 0} units
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{p?.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Product SKU"
        subtitle="Catalog a new product with stock thresholds and pricing"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-cyan-400" /> Product Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Gigabit Managed Switch 48-Port"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> SKU Code
              </label>
              <input
                required
                type="text"
                placeholder="e.g. SWT-48P-GB"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={form.sku}
                onChange={e => setForm({...form, sku: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Unit Price (₹)
              </label>
              <input
                required
                type="number"
                placeholder="28500"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={form.unitPrice}
                onChange={e => setForm({...form, unitPrice: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-cyan-400" /> Initial Stock Quantity
              </label>
              <input
                required
                type="number"
                placeholder="10"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={form.stock}
                onChange={e => setForm({...form, stock: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Min Stock Threshold
              </label>
              <input
                required
                type="number"
                placeholder="5"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                value={form.minStock}
                onChange={e => setForm({...form, minStock: Number(e.target.value)})}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Warehouse Location / Shelf
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Warehouse Section A - Shelf 04"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" /> Save Product SKU
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
