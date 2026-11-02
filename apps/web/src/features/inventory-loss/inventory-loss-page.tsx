import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const InventoryLossPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Hủy Hàng"
      description="Ghi nhận hàng hỏng, hết hạn và phát command StockOutRequested tới product-inventory-service."
      serviceName="inventory-loss-service"
      servicePort={3007}
      apiEndpoint="/inventory-loss"
      tables={['PHIEUHUY', 'HANGHOA', 'NHANVIEN']}
    />
  );
};

