import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import type { BaseResponse, TradeDto } from '../types'

export interface TradeFilters {
  ticker?: string
  optionType?: string
  strategy?: string
  fromDate?: string
  toDate?: string
}

export function useTrades(filters: TradeFilters = {}) {
  return useQuery({
    queryKey: ['trades', filters],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filters.ticker) params.ticker = filters.ticker
      if (filters.optionType) params.optionType = filters.optionType
      if (filters.strategy) params.strategy = filters.strategy
      if (filters.fromDate) params.fromDate = filters.fromDate
      if (filters.toDate) params.toDate = filters.toDate

      const res = await api.get<BaseResponse<TradeDto[]>>('/api/v1/trades', { params })
      return res.data.data
    }
  })
}

export function useTrade(id?: string) {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: async () => {
      const res = await api.get<BaseResponse<TradeDto>>(`/api/v1/trades/${id}`)
      return res.data.data
    },
    enabled: !!id
  })
}
