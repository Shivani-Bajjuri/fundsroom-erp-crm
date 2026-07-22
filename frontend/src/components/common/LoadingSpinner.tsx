import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading workspace data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] w-full">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
      <p className="text-xs font-semibold text-slate-400 tracking-wide">{message}</p>
    </div>
  );
};
