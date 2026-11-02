import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const PurchasesPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Nhập Hàng"
      description="Quản lý nhà cung cấp, lập và hoàn thành phiếu nhập qua usp_HoanThanhPhieuNhap."
      serviceName="purchase-service"
      servicePort={3003}
      apiEndpoint="/purchases"
      tables={['NHACUNGCAP', 'PHIEUNHAP', 'CT_PHIEUNHAP']}
    />
  );
};

