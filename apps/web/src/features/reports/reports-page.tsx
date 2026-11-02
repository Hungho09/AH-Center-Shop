import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const ReportsPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Báo Cáo & Thống Kê"
      description="Báo cáo lương và doanh số nhân viên từ SQL View vw_BaoCaoLuongVaDoanhSoNV."
      serviceName="hr-service"
      servicePort={3006}
      apiEndpoint="/reports/salary-and-sales"
      tables={['vw_BaoCaoLuongVaDoanhSoNV']}
    />
  );
};

