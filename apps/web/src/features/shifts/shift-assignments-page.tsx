import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const ShiftAssignmentsPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Phân Ca & Chấm Công"
      description="Lịch làm việc nhân viên, điểm danh trạng thái 'Có mặt' phục vụ tính lương."
      serviceName="hr-service"
      servicePort={3006}
      apiEndpoint="/shift-assignments"
      tables={['PHANCA', 'NHANVIEN', 'CALAMVIEC']}
    />
  );
};

