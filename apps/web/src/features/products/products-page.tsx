import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const ProductsPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Sản Phẩm"
      description="Quản lý danh mục sản phẩm, đơn giá bán, giá vốn và đơn vị tính."
      serviceName="product-inventory-service"
      servicePort={3002}
      apiEndpoint="/products"
      tables={['HANGHOA', 'LOAIHANG']}
    />
  );
};

