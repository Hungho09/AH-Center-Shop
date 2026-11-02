import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã có lỗi xảy ra',
  message = 'Không thể tải thông tin từ hệ thống. Vui lòng thử lại sau.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
      <h4 className="text-base font-semibold text-red-800">{title}</h4>
      <p className="text-sm text-red-600 max-w-sm mt-1">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" className="mt-4" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
};

