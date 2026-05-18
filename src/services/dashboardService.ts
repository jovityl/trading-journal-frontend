import api from './api'
import type { BaseResponse, DashboardDto } from '../types'

export const dashboardService = {
  async get(): Promise<DashboardDto> {
    const res = await api.get<BaseResponse<DashboardDto>>('/api/v1/dashboard')
    return res.data.data
  },
}
