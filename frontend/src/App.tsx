import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Unauthorized } from './pages/auth/Unauthorized';

// Dashboards
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SalesDashboard } from './pages/sales/SalesDashboard';
import { WarehouseDashboard } from './pages/warehouse/WarehouseDashboard';
import { AccountsDashboard } from './pages/accounts/AccountsDashboard';

// Common pages
import { CustomersPage } from './pages/common/CustomersPage';
import { ProductsPage } from './pages/common/ProductsPage';
import { InventoryPage } from './pages/common/InventoryPage';
import { ChallansPage } from './pages/common/ChallansPage';
import { ReportsPage } from './pages/common/ReportsPage';
import { ProfilePage } from './pages/common/ProfilePage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Smart Home / Root Redirector Component
const RootRedirector: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user || !user.role) {
    return <Navigate to="/login" replace />;
  }
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
    case 'SALES': return <Navigate to="/sales/dashboard" replace />;
    case 'WAREHOUSE': return <Navigate to="/warehouse/dashboard" replace />;
    case 'ACCOUNTS': return <Navigate to="/accounts/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/403" element={<Unauthorized />} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/customers" element={<CustomersPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/inventory" element={<InventoryPage />} />
              <Route path="/admin/challans" element={<ChallansPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>

            {/* SALES PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['SALES']} />}>
              <Route path="/sales/dashboard" element={<SalesDashboard />} />
              <Route path="/sales/customers" element={<CustomersPage />} />
              <Route path="/sales/challans" element={<ChallansPage />} />
              <Route path="/sales/reports" element={<ReportsPage />} />
              <Route path="/sales/profile" element={<ProfilePage />} />
            </Route>

            {/* WAREHOUSE PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['WAREHOUSE']} />}>
              <Route path="/warehouse/dashboard" element={<WarehouseDashboard />} />
              <Route path="/warehouse/products" element={<ProductsPage />} />
              <Route path="/warehouse/inventory" element={<InventoryPage />} />
              <Route path="/warehouse/low-stock" element={<ProductsPage />} />
              <Route path="/warehouse/reports" element={<ReportsPage />} />
              <Route path="/warehouse/profile" element={<ProfilePage />} />
            </Route>

            {/* ACCOUNTS PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ACCOUNTS']} />}>
              <Route path="/accounts/dashboard" element={<AccountsDashboard />} />
              <Route path="/accounts/sales-reports" element={<ReportsPage />} />
              <Route path="/accounts/financial-reports" element={<ReportsPage />} />
              <Route path="/accounts/profile" element={<ProfilePage />} />
            </Route>

            {/* Root Redirect & Fallback */}
            <Route path="/" element={<RootRedirector />} />
            <Route path="*" element={<RootRedirector />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
