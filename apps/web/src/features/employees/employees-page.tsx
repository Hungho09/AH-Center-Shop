import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmployees } from '@/hooks/api/use-hr';
import { NhanVien } from '@ql/contracts';
import { useAuth } from '@/app/auth-context';
import { Plus, RefreshCw, Users } from 'lucide-react';

export const EmployeesPage: React.FC = () => {
  const { can } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useEmployees({
    page,
    limit: 10,
    search: search || undefined,
  });

  const columns: ColumnDef<NhanVien>[] = [
    {
      header: 'Mã NV',
      accessorKey: 'maNhanVien',
      className: 'font-mono text-xs font-semibold text-purple-700',
    },
    {
      header: 'Họ & Tên',
      cell: item => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.tenNhanVien}</div>
            <div className="text-xs text-gray-500">{item.email || 'Chưa có email'}</div>
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
      header: 'Chức Vụ',
      cell: item => (
        <Badge variant="neutral">
          {item.chucVu?.tenChucVu || String(item.maChucVu)}
        </Badge>
      ),
    },
    {
      header: 'Trạng Thái',
      align: 'center',
      cell: item => {
        const isActive = item.trangThai === 'DANG_LAM' || item.trangThai === 'ACTIVE';
        return (
          <Badge variant={isActive ? 'success' : 'neutral'}>
            {isActive ? 'Đang làm việc' : item.trangThai}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Nhân Viên"
        description="Danh sách hồ sơ nhân sự, chức vụ và trạng thái làm việc tại cửa hàng."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} isLoading={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Làm mới
            </Button>
            {can('hr.employee.manage') && (
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Thêm Nhân Viên
              </Button>
            )}
          </div>
        }
      />

      <DataTable<NhanVien>
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        total={data?.total || 0}
        page={page}
        limit={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên, SĐT nhân viên..."
        emptyMessage="Không tìm thấy nhân viên nào."
        keyExtractor={item => item.maNhanVien}
      />
    </div>
  );
};
