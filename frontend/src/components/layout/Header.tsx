import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Shield, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Super Admin Control Center';
      case 'SALES': return 'Sales & Client Relationship Hub';
      case 'WAREHOUSE': return 'Inventory & Stock Operations';
      case 'ACCOUNTS': return 'Financial Analytics & Reports';
      default: return 'Departmental Portal';
    }
  };

  return (
    <header className="h-16 bg-dark-800/50 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20 flex items-center justify-between px-6 ml-64">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          {getRoleTitle(user.role)}
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Active Session
          </span>
        </h2>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records, SKU, customer..."
            className="w-full pl-9 pr-4 py-1.5 bg-dark-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-dark-900/50 hover:bg-slate-800 border border-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* Current User Role Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/80 border border-slate-800">
          <Shield className="w-4 h-4 text-[var(--role-primary)]" />
          <span className="text-xs font-semibold text-slate-300">{user.name}</span>
        </div>
      </div>
    </header>
  );
};
