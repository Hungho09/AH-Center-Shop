/**
 * QL_CuaHangTienLoi - Permission Registry
 * Single Source of Truth for all granular permissions across Backend and Frontend.
 */

export const PERMISSIONS = [
  // Auth & Profile
  'auth.login',
  'auth.profile.view',
  'auth.profile.update',

  // Sales & POS
  'sales.pos.access',
  'sales.invoice.create',
  'sales.invoice.view',
  'sales.invoice.cancel',
  'sales.discount.apply',
  'sales.returns.create',

  // Products & Categories
  'product.view',
  'product.create',
  'product.update',
  'product.delete',
  'category.manage',

  // Inventory & Stock
  'inventory.view',
  'inventory.adjust',
  'inventory.loss.create',
  'inventory.loss.view',
  'inventory.loss.approve',

  // Purchase & Suppliers
  'purchase.supplier.view',
  'purchase.supplier.manage',
  'purchase.order.create',
  'purchase.order.view',
  'purchase.order.approve',

  // Customers & Loyalty
  'customer.view',
  'customer.create',
  'customer.update',
  'loyalty.points.view',
  'loyalty.points.adjust',
  'loyalty.reward.redeem',

  // HR, Shifts & Payroll
  'hr.employee.view',
  'hr.employee.manage',
  'hr.shift.view',
  'hr.shift.assign',
  'hr.attendance.record',
  'hr.attendance.view',
  'hr.salary.calculate',
  'hr.salary.view',
  'hr.salary.approve',

  // Reports
  'report.revenue.view',
  'report.inventory.view',
  'report.profit.view',
  'report.cashflow.view',

  // System Administration
  'system.settings.view',
  'system.settings.manage',
  'system.audit.view',
  'system.user.manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

