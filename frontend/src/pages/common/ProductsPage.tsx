import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/api';
import { Product } from '../../types';
import { Search, Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
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
    const data = await ProductService.getAll();
    setProducts(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await ProductService.create(form as any);
    setIsModalOpen(false);
    loadData();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
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
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg"
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
            className="w-full pl-9 pr-3 py-1.5 bg-dark-900 border border-slate-800 rounded-xl text-xs text-white"
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
                <tr key={p.id}>
                  <td className="py-3 font-semibold text-white">{p.name}</td>
                  <td className="py-3 font-mono text-cyan-400">{p.sku}</td>
                  <td className="py-3 text-slate-300">{p.category}</td>
                  <td className="py-3 text-white font-bold">₹{p.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock <= p.minStock ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Product">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Code</label>
              <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Price (₹)</label>
              <input required type="number" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: Number(e.target.value)})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock</label>
              <input required type="number" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Threshold</label>
              <input required type="number" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.minStock} onChange={e => setForm({...form, minStock: Number(e.target.value)})} />
            </div>
          </div>
          <button type="submit" className="w-full py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs">Save Product SKU</button>
        </form>
      </Modal>
    </div>
  );
};
