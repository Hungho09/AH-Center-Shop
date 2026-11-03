import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { NhaCungCap, PhieuNhap, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useSuppliers() {
  return useQuery<NhaCungCap[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await apiClient.get('/purchases/suppliers');
      return response.data?.data || response.data;
    },
  });
}

export function usePurchaseOrders(params?: PaginationParams) {
  return useQuery<PaginatedResult<PhieuNhap>>({
    queryKey: ['purchase-orders', params],
    queryFn: async () => {
      const response = await apiClient.get('/purchases/orders', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: Partial<PhieuNhap>) => {
      const response = await apiClient.post('/purchases/orders', orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

