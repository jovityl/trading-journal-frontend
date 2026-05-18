import { useAuth0 } from '@auth0/auth0-react'
import { CandlestickChart, Sparkles, Bell, BarChart3 } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle'

function LoginPage() {
  usePageTitle('Login')
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl text-center w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600/20 p-3 rounded-xl">
            <CandlestickChart className="text-blue-400" size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Trading Journal</h1>
        <p className="text-gray-400 mb-8">Track your trades. Build discipline.</p>

        <ul className="text-left space-y-3 mb-8">
          <li className="flex items-center gap-3 text-sm text-gray-300">
            <Sparkles className="text-blue-400 shrink-0" size={18} />
            AI-powered chart analysis
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-300">
            <Bell className="text-blue-400 shrink-0" size={18} />
            Daily loss & profit limit alerts
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-300">
            <BarChart3 className="text-blue-400 shrink-0" size={18} />
            Real-time P&L and discipline tracking
          </li>
        </ul>

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
