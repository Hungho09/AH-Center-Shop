import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const LoyaltyPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Thành Viên & Điểm Tích Lũy"
      description="Quản lý hạng thành viên (Đồng, Bạc, Vàng), tỷ lệ quy đổi điểm và ngưỡng chi tiêu."
      serviceName="customer-loyalty-service"
      servicePort={3005}
      apiEndpoint="/loyalty/tiers"
      tables={['HANGTHANHVIEN', 'KHACHHANG']}
    />
  );
};

