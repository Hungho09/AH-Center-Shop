import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { HangHoa, LoaiHang, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useProducts(params?: PaginationParams) {
  return useQuery<PaginatedResult<HangHoa>>({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await apiClient.get('/products', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useCategories() {
  return useQuery<LoaiHang[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data?.data || response.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct: Partial<HangHoa>) => {
      const response = await apiClient.post('/products', newProduct);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

