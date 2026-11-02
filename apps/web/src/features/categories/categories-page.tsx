import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const CategoriesPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Danh Mục Hàng Hóa"
      description="Quản lý phân loại ngành hàng, nhóm sản phẩm tiện lợi."
      serviceName="product-inventory-service"
      servicePort={3002}
      apiEndpoint="/categories"
      tables={['LOAIHANG']}
    />
  );
};

