import React, { useState, useEffect } from 'react';
import { CustomerService } from '../../services/api';
import { Customer } from '../../types';
import { Search, Plus, User as UserIcon, Mail, Phone, Building, MapPin } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerService.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingSpinner message="Loading customer directory..." />;
  if (error) return <ErrorAlert title="Customers Directory Error" message={error} onRetry={loadData} />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CustomerService.create(form as any);
      setIsModalOpen(false);
      setForm({ name: '', email: '', mobile: '', businessName: '', type: 'WHOLESALE', address: '', status: 'ACTIVE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create customer');
    }
  };

  const filtered = (customers || []).filter(c => 
    (c?.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (c?.businessName || '').toLowerCase().includes(search.toLowerCase())
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
            className="w-full pl-9 pr-3 py-2 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
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
                <tr key={c?.id}>
                  <td className="py-3 font-semibold text-white">{c?.name}</td>
                  <td className="py-3 text-slate-300">{c?.businessName}</td>
                  <td className="py-3 text-slate-400">{c?.mobile} | {c?.email}</td>
                  <td className="py-3 text-slate-400 font-mono">{c?.gst || 'N/A'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c?.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {c?.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{c?.followUpDate || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        subtitle="Enter client profile details to register in customer directory"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" /> Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="rahul@company.com"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> Mobile Number
              </label>
              <input
                required
                type="text"
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={form.mobile}
                onChange={e => setForm({...form, mobile: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400" /> Business Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Apex Outlets Ltd"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={form.businessName}
              onChange={e => setForm({...form, businessName: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Complete Address
            </label>
            <textarea
              required
              rows={2}
              placeholder="Street / Office Address, City"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" /> Save Customer Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
