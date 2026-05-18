import api from './api'
import type { BaseResponse } from '../types'

export interface UserDto {
  id: string
  email: string
  displayName: string
  dailyLossLimit: number
  dailyProfitTarget: number
}

export interface UpdateLimitsPayload {
  dailyLossLimit: number
  dailyProfitTarget: number
}

export const usersService = {
  async getMe(): Promise<UserDto> {
    const res = await api.get<BaseResponse<UserDto>>('/api/v1/users/me')
    return res.data.data
  },

  async create(payload: { email: string; displayName: string }): Promise<UserDto> {
    const res = await api.post<BaseResponse<UserDto>>('/api/v1/users', payload)
    return res.data.data
  },

  async updateLimits(payload: UpdateLimitsPayload): Promise<UserDto> {
    const res = await api.put<BaseResponse<UserDto>>('/api/v1/users/limits', payload)
    return res.data.data
  },
}
