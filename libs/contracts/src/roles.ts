import { Permission, PERMISSIONS } from './permissions';

export type UserRole = 'ADMIN' | 'STORE_MANAGER' | 'CASHIER' | 'WAREHOUSE' | 'HR_MANAGER' | 'VIEWER';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [...PERMISSIONS],

  STORE_MANAGER: [
    'auth.login',
    'auth.profile.view',
    'auth.profile.update',
    'sales.pos.access',
    'sales.invoice.create',
    'sales.invoice.view',
    'sales.invoice.cancel',
    'sales.discount.apply',
    'sales.returns.create',
    'product.view',
    'product.create',
    'product.update',
    'category.manage',
    'inventory.view',
    'inventory.adjust',
    'inventory.loss.create',
    'inventory.loss.view',
    'inventory.loss.approve',
    'purchase.supplier.view',
    'purchase.supplier.manage',
    'purchase.order.create',
    'purchase.order.view',
    'purchase.order.approve',
    'customer.view',
    'customer.create',
    'customer.update',
    'loyalty.points.view',
    'loyalty.points.adjust',
    'loyalty.reward.redeem',
    'hr.employee.view',
    'hr.shift.view',
    'hr.shift.assign',
    'hr.attendance.record',
    'hr.attendance.view',
    'hr.salary.view',
    'report.revenue.view',
    'report.inventory.view',
    'report.profit.view',
    'report.cashflow.view',
    'system.settings.view',
  ],

  CASHIER: [
    'auth.login',
    'auth.profile.view',
    'sales.pos.access',
    'sales.invoice.create',
    'sales.invoice.view',
    'sales.discount.apply',
    'product.view',
    'inventory.view',
    'customer.view',
    'customer.create',
    'customer.update',
    'loyalty.points.view',
    'loyalty.reward.redeem',
    'hr.attendance.record',
  ],

  WAREHOUSE: [
    'auth.login',
    'auth.profile.view',
    'product.view',
    'inventory.view',
    'inventory.adjust',
    'inventory.loss.create',
    'inventory.loss.view',
    'purchase.supplier.view',
    'purchase.order.create',
    'purchase.order.view',
    'hr.attendance.record',
  ],

  HR_MANAGER: [
    'auth.login',
    'auth.profile.view',
    'hr.employee.view',
    'hr.employee.manage',
    'hr.shift.view',
    'hr.shift.assign',
    'hr.attendance.record',
    'hr.attendance.view',
    'hr.salary.calculate',
    'hr.salary.view',
    'hr.salary.approve',
    'report.cashflow.view',
  ],

  VIEWER: [
    'auth.login',
    'auth.profile.view',
    'product.view',
    'inventory.view',
    'customer.view',
    'report.revenue.view',
    'report.inventory.view',
  ],
};

export const ROLES: RoleDefinition[] = [
  {
    id: 'ADMIN',
    name: 'Quản trị viên',
    description: 'Toàn quyền cấu hình và điều hành toàn bộ hệ thống cửa hàng tiện lợi.',
    permissions: ROLE_PERMISSIONS.ADMIN,
  },
  {
    id: 'STORE_MANAGER',
    name: 'Cửa hàng trưởng',
    description: 'Quản lý toàn diện hoạt động kinh doanh, nhân sự, hàng hóa và duyệt phiếu.',
    permissions: ROLE_PERMISSIONS.STORE_MANAGER,
  },
  {
    id: 'CASHIER',
    name: 'Thu ngân / Bán hàng',
    description: 'Thực hiện bán lẻ tại quầy POS, tra cứu hàng tồn, tích điểm thành viên.',
    permissions: ROLE_PERMISSIONS.CASHIER,
  },
  {
    id: 'WAREHOUSE',
    name: 'Thủ kho',
    description: 'Quản lý kho hàng, nhập hàng NCC, kiểm kê và lập phiếu hủy hàng hỏng.',
    permissions: ROLE_PERMISSIONS.WAREHOUSE,
  },
  {
    id: 'HR_MANAGER',
    name: 'Quản lý nhân sự',
    description: 'Xếp ca làm việc, theo dõi chấm công, tính toán và chi trả bảng lương.',
    permissions: ROLE_PERMISSIONS.HR_MANAGER,
  },
  {
    id: 'VIEWER',
    name: 'Xem báo cáo',
    description: 'Chỉ xem dữ liệu báo cáo và thông tin danh mục, không có quyền chỉnh sửa.',
    permissions: ROLE_PERMISSIONS.VIEWER,
  },
];

