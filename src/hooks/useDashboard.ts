import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import type { BaseResponse, DashboardDto } from '../types'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get<BaseResponse<DashboardDto>>('/api/v1/dashboard')
      return res.data.data
    }
  })
}
