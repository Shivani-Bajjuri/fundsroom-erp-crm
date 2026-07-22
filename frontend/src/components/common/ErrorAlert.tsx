import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Failed to load data',
  message,
  onRetry
}) => {
  return (
    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-rose-300">{title}</h4>
          <p className="text-xs text-rose-200/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </button>
      )}
    </div>
  );
};
