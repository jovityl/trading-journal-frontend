import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { setAuthToken } from '../services/api'
import { usersService } from '../services/usersService'

function useAuthToken() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const init = async () => {
      const token = await getAccessTokenSilently()
      setAuthToken(token)

      await usersService.create({
        email: user.email ?? '',
        displayName: user.name ?? user.email ?? '',
      })
    }

    init()
  }, [isAuthenticated, getAccessTokenSilently, user])
}

export default useAuthToken
