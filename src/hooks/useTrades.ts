import { useQuery } from '@tanstack/react-query'
import { tradesService, type TradeFilters } from '../services/tradesService'

export type { TradeFilters }

export function useTrades(filters: TradeFilters = {}) {
  return useQuery({
    queryKey: ['trades', filters],
    queryFn: () => tradesService.getAll(filters),
  })
}

export function useTrade(id?: string) {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: () => tradesService.getById(id!),
    enabled: !!id,
  })
}
