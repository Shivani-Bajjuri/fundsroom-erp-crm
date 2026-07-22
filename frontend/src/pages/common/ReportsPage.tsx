import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, Download, FileSpreadsheet, Printer } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{user.role} Departmental Analytics & Reports</h1>
          <p className="text-xs text-slate-400">Exportable metrics tailored for {user.role.toLowerCase()} operations</p>
        </div>
        <button
          onClick={() => alert('Generating PDF report...')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Department Summary</h3>
          <p className="text-xs text-slate-400">Quarterly audit breakdown for {user.role}.</p>
        </div>
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">CSV Data Export</h3>
          <p className="text-xs text-slate-400">Download formatted CSV spreadsheet containing raw data.</p>
        </div>
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <Printer className="w-6 h-6 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Print View</h3>
          <p className="text-xs text-slate-400">Clean formatted printable view for management presentations.</p>
        </div>
      </div>
    </div>
  );
};
