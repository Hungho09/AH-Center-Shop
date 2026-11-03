import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { PhieuHuy, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useLossRecords(params?: PaginationParams) {
  return useQuery<PaginatedResult<PhieuHuy>>({
    queryKey: ['inventory-loss', params],
    queryFn: async () => {
      const response = await apiClient.get('/inventory-loss/records', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useCreateLossRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lossData: Partial<PhieuHuy>) => {
      const response = await apiClient.post('/inventory-loss/records', lossData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-loss'] });
    },
  });
}

