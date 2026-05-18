import api from './api'
import type { BaseResponse } from '../types'

export interface PromptDto {
  key: string
  content: string
  updatedAt: string
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
}
