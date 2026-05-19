import api from './api'
import type { BaseResponse } from '../types'

export interface PromptDto {
  key: string
  content: string
  updatedAt: string
}

export interface UserUsageDto {
  userId: string
  email: string
  totalCalls: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
}

export interface UsageCallDto {
  id: string
  email: string
  endpoint: string
  model: string
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cost: number
  createdAt: string
}

export interface UsageSummaryDto {
  totalCalls: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  perUser: UserUsageDto[]
  recentCalls: UsageCallDto[]
}

export const adminService = {
  async getPrompts(): Promise<PromptDto[]> {
    const res = await api.get<BaseResponse<PromptDto[]>>('/api/v1/admin/prompts')
    return res.data.data
  },

  async updatePrompt(key: string, content: string): Promise<PromptDto> {
    const res = await api.put<BaseResponse<PromptDto>>(`/api/v1/admin/prompts/${key}`, { content })
    return res.data.data
  },

  async getUsage(): Promise<UsageSummaryDto> {
    const res = await api.get<BaseResponse<UsageSummaryDto>>('/api/v1/admin/usage')
    return res.data.data
  },

  async getUsers(): Promise<AdminUserDto[]> {
    const res = await api.get<BaseResponse<AdminUserDto[]>>('/api/v1/admin/users')
    return res.data.data
  },
}

export interface AdminUserDto {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
  createdAt: string
  tradeCount: number
  totalPnl: number
  totalAiCalls: number
  totalAiCost: number
}
