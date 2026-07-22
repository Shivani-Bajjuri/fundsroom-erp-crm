import React, { useState } from 'react';
import { Settings, Save, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('Fundsroom Enterprise');
  const [currency, setCurrency] = useState('INR (₹)');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Admin ERP Settings
        </h1>
        <p className="text-xs text-slate-400">Global system configuration, tax rates, and organization parameters</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Default Base Currency</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-white"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          />
        </div>

        <button
          onClick={() => alert('Settings saved!')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
        >
          <Save className="w-4 h-4" /> Save System Settings
        </button>
      </div>
    </div>
  );
};
