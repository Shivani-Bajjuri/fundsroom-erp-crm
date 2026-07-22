import React, { useState, useEffect } from 'react';
import { CustomerService } from '../../services/api';
import { Customer } from '../../types';
import { Search, Plus, UserCheck, MessageSquare, Trash2, Edit } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    businessName: '',
    type: 'WHOLESALE',
    address: '',
    status: 'ACTIVE'
  });

  const loadData = async () => {
    const data = await CustomerService.getAll();
    setCustomers(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await CustomerService.create(form as any);
    setIsModalOpen(false);
    loadData();
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Customer Directory & CRM</h1>
          <p className="text-xs text-slate-400">Manage client databases, contact info, and lead notes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-dark-900 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Business</th>
                <th className="pb-3">Mobile & Email</th>
                <th className="pb-3">GST</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Follow up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="py-3 font-semibold text-white">{c.name}</td>
                  <td className="py-3 text-slate-300">{c.businessName}</td>
                  <td className="py-3 text-slate-400">{c.mobile} | {c.email}</td>
                  <td className="py-3 text-slate-400 font-mono">{c.gst || 'N/A'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{c.followUpDate || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Name</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input required type="email" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile</label>
              <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
            <input required type="text" className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
            <textarea required className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white" rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">Save Customer</button>
        </form>
      </Modal>
    </div>
  );
};
