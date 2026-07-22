import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 ml-64 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
