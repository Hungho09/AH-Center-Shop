import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/api/use-products';
import { HangHoa } from '@ql/contracts';
import { useAuth } from '@/app/auth-context';
import { Plus, RefreshCw, Package } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { can } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
  });

  const columns: ColumnDef<HangHoa>[] = [
    {
      header: 'Mã Hàng',
      accessorKey: 'maHang',
      className: 'font-mono text-xs font-semibold text-green-700',
    },
    {
      header: 'Tên Sản Phẩm',
      cell: item => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.tenHang}</div>
            <div className="text-xs text-gray-500">Đơn vị: {item.donViTinh}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Loại Hàng',
      accessorKey: 'maLoai',
      cell: item => (
        <Badge variant="neutral">
          {item.loaiHang?.tenLoai || item.maLoai || 'Chưa phân loại'}
        </Badge>
      ),
    },
    {
      header: 'Đơn Giá Bán',
      align: 'right',
      cell: item => (
        <span className="font-semibold text-gray-900">
          {Number(item.giaBan || 0).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      header: 'Tồn Kho',
      align: 'center',
      cell: item => {
        const qty = item.soLuongTon ?? 0;
        return (
          <Badge variant={qty > 10 ? 'success' : qty > 0 ? 'warning' : 'danger'}>
            {qty} {item.donViTinh}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Sản Phẩm"
        description="Tra cứu danh mục hàng hóa, đơn giá bán lẻ và số lượng tồn kho thực tế."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} isLoading={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Làm mới
            </Button>
            {can('product.create') && (
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Thêm Sản Phẩm
              </Button>
            )}
          </div>
        }
      />

      <DataTable<HangHoa>
        columns={columns}
        data={data?.items || []}
        isLoading={isLoading}
        total={data?.total || 0}
        page={page}
        limit={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm mã hàng, tên sản phẩm..."
        emptyMessage="Không có sản phẩm nào phù hợp với bộ lọc."
        keyExtractor={item => item.maHang}
      />
    </div>
  );
};
