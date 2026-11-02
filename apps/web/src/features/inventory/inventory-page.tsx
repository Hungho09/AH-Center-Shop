import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const InventoryPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Tồn Kho"
      description="Kiểm tra tồn kho thời gian thực, điểm nóng ghi nhận biến động SoLuongTon."
      serviceName="product-inventory-service"
      servicePort={3002}
      apiEndpoint="/products"
      tables={['HANGHOA']}
    />
  );
};

