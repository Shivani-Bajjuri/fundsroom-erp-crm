import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px]">
            <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {user.name.charAt(0)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Role: {user.role}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-800/50">
            <span className="text-slate-400">User ID</span>
            <span className="font-mono text-white">#USER-00{user.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/50">
            <span className="text-slate-400">Assigned Department</span>
            <span className="font-semibold text-cyan-400">{user.role} Operations</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Security Access Level</span>
            <span className="font-semibold text-emerald-400">Verified Token Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
