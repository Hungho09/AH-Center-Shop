import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/main-layout';
import { LoginPage } from '../../features/auth/login-page';
import { DashboardPage } from '../../features/dashboard/dashboard-page';
import { ProductsPage } from '../../features/products/products-page';
import { CategoriesPage } from '../../features/categories/categories-page';
import { PurchasesPage } from '../../features/purchases/purchases-page';
import { PosPage } from '../../features/sales/pos-page';
import { InvoicesPage } from '../../features/sales/invoices-page';
import { CustomersPage } from '../../features/customers/customers-page';
import { LoyaltyPage } from '../../features/loyalty/loyalty-page';
import { EmployeesPage } from '../../features/employees/employees-page';
import { ShiftsPage } from '../../features/shifts/shifts-page';
import { ShiftAssignmentsPage } from '../../features/shifts/shift-assignments-page';
import { InventoryPage } from '../../features/inventory/inventory-page';
import { InventoryLossPage } from '../../features/inventory-loss/inventory-loss-page';
import { ReportsPage } from '../../features/reports/reports-page';
import { NotFoundPage } from '../../features/not-found/not-found-page';
import { useAuthStore } from '../../stores/auth.store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'purchases', element: <PurchasesPage /> },
      { path: 'pos', element: <PosPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'loyalty', element: <LoyaltyPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'shifts', element: <ShiftsPage /> },
      { path: 'shift-assignments', element: <ShiftAssignmentsPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'inventory-loss', element: <InventoryLossPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

