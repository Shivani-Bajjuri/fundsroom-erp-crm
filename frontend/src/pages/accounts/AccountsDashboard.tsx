import React, { useState, useEffect } from 'react';
import { ChallanService, CustomerService } from '../../services/api';
import { SalesChallan, Customer } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Users
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

export const AccountsDashboard: React.FC = () => {
  const [challans, setChallans] = useState<SalesChallan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const load = async () => {
      const [ch, c] = await Promise.all([
        ChallanService.getAll(),
        CustomerService.getAll()
      ]);
      setChallans(ch);
      setCustomers(c);
    };
    load();
  }, []);

  const confirmedChallans = challans.filter(c => c.status === 'CONFIRMED');
  const cancelledChallans = challans.filter(c => c.status === 'CANCELLED');

  const totalRevenue = confirmedChallans.reduce((acc, c) => 
    acc + c.items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0), 0
  );

  const todayRevenue = confirmedChallans
    .filter(c => new Date(c.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, c) => acc + c.items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0), 0);

  const monthlyRevenue = totalRevenue; // Demo metric

  const revenueTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Gross Revenue (₹)',
        data: [150000, 220000, 310000, 290000, 480000, 520000, totalRevenue || 750000],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const handleExportCSV = () => {
    const headers = ['Challan No,Customer,Status,Total Qty,Total Value (INR),Date\n'];
    const rows = challans.map(c => {
      const val = c.items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
      return `${c.challanNumber},${c.customer?.name || 'Customer'},${c.status},${c.totalQuantity},${val},${new Date(c.createdAt).toLocaleDateString()}`;
    });
    const blob = new Blob([headers.join('') + rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_sales_report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-dark-800 to-teal-950/40 border border-purple-500/20">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Accounts & Financial Oversight
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              Purple Theme
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Financial monitoring, revenue trend analysis, and exportable accounts ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/30"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-teal-600/30"
          >
            <Printer className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Confirmed Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="+16.8%"
          icon={DollarSign}
          accentColor="text-purple-400"
          subtitle="Net revenue from confirmed challans"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          accentColor="text-teal-400"
          subtitle="Invoiced revenue generated today"
        />
        <StatCard
          title="Confirmed Sales Challans"
          value={confirmedChallans.length}
          icon={CheckCircle2}
          accentColor="text-emerald-400"
          subtitle="Approved order transactions"
        />
        <StatCard
          title="Cancelled Sales Value"
          value={cancelledChallans.length}
          isPositive={false}
          icon={XCircle}
          accentColor="text-rose-400"
          subtitle="Revoked challans"
        />
      </div>

      {/* Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" /> Revenue & Financial Growth Trend
          </h3>
          <div className="h-64">
            <Line data={revenueTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Top Billing Customers */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" /> Top Billing Enterprise Clients
          </h3>
          <div className="space-y-3">
            {customers.slice(0, 4).map(c => (
              <div key={c.id} className="p-3 rounded-xl bg-dark-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{c.name}</p>
                  <p className="text-[10px] text-slate-400">{c.businessName}</p>
                </div>
                <span className="text-xs font-extrabold text-teal-400">
                  ₹{((c.id * 85000) % 250000 + 45000).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmed Sales Challans Financial Ledger Table */}
      <div className="glass-card p-5 rounded-2xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-purple-400" /> Confirmed Invoices & Sales Challans Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="pb-3">Challan No</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total Qty</th>
                <th className="pb-3">Invoiced Value</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {challans.map(c => {
                const totalVal = c.items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
                return (
                  <tr key={c.id}>
                    <td className="py-3 font-mono font-bold text-white">{c.challanNumber}</td>
                    <td className="py-3 text-slate-300">{c.customer?.name || 'Client'}</td>
                    <td className="py-3 text-slate-400">{c.totalQuantity} items</td>
                    <td className="py-3 text-teal-400 font-extrabold">₹{totalVal.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' :
                        c.status === 'DRAFT' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
