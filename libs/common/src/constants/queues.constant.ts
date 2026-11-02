export const EXCHANGE_MAIN = 'ql.events';
export const EXCHANGE_DLX = 'ql.events.dlx';

export const QUEUES = {
  PRODUCT_INVENTORY: 'ql.product-inventory.queue',
  PURCHASE: 'ql.purchase.queue',
  SALES: 'ql.sales.queue',
  CUSTOMER_LOYALTY: 'ql.customer-loyalty.queue',
  HR: 'ql.hr.queue',
  INVENTORY_LOSS: 'ql.inventory-loss.queue',
};

export const ROUTING_KEYS = {
  STOCK_IN_REQUESTED: 'command.stock.in.requested',
  STOCK_OUT_REQUESTED: 'command.stock.out.requested',
  SALE_PAYMENT_REQUESTED: 'command.sale.payment.requested',
  PURCHASE_COMPLETED: 'event.purchase.completed',
  SALE_PAID: 'event.sale.paid',
  STOCK_IN_COMPLETED: 'event.stock.in.completed',
  STOCK_OUT_COMPLETED: 'event.stock.out.completed',
  CUSTOMER_POINTS_UPDATED: 'event.customer.points.updated',
  LOYALTY_TIER_UPGRADED: 'event.loyalty.tier.upgraded',
  INVENTORY_LOSS_CREATED: 'event.inventory.loss.created',
};

