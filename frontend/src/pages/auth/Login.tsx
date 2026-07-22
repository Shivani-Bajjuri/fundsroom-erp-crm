import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Building2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, signup, user, isAuthenticated, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Check state message from router redirect
  useEffect(() => {
    if (location.state?.message) {
      setErrorMsg(location.state.message);
    } else if (authError) {
      setErrorMsg(authError);
    }
  }, [location.state, authError]);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      redirectByRole(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectByRole = (role: Role) => {
    switch (role) {
      case 'ADMIN': navigate('/admin/dashboard', { replace: true }); break;
      case 'SALES': navigate('/sales/dashboard', { replace: true }); break;
      case 'WAREHOUSE': navigate('/warehouse/dashboard', { replace: true }); break;
      case 'ACCOUNTS': navigate('/accounts/dashboard', { replace: true }); break;
      default: navigate('/403', { replace: true }); break;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    if (setAuthError) setAuthError(null);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser && loggedUser.role) {
        redirectByRole(loggedUser.role);
      }
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
    if (setAuthError) setAuthError(null);
    try {
      const newUser = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole
      });
      if (newUser && newUser.role) {
        redirectByRole(newUser.role);
      }
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
            onClick={() => { setMode('LOGIN'); setErrorMsg(''); if (setAuthError) setAuthError(null); }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'LOGIN' ? 'bg-[#1E293B] text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('SIGNUP'); setErrorMsg(''); if (setAuthError) setAuthError(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'SIGNUP' ? 'bg-[#1E293B] text-slate-100' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
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
