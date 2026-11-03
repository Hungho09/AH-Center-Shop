import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Search, Inbox } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (newPage: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  toolbarActions?: React.ReactNode;
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  toolbarActions,
  emptyMessage = 'Không có dữ liệu hiển thị.',
  keyExtractor,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header / Toolbar */}
      {(onSearchChange || toolbarActions) && (
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={e => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
          )}
          {toolbarActions && (
            <div className="flex items-center gap-2 ml-auto">{toolbarActions}</div>
          )}
        </div>
      )}

      {/* Main Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-4 py-3.5 whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-10 w-10 text-gray-300" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => {
                const key = keyExtractor ? keyExtractor(item, rowIdx) : rowIdx;
                return (
                  <tr key={key} className="hover:bg-gray-50/80 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={cn(
                          'px-4 py-3.5 whitespace-nowrap text-gray-900',
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center',
                          col.className,
                        )}
                      >
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                            ? String(item[col.accessorKey] ?? '-')
                            : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {onPageChange && (
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-white">
          <span>
            Hiển thị <strong>{data.length}</strong> / <strong>{total}</strong> bản ghi
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Trước
            </Button>
            <span className="px-2 font-medium">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              Sau
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

