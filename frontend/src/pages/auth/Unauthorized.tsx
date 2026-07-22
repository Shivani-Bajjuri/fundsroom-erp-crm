import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleReturnDashboard = () => {
    if (user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md glass-card p-8 rounded-3xl border border-rose-500/30 shadow-2xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white">403 Unauthorized</h1>
          <p className="text-sm text-slate-400 mt-2">
            Access Denied! Your logged-in role (<span className="text-rose-400 font-bold uppercase">{user?.role || 'Guest'}</span>) does not have permission to view this department route.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800 text-left text-xs space-y-1 text-slate-400">
          <p className="flex items-center gap-1 text-rose-400 font-semibold">
            <Lock className="w-3.5 h-3.5" /> Department Security Enforced:
          </p>
          <p>Each role operates inside its dedicated software environment.</p>
        </div>

        <button
          onClick={handleReturnDashboard}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to My Role Dashboard
        </button>
      </div>
    </div>
  );
};
