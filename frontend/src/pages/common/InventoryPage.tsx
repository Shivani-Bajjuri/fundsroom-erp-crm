import React, { useState, useEffect } from 'react';
import { ProductService, InventoryLogService } from '../../services/api';
import { Product, InventoryLog } from '../../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { useAuth } from '../../context/AuthContext';

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');

  const [productId, setProductId] = useState<number>(0);
  const [qty, setQty] = useState<number>(10);
  const [reason, setReason] = useState('Stock adjustment');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, l] = await Promise.all([ProductService.getAll(), InventoryLogService.getAll()]);
      setProducts(Array.isArray(p) ? p : []);
      setLogs(Array.isArray(l) ? l : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingSpinner message="Retrieving inventory logs..." />;
  if (error) return <ErrorAlert title="Inventory Audit Log Error" message={error} onRetry={loadData} />;

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !user) return;
    try {
      await ProductService.stockMovement(productId, qty, movementType, reason, user);
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Transaction failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory Movements & Stock Ledger</h1>
          <p className="text-xs text-slate-400">Track Stock IN / Stock OUT audit logs and current warehouse inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMovementType('IN'); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            <ArrowUpRight className="w-4 h-4" /> Stock IN
          </button>
          <button
            onClick={() => { setMovementType('OUT'); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
          >
            <ArrowDownLeft className="w-4 h-4" /> Stock OUT
          </button>
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-3">Inventory Log Audit History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Movement</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {(logs || []).map(l => (
                <tr key={l?.id}>
                  <td className="py-3 text-slate-400">{l?.createdAt ? new Date(l.createdAt).toLocaleString() : ''}</td>
                  <td className="py-3 font-semibold text-white">{l?.product?.name || 'Product'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l?.movement === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      STOCK {l?.movement}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-white">{l?.quantity || 0}</td>
                  <td className="py-3 text-slate-300">{l?.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Record Stock ${movementType}`}>
        <form onSubmit={handleTransaction} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Product SKU</label>
            <select required className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={productId} onChange={e => setProductId(Number(e.target.value))}>
              <option value={0}>Choose product...</option>
              {(products || []).map(p => <option key={p?.id} value={p?.id}>{p?.name} (Stock: {p?.stock})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
            <input required type="number" min={1} className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={qty} onChange={e => setQty(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Note</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <button type="submit" className={`w-full py-2 rounded-xl text-white font-bold text-xs ${movementType === 'IN' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            Execute Stock {movementType}
          </button>
        </form>
      </Modal>
    </div>
  );
};
