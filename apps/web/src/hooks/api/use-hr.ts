import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/axios-client';
import { NhanVien, CaLamViec, PhanCa, PaginatedResult, PaginationParams } from '@ql/contracts';

export function useEmployees(params?: PaginationParams) {
  return useQuery<PaginatedResult<NhanVien>>({
    queryKey: ['employees', params],
    queryFn: async () => {
      const response = await apiClient.get('/hr/employees', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useShifts() {
  return useQuery<CaLamViec[]>({
    queryKey: ['shifts'],
    queryFn: async () => {
      const response = await apiClient.get('/hr/shifts');
      return response.data?.data || response.data;
    },
  });
}

export function useShiftAssignments(params?: PaginationParams) {
  return useQuery<PaginatedResult<PhanCa>>({
    queryKey: ['shift-assignments', params],
    queryFn: async () => {
      const response = await apiClient.get('/hr/shift-assignments', { params });
      return response.data?.data || response.data;
    },
  });
}

export function useAssignShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assignmentData: Partial<PhanCa>) => {
      const response = await apiClient.post('/hr/shift-assignments', assignmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-assignments'] });
    },
  });
}

