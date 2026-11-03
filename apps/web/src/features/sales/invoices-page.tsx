import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInvoices } from '@/hooks/api/use-invoices';
import { HoaDon } from '@ql/contracts';
import { useAuth } from '@/app/auth-context';
import { RefreshCw, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InvoicesPage: React.FC = () => {
  const { can } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useInvoices({
    page,
    limit: 10,
    search: search || undefined,
  });

  const columns: ColumnDef<HoaDon>[] = [
    {
      header: 'Mã Hóa Đơn',
      accessorKey: 'maHoaDon',
      className: 'font-mono text-xs font-semibold text-green-700',
    },
    {
      header: 'Thời Gian Lập',
      cell: item => (
        <span className="text-xs text-gray-500">
          {item.ngayLap ? new Date(item.ngayLap).toLocaleString('vi-VN') : '-'}
        </span>
      ),
    },
    {
      header: 'Khách Hàng',
      cell: item => (
        <span className="text-sm text-gray-700 font-medium">
          {item.maKhachHang || 'Khách lẻ'}
        </span>
      ),
    },
    {
      header: 'Thu Ngân',
      accessorKey: 'maNhanVien',
      className: 'font-mono text-xs',
    },
    {
      header: 'Tổng Tiền',
      align: 'right',
      cell: item => (
        <span className="font-bold text-gray-900">
          {Number(item.tongTien || 0).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      header: 'Trạng Thái',
      align: 'center',
      cell: item => {
        const isPaid = item.trangThai === 'DA_THANH_TOAN' || item.trangThai === 'PAID';
        return (
          <Badge variant={isPaid ? 'success' : 'warning'}>
            {isPaid ? 'Đã thanh toán' : item.trangThai}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch Sử Hóa Đơn"
        description="Tra cứu lịch sử bán hàng, giá trị đơn và trạng thái thanh toán hóa đơn."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} isLoading={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Làm mới
            </Button>
            {can('sales.pos.access') && (
              <Button size="sm" onClick={() => navigate('/pos')}>
                <Receipt className="h-4 w-4 mr-1.5" />
                Mở Quầy POS
              </Button>
            )}
          </div>
        }
      />

      <DataTable<HoaDon>
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        total={data?.total || 0}
        page={page}
        limit={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo mã hóa đơn, mã KH..."
        emptyMessage="Chưa có hóa đơn nào được lập."
        keyExtractor={item => item.maHoaDon}
      />
    </div>
  );
};
