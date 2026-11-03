import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { HangHoa, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useInventory(params?: PaginationParams) {
  return useQuery<PaginatedResult<HangHoa>>({
    queryKey: ['inventory', params],
    queryFn: async () => {
      const response = await apiClient.get('/products', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ maHang, delta }: { maHang: string; delta: number }) => {
      const response = await apiClient.post(`/products/${maHang}/adjust-stock`, { delta });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

