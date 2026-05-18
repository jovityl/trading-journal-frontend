import { useQuery } from '@tanstack/react-query'
import { usersService } from '../services/usersService'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => usersService.getMe(),
  })
}
