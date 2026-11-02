import React from 'react';

export const Loading: React.FC<{ message?: string }> = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

