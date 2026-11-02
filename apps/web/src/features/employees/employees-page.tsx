import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const EmployeesPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Quản Lý Nhân Viên"
      description="Quản lý hồ sơ nhân viên, chức vụ, thông tin liên lạc và ngày sinh."
      serviceName="hr-service"
      servicePort={3006}
      apiEndpoint="/employees"
      tables={['NHANVIEN', 'CHUCVU']}
    />
  );
};

