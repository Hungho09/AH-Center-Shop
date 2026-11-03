import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/api/use-customers';
import { KhachHang } from '@ql/contracts';
import { useAuth } from '@/app/auth-context';
import { Plus, RefreshCw, UserCheck } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { can } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useCustomers({
    page,
    limit: 10,
    search: search || undefined,
  });

  const columns: ColumnDef<KhachHang>[] = [
    {
      header: 'Mã KH',
      accessorKey: 'maKhachHang',
      className: 'font-mono text-xs font-semibold text-blue-700',
    },
    {
      header: 'Họ & Tên',
      cell: item => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.tenKhachHang}</div>
            <div className="text-xs text-gray-500">{item.email || 'Chưa cập nhật email'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Số Điện Thoại',
      accessorKey: 'soDienThoai',
      className: 'font-mono text-xs',
    },
    {
      header: 'Hạng Thành Viên',
      cell: item => (
        <Badge variant="brand">
          {item.hangThanhVien?.tenHang || item.maHangThanhVien || 'Thành viên'}
        </Badge>
      ),
    },
    {
      header: 'Điểm Tích Lũy',
      align: 'right',
      cell: item => (
        <span className="font-semibold text-amber-600">
          {Number(item.diemTichLuy || 0).toLocaleString('vi-VN')} pts
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Khách Hàng"
        description="Tra cứu danh sách hội viên, tích điểm và chính sách ưu đãi thành viên."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} isLoading={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Làm mới
            </Button>
            {can('customer.create') && (
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Thêm Khách Hàng
              </Button>
            )}
          </div>
        }
      />

      <DataTable<KhachHang>
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        total={data?.total || 0}
        page={page}
        limit={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, SĐT khách hàng..."
        emptyMessage="Không có dữ liệu khách hàng phù hợp."
        keyExtractor={item => item.maKhachHang}
      />
    </div>
  );
};
