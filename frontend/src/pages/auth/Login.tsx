import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Building2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup inputs
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('ADMIN');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) {
      redirectByRole(user.role);
    }
  }, [user]);

  const redirectByRole = (role: Role) => {
    switch (role) {
      case 'ADMIN': navigate('/admin/dashboard', { replace: true }); break;
      case 'SALES': navigate('/sales/dashboard', { replace: true }); break;
      case 'WAREHOUSE': navigate('/warehouse/dashboard', { replace: true }); break;
      case 'ACCOUNTS': navigate('/accounts/dashboard', { replace: true }); break;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const loggedUser = await login(email, password);
      redirectByRole(loggedUser.role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const newUser = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole
      });
      redirectByRole(newUser.role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="w-full max-w-sm bg-[#0F172A] border border-[#1E293B] rounded-2xl p-7 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#78A4CB]/10 border border-[#78A4CB]/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#78A4CB]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">FUNDSROOM</h1>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Enterprise ERP & CRM</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 mb-6 bg-[#080C14] rounded-xl border border-[#1E293B]">
          <button
            onClick={() => { setMode('LOGIN'); setErrorMsg(''); }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'LOGIN' ? 'bg-[#1E293B] text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('SIGNUP'); setErrorMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'SIGNUP' ? 'bg-[#1E293B] text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Credentials Hint Box */}
        <div className="mb-5 p-3 rounded-lg bg-[#080C14] border border-[#1E293B] text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Quick Test Credentials:</p>
          <p>• Admin: <span className="font-mono text-[#78A4CB]">admin@fundsroom.com</span></p>
          <p>• Sales: <span className="font-mono text-[#78A4CB]">sales@fundsroom.com</span></p>
          <p>• Warehouse: <span className="font-mono text-[#78A4CB]">warehouse@fundsroom.com</span></p>
          <p>• Accounts: <span className="font-mono text-[#78A4CB]">accounts@fundsroom.com</span></p>
          <p className="text-[10px] text-slate-500 pt-0.5">(Password: any, e.g. <span className="font-mono">123456</span>)</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'LOGIN' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#78A4CB] transition-colors"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#78A4CB] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#78A4CB] hover:bg-[#95BDD7] text-[#080C14] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full name</label>
              <input
                required
                type="text"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#78A4CB] transition-colors"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Work email</label>
              <input
                required
                type="email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#78A4CB] transition-colors"
                placeholder="name@fundsroom.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Department role</label>
              <select
                value={signupRole}
                onChange={e => setSignupRole(e.target.value as Role)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#78A4CB] transition-colors"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SALES">SALES</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
                <option value="ACCOUNTS">ACCOUNTS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <input
                required
                type="password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#78A4CB] transition-colors"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-slate-400 mt-1">Min 8 chars (uppercase, lowercase, number & special char)</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#78A4CB] hover:bg-[#95BDD7] text-[#080C14] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? 'Registering...' : 'Create account'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
