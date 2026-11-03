import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { HoaDon, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useInvoices(params?: PaginationParams) {
  return useQuery<PaginatedResult<HoaDon>>({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const response = await apiClient.get('/sales/invoices', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useInvoiceDetails(id: string) {
  return useQuery<HoaDon>({
    queryKey: ['invoices', id],
    queryFn: async () => {
      const response = await apiClient.get(`/sales/invoices/${id}`);
      return response.data?.data || response.data;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceData: Partial<HoaDon>) => {
      const response = await apiClient.post('/sales/invoices', invoiceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

