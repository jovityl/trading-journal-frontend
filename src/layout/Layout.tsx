import { Outlet, NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { CandlestickChart } from 'lucide-react'
import useAuthToken from '../hooks/useAuthToken'
import { useMe } from '../hooks/useMe'

function Layout() {
  const { logout, user } = useAuth0()
  useAuthToken()
  const { data: me } = useMe()

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600/20 p-1.5 rounded-lg">
            <CandlestickChart className="text-blue-400" size={20} />
          </div>
          <h1 className="text-base font-bold">Trading Journal</h1>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/trades"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`
            }
          >
            Trades
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`
            }
          >
            Settings
          </NavLink>

          {me?.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition mt-4 ${isActive ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-gray-800'}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-3 truncate">{user?.email}</p>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin + '/login' } })}
            className="w-full text-sm text-gray-400 hover:text-white transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
