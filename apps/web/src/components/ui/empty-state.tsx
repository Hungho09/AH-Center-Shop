import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có bản ghi nào để hiển thị trong mục này.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
      <PackageOpen className="w-12 h-12 text-gray-400 mb-3" />
      <h4 className="text-base font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" className="mt-4" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

