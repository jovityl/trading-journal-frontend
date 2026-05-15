import { useAuth0 } from '@auth0/auth0-react'

function LoginPage() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl text-center w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Trading Journal</h1>
        <p className="text-gray-400 mb-8">Track your trades. Build discipline.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Log In
        </button>
      </div>
    </div>
  )
}

export default LoginPage
