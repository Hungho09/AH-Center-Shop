import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <HelpCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-3xl font-bold text-gray-900">404 - Không Tìm Thấy Trang</h2>
      <p className="text-sm text-gray-500 max-w-md mt-2 mb-6">
        Đường dẫn bạn yêu cầu không tồn tại trong hệ thống AH-Center-Shop.
      </p>
      <Link to="/">
        <Button variant="primary">Quay về Trang chủ</Button>
      </Link>
    </div>
  );
};

