import React, { useState, useEffect } from 'react';
import { ChallanService, CustomerService, ProductService } from '../../services/api';
import { SalesChallan, Customer, Product } from '../../types';
import { Plus, Printer, CheckCircle2, XCircle, User as UserIcon, Package, ShoppingCart } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { useAuth } from '../../context/AuthContext';

export const ChallansPage: React.FC = () => {
  const { user } = useAuth();
  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<SalesChallan | null>(null);

  // New Challan Form
  const [customerId, setCustomerId] = useState<number>(0);
  const [selectedProdId, setSelectedProdId] = useState<number>(0);
  const [prodQty, setProdQty] = useState<number>(1);
  const [items, setItems] = useState<{ productId: number; productName: string; unitPrice: number; quantity: number }[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ch, c, p] = await Promise.all([
        ChallanService.getAll(),
        CustomerService.getAll(),
        ProductService.getAll()
      ]);
      setChallans(Array.isArray(ch) ? ch : []);
      setCustomers(Array.isArray(c) ? c : []);
      setProducts(Array.isArray(p) ? p : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales challans data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingSpinner message="Fetching sales challans..." />;
  if (error) return <ErrorAlert title="Challans Module Error" message={error} onRetry={loadData} />;

  const handleAddItem = () => {
    const prod = (products || []).find(p => p && p.id === selectedProdId);
    if (!prod) return;
    setItems([...items, { productId: prod.id, productName: prod.name, unitPrice: prod.unitPrice, quantity: prodQty }]);
  };

  const handleCreateChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.length === 0 || !user) return;
    try {
      await ChallanService.create({ customerId, items }, user);
      setIsModalOpen(false);
      setItems([]);
      setCustomerId(0);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create sales challan');
    }
  };

  const handleStatusChange = async (id: number, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await ChallanService.updateStatus(id, status);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update challan status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Sales Challans Module</h1>
          <p className="text-xs text-slate-400">Generate, confirm, print, and track delivery challans</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Create Challan
        </button>
      </div>

      <div className="glass-card p-5 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="pb-3">Challan Number</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total Qty</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {(challans || []).map(ch => (
                <tr key={ch?.id}>
                  <td className="py-3 font-mono font-bold text-white">{ch?.challanNumber}</td>
                  <td className="py-3 text-slate-300">{ch?.customer?.name || 'Customer'}</td>
                  <td className="py-3 text-slate-400">{ch?.totalQuantity || 0} items</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ch?.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' :
                      ch?.status === 'DRAFT' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {ch?.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{ch?.createdAt ? new Date(ch.createdAt).toLocaleDateString() : ''}</td>
                  <td className="py-3 flex items-center gap-2">
                    {ch?.status === 'DRAFT' && (
                      <>
                        <button onClick={() => handleStatusChange(ch.id, 'CONFIRMED')} className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" title="Confirm Challan">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleStatusChange(ch.id, 'CANCELLED')} className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30" title="Cancel Challan">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => setSelectedChallan(ch)} className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white" title="Print Preview">
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Challan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate New Sales Challan"
        subtitle="Create a delivery sales order challan for a registered customer"
      >
        <form onSubmit={handleCreateChallan} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" /> Select Customer
            </label>
            <select
              required
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={customerId}
              onChange={e => setCustomerId(Number(e.target.value))}
            >
              <option value={0}>Choose customer...</option>
              {(customers || []).map(c => <option key={c?.id} value={c?.id}>{c?.name} ({c?.businessName})</option>)}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-700/70 space-y-3">
            <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" /> Add Line Items
            </p>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                value={selectedProdId}
                onChange={e => setSelectedProdId(Number(e.target.value))}
              >
                <option value={0}>Choose item from catalog...</option>
                {(products || []).map(p => <option key={p?.id} value={p?.id}>{p?.name} - ₹{p?.unitPrice}</option>)}
              </select>
              <input
                type="number"
                min={1}
                className="w-20 px-2 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                value={prodQty}
                onChange={e => setProdQty(Number(e.target.value))}
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
              >
                Add
              </button>
            </div>
            {(items || []).map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-300 pt-1.5 border-t border-slate-800">
                <span className="flex items-center gap-1 font-medium">
                  <Package className="w-3 h-3 text-cyan-400" /> {it.productName} (x{it.quantity})
                </span>
                <span className="font-mono text-cyan-400 font-semibold">₹{(it.unitPrice || 0) * (it.quantity || 0)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" /> Save Draft Challan
            </button>
          </div>
        </form>
      </Modal>

      {/* Print View Modal */}
      {selectedChallan && (
        <Modal isOpen={!!selectedChallan} onClose={() => setSelectedChallan(null)} title={`Print Challan - ${selectedChallan.challanNumber}`}>
          <div className="bg-white text-slate-900 p-6 rounded-xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <div>
                <h2 className="font-bold text-lg text-indigo-900">FUNDSROOM ENTERPRISE</h2>
                <p className="text-xs text-slate-600">Official Delivery Sales Challan</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold">{selectedChallan.challanNumber}</p>
                <p className="text-xs text-slate-500">{selectedChallan.createdAt ? new Date(selectedChallan.createdAt).toLocaleDateString() : ''}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700 uppercase">Customer Details:</p>
              <p className="text-sm font-semibold">{selectedChallan.customer?.name}</p>
              <p className="text-xs text-slate-600">{selectedChallan.customer?.businessName}</p>
              <p className="text-xs text-slate-600">{selectedChallan.customer?.address}</p>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-2">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {(selectedChallan.items || []).map((it, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 font-medium">{it.productName}</td>
                    <td className="p-2">{it.quantity}</td>
                    <td className="p-2">₹{it.unitPrice}</td>
                    <td className="p-2 font-bold">₹{(it.unitPrice || 0) * (it.quantity || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-4">
              <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow">
                Print Document
              </button>
              <span className="text-xs font-bold uppercase px-3 py-1 bg-slate-200 rounded">
                Status: {selectedChallan.status}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
