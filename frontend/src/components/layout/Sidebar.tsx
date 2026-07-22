import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  FileSpreadsheet,
  BarChart3,
  Settings,
  User as UserIcon,
  LogOut,
  Building2,
  PieChart,
  AlertTriangle,
  Receipt
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getRoleMenus = (role: Role): MenuItem[] => {
    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Customers', path: '/admin/customers', icon: Users },
          { name: 'Products', path: '/admin/products', icon: Package },
          { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
          { name: 'Sales Challans', path: '/admin/challans', icon: FileSpreadsheet },
          { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
          { name: 'Profile', path: '/admin/profile', icon: UserIcon },
        ];
      case 'SALES':
        return [
          { name: 'Dashboard', path: '/sales/dashboard', icon: LayoutDashboard },
          { name: 'Customers', path: '/sales/customers', icon: Users },
          { name: 'Sales Challans', path: '/sales/challans', icon: FileSpreadsheet },
          { name: 'Reports', path: '/sales/reports', icon: BarChart3 },
          { name: 'Profile', path: '/sales/profile', icon: UserIcon },
        ];
      case 'WAREHOUSE':
        return [
          { name: 'Dashboard', path: '/warehouse/dashboard', icon: LayoutDashboard },
          { name: 'Products', path: '/warehouse/products', icon: Package },
          { name: 'Inventory', path: '/warehouse/inventory', icon: Boxes },
          { name: 'Low Stock', path: '/warehouse/low-stock', icon: AlertTriangle },
          { name: 'Reports', path: '/warehouse/reports', icon: BarChart3 },
          { name: 'Profile', path: '/warehouse/profile', icon: UserIcon },
        ];
      case 'ACCOUNTS':
        return [
          { name: 'Dashboard', path: '/accounts/dashboard', icon: LayoutDashboard },
          { name: 'Sales Reports', path: '/accounts/sales-reports', icon: Receipt },
          { name: 'Financial Reports', path: '/accounts/financial-reports', icon: PieChart },
          { name: 'Profile', path: '/accounts/profile', icon: UserIcon },
        ];
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'bg-[#78A4CB]/20 text-[#B4E1EB] border-[#78A4CB]/40';
      case 'SALES': return 'bg-[#B4E1EB]/20 text-[#B4E1EB] border-[#B4E1EB]/40';
      case 'WAREHOUSE': return 'bg-[#F9E8A2]/20 text-[#F9E8A2] border-[#F9E8A2]/40';
      case 'ACCOUNTS': return 'bg-[#95BDD7]/20 text-[#B4E1EB] border-[#95BDD7]/40';
    }
  };

  const menuItems = getRoleMenus(user.role);

  return (
    <aside className="w-64 bg-dark-800/80 backdrop-blur-xl border-r border-[#95BDD7]/20 flex flex-col h-screen fixed left-0 top-0 z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#95BDD7]/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#78A4CB] via-[#B4E1EB] to-[#F9E8A2] p-[2px] shadow-lg shadow-[#78A4CB]/20">
          <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#B4E1EB]" />
          </div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-wide leading-none">FUNDSROOM</h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#95BDD7]">ERP & CRM</span>
        </div>
      </div>

      {/* Logged in Role Indicator */}
      <div className="mx-4 my-3 p-3 rounded-xl bg-dark-900/90 border border-[#95BDD7]/20 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">ROLE</span>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-extrabold uppercase ${getRoleBadgeColor(user.role)}`}>
          {user.role}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold text-[#95BDD7] uppercase tracking-wider">
          {user.role} Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-800 to-slate-800/40 text-white shadow-md border-l-4 border-[var(--role-primary)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 text-[#95BDD7] transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info & Logout */}
      <div className="p-4 border-t border-[#95BDD7]/20 bg-dark-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-[#B4E1EB] border border-[#95BDD7]/30">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
