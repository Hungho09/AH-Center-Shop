import React from 'react';
import { FeaturePlaceholder } from '../shared/feature-placeholder';

export const ShiftsPage: React.FC = () => {
  return (
    <FeaturePlaceholder
      title="Danh Mục Ca Làm Việc"
      description="Quản lý ca sáng, ca chiều, ca tối, giờ bắt đầu/kết thúc và mức lương ca."
      serviceName="hr-service"
      servicePort={3006}
      apiEndpoint="/shifts"
      tables={['CALAMVIEC']}
    />
  );
};

