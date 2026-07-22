import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'text-indigo-400',
  subtitle
}) => {
  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
      {/* Background Subtle Radial Glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        {change && (
          <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
