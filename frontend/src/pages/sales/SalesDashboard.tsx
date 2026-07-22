import React, { useState, useEffect } from 'react';
import { CustomerService, ChallanService } from '../../services/api';
import { Customer, SalesChallan } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  Clock,
  Plus,
  MessageSquare,
  User as UserIcon,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

export const SalesDashboard: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  // Customer Form
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    mobile: '',
    businessName: '',
    type: 'WHOLESALE',
    address: '',
    followUpDate: '2026-07-28'
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, ch] = await Promise.all([
        CustomerService.getAll(),
        ChallanService.getAll()
      ]);
      setCustomers(Array.isArray(c) ? c : []);
      setChallans(Array.isArray(ch) ? ch : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Sales Workspace..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-white">Sales & Client Workspace</h1>
        <ErrorAlert title="Sales Dashboard Error" message={error} onRetry={loadData} />
      </div>
    );
  }

  const todaySales = (challans || [])
    .filter(c => c && c.status === 'CONFIRMED' && new Date(c.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, c) => acc + (c.items || []).reduce((s, i) => s + ((i?.unitPrice || 0) * (i?.quantity || 0)), 0), 0);

  const monthlySales = (challans || [])
    .filter(c => c && c.status === 'CONFIRMED')
    .reduce((acc, c) => acc + (c.items || []).reduce((s, i) => s + ((i?.unitPrice || 0) * (i?.quantity || 0)), 0), 0);

  const todayLeads = (customers || []).filter(c => c && c.status === 'LEAD').length;
  const activeCustomers = (customers || []).filter(c => c && c.status === 'ACTIVE').length;
  const upcomingFollowups = (customers || []).filter(c => c && c.followUpDate).length;
  const pendingChallans = (challans || []).filter(c => c && c.status === 'DRAFT').length;

  const salesPerformanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sales Closed (₹)',
        data: [45000, 120000, 210000, monthlySales || 350000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CustomerService.create({ ...customerForm, status: 'LEAD' } as any);
      setIsCustomerModalOpen(false);
      setCustomerForm({ name: '', email: '', mobile: '', businessName: '', type: 'WHOLESALE', address: '', followUpDate: '2026-07-28' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add customer');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !noteText) return;
    try {
      await CustomerService.addNote(selectedCustomerId, noteText);
      setIsNoteModalOpen(false);
      setNoteText('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add follow-up note');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sales Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-dark-800 to-blue-950/40 border border-emerald-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Sales & Client Workspace
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Emerald Theme
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Convert leads, maintain customer relations, and generate sales challans seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Sales Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Today's Sales"
          value={`₹${todaySales.toLocaleString('en-IN')}`}
          icon={DollarSign}
          accentColor="text-emerald-400"
        />
        <StatCard
          title="Monthly Sales"
          value={`₹${monthlySales.toLocaleString('en-IN')}`}
          change="+14.2%"
          icon={TrendingUp}
          accentColor="text-blue-400"
        />
        <StatCard
          title="Today's Leads"
          value={todayLeads}
          icon={UserCheck}
          accentColor="text-emerald-400"
        />
        <StatCard
          title="Active Clients"
          value={activeCustomers}
          icon={UserCheck}
          accentColor="text-cyan-400"
        />
        <StatCard
          title="Follow-ups"
          value={upcomingFollowups}
          icon={Calendar}
          accentColor="text-amber-400"
        />
        <StatCard
          title="Pending Challans"
          value={pendingChallans}
          icon={Clock}
          accentColor="text-rose-400"
        />
      </div>

      {/* Sales Performance Graph & Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Sales Performance Trend
          </h3>
          <div className="h-64">
            <Line data={salesPerformanceData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4">Upcoming Follow-ups</h3>
          <div className="space-y-3">
            {(customers || []).filter(c => c && c.followUpDate).slice(0, 4).map(c => (
              <div key={c?.id} className="p-3 rounded-xl bg-dark-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{c?.name}</p>
                  <p className="text-[10px] text-slate-400">{c?.businessName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                    {c?.followUpDate}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCustomerId(c.id);
                      setIsNoteModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-emerald-400"
                    title="Add Follow-up Note"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Module Table */}
      <div className="glass-card p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" /> Managed Customers & Leads
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Business</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Notes</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {(customers || []).map(c => (
                <tr key={c?.id}>
                  <td className="py-3 font-semibold text-white">{c?.name}</td>
                  <td className="py-3 text-slate-300">{c?.businessName}</td>
                  <td className="py-3 text-slate-400">{c?.mobile} | {c?.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {c?.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c?.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {c?.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 max-w-xs truncate">{c?.notes || 'No notes'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setIsNoteModalOpen(true);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-[10px] transition-colors"
                    >
                      + Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Create Customer Lead"
        subtitle="Record a new lead profile in the sales CRM"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" /> Customer Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Priya Verma"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={customerForm.name}
              onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="priya@company.com"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={customerForm.email}
                onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Mobile Number
              </label>
              <input
                required
                type="text"
                placeholder="+91 98123 45678"
                className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={customerForm.mobile}
                onChange={e => setCustomerForm({...customerForm, mobile: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-400" /> Business / Enterprise Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Apex Retail Outlets"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={customerForm.businessName}
              onChange={e => setCustomerForm({...customerForm, businessName: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Address
            </label>
            <textarea
              required
              rows={2}
              placeholder="Shop / Office address"
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={customerForm.address}
              onChange={e => setCustomerForm({...customerForm, address: e.target.value})}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" /> Save Sales Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Followup Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Add Follow-up Note"
        subtitle="Append interaction notes to the customer profile"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Note / Interaction Details
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter details of call, meeting, or quote discussion..."
              className="w-full px-3.5 py-2.5 bg-[#1E293B]/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4" /> Append Follow-up Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
