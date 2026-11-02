import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const InvoicesPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Hóa Đơn"
      description="Lịch sử giao dịch bán hàng, tra cứu chi tiết và trạng thái hoá đơn."
      serviceName="sales-service"
      servicePort={3004}
      apiEndpoint="/invoices"
      tables={['HOADON', 'CT_HOADON']}
    />
  );
};

