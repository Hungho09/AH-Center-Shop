import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const PosPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Bán Hàng Tại Quầy (POS)"
      description="Giao diện tính tiền thu ngân, quét mã vạch và thanh toán hoá đơn qua usp_ThanhToanHoaDon."
      serviceName="sales-service"
      servicePort={3004}
      apiEndpoint="/invoices"
      tables={['HOADON', 'CT_HOADON', 'HANGHOA', 'KHACHHANG']}
    />
  );
};

