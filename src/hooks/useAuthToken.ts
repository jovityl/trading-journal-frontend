import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import api, { setAuthToken } from '../services/api'

function useAuthToken() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const init = async () => {
      const token = await getAccessTokenSilently()
      setAuthToken(token)

      await api.post('/api/v1/users', {
        email: user.email,
        displayName: user.name ?? user.email,
      })
    }

    init()
  }, [isAuthenticated, getAccessTokenSilently, user])
}

export default useAuthToken
