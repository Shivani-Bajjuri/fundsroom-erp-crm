import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React Component Tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleLogout = () => {
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_token');
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-rose-500/30 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white">Application Error</h2>
              <p className="text-xs text-slate-400 mt-2">
                An unexpected error occurred in the application view. We prevented a blank screen from rendering.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-dark-900/90 border border-slate-800 text-left text-xs font-mono text-rose-300 break-words max-h-32 overflow-y-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" /> Reload View
              </button>
              <button
                onClick={this.handleLogout}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
              >
                <LogOut className="w-4 h-4" /> Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
