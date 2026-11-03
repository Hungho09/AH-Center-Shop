import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { KhachHang, HangThanhVien, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useCustomers(params?: PaginationParams) {
  return useQuery<PaginatedResult<KhachHang>>({
    queryKey: ['customers', params],
    queryFn: async () => {
      const response = await apiClient.get('/customers', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useCustomerTiers() {
  return useQuery<HangThanhVien[]>({
    queryKey: ['customer-tiers'],
    queryFn: async () => {
      const response = await apiClient.get('/customers/tiers');
      return response.data?.data || response.data;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerData: Partial<KhachHang>) => {
      const response = await apiClient.post('/customers', customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

