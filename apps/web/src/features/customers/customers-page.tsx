import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const CustomersPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Khách Hàng"
      description="Quản lý hồ sơ khách hàng, tra cứu số điện thoại và địa chỉ."
      serviceName="customer-loyalty-service"
      servicePort={3005}
      apiEndpoint="/customers"
      tables={['KHACHHANG', 'HANGTHANHVIEN']}
    />
  );
};

