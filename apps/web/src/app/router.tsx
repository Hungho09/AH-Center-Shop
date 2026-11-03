import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/main-layout';
import { LoginPage } from '../features/auth/login-page';
import { DashboardPage } from '../features/dashboard/dashboard-page';
import { ProductsPage } from '../features/products/products-page';
import { CategoriesPage } from '../features/categories/categories-page';
import { PurchasesPage } from '../features/purchases/purchases-page';
import { PosPage } from '../features/sales/pos-page';
import { InvoicesPage } from '../features/sales/invoices-page';
import { CustomersPage } from '../features/customers/customers-page';
import { LoyaltyPage } from '../features/loyalty/loyalty-page';
import { EmployeesPage } from '../features/employees/employees-page';
import { ShiftsPage } from '../features/shifts/shifts-page';
import { ShiftAssignmentsPage } from '../features/shifts/shift-assignments-page';
import { InventoryPage } from '../features/inventory/inventory-page';
import { InventoryLossPage } from '../features/inventory-loss/inventory-loss-page';
import { ReportsPage } from '../features/reports/reports-page';
import { NotFoundPage } from '../features/not-found/not-found-page';
import { useAuth } from './auth-context';
import { Permission } from '@ql/contracts';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/button';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const PermissionGuardRoute: React.FC<{
  permission: Permission;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const { can } = useAuth();

  if (!can(permission)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-gray-200">
        <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Quyền truy cập bị từ chối
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-4">
          Tài khoản của bạn không có quyền <code>{permission}</code> để thực hiện chức năng này.
        </p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </div>
    );
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
      {
        path: 'products',
        element: (
          <PermissionGuardRoute permission="product.view">
            <ProductsPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'categories',
        element: (
          <PermissionGuardRoute permission="category.manage">
            <CategoriesPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'purchases',
        element: (
          <PermissionGuardRoute permission="purchase.order.view">
            <PurchasesPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'pos',
        element: (
          <PermissionGuardRoute permission="sales.pos.access">
            <PosPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'invoices',
        element: (
          <PermissionGuardRoute permission="sales.invoice.view">
            <InvoicesPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'customers',
        element: (
          <PermissionGuardRoute permission="customer.view">
            <CustomersPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'loyalty',
        element: (
          <PermissionGuardRoute permission="loyalty.points.view">
            <LoyaltyPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'employees',
        element: (
          <PermissionGuardRoute permission="hr.employee.view">
            <EmployeesPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'shifts',
        element: (
          <PermissionGuardRoute permission="hr.shift.view">
            <ShiftsPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'shift-assignments',
        element: (
          <PermissionGuardRoute permission="hr.shift.assign">
            <ShiftAssignmentsPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'inventory',
        element: (
          <PermissionGuardRoute permission="inventory.view">
            <InventoryPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'inventory-loss',
        element: (
          <PermissionGuardRoute permission="inventory.loss.view">
            <InventoryLossPage />
          </PermissionGuardRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <PermissionGuardRoute permission="report.revenue.view">
            <ReportsPage />
          </PermissionGuardRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

