import api from './api'
import type { BaseResponse, TradeDto } from '../types'

export interface TradeFilters {
  ticker?: string
  optionType?: string
  strategy?: string
  fromDate?: string
  toDate?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * All API calls related to trades go here.
 * Hooks and components should never call axios directly for trades.
 */
export const tradesService = {
  async getAll(filters: TradeFilters = {}): Promise<TradeDto[]> {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    )
    const res = await api.get<BaseResponse<TradeDto[]>>('/api/v1/trades', { params })
    return res.data.data
  },

  async getById(id: string): Promise<TradeDto> {
    const res = await api.get<BaseResponse<TradeDto>>(`/api/v1/trades/${id}`)
    return res.data.data
  },

  async create(formData: FormData): Promise<TradeDto> {
    const res = await api.post<BaseResponse<TradeDto>>('/api/v1/trades', formData)
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/api/v1/trades/${id}`)
  },

  async removeAll(): Promise<void> {
    await api.delete('/api/v1/trades/all')
  },

  async seed(): Promise<void> {
    await api.post('/api/v1/trades/seed')
  },

  async chat(id: string, messages: ChatMessage[]): Promise<string> {
    const res = await api.post<BaseResponse<string>>(`/api/v1/trades/${id}/chat`, { messages })
    return res.data.data
  },
}
