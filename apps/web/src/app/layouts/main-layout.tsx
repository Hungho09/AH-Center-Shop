import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ShoppingCart,
  Receipt,
  Users,
  Award,
  UserCheck,
  Clock,
  CalendarCheck,
  Boxes,
  Trash2,
  BarChart3,
  LogOut,
  Menu,
  X,
  Store,
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '../auth-context';
import { Permission } from '@ql/contracts';
import { cn } from '../../utils/cn';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  permission?: Permission;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Sản phẩm', path: '/products', icon: Package, permission: 'product.view' },
  { name: 'Danh mục hàng hóa', path: '/categories', icon: Layers, permission: 'category.manage' },
  { name: 'Nhập hàng', path: '/purchases', icon: Truck, permission: 'purchase.order.view' },
  { name: 'Bán hàng (POS)', path: '/pos', icon: ShoppingCart, permission: 'sales.pos.access' },
  { name: 'Hóa đơn', path: '/invoices', icon: Receipt, permission: 'sales.invoice.view' },
  { name: 'Khách hàng', path: '/customers', icon: Users, permission: 'customer.view' },
  { name: 'Thành viên', path: '/loyalty', icon: Award, permission: 'loyalty.points.view' },
  { name: 'Nhân viên', path: '/employees', icon: UserCheck, permission: 'hr.employee.view' },
  { name: 'Ca làm việc', path: '/shifts', icon: Clock, permission: 'hr.shift.view' },
  { name: 'Phân ca', path: '/shift-assignments', icon: CalendarCheck, permission: 'hr.shift.assign' },
  { name: 'Tồn kho', path: '/inventory', icon: Boxes, permission: 'inventory.view' },
  { name: 'Hủy hàng', path: '/inventory-loss', icon: Trash2, permission: 'inventory.loss.view' },
  { name: 'Báo cáo', path: '/reports', icon: BarChart3, permission: 'report.revenue.view' },
];

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, can } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authorizedNavItems = navigationItems.filter(
    item => !item.permission || can(item.permission),
  );

  const currentNav = navigationItems.find(item =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-green-700 font-bold text-lg">
            <Store className="w-6 h-6 text-green-600" />
            <span>AH-Center-Shop</span>
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {authorizedNavItems.map(item => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <Icon
                  className={cn('w-4 h-4 mr-3', isActive ? 'text-green-600' : 'text-gray-400')}
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User bar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs uppercase">
              {user?.tenNhanVien ? user.tenNhanVien.charAt(0) : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-800 truncate">
                {user?.tenNhanVien || 'Nhân viên'}
              </p>
              <p className="text-[10px] text-gray-500 uppercase">{user?.role || 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Breadcrumb */}
            <div className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Link to="/" className="text-gray-400 hover:text-gray-600">
                Trang chủ
              </Link>
              {currentNav && currentNav.path !== '/' && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-800 font-semibold">{currentNav.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              <span>Gateway: Online (3000)</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
