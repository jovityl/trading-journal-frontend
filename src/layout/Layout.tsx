import { Outlet, NavLink } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import useAuthToken from '../hooks/useAuthToken'

function Layout() {
  const { logout, user } = useAuth0()
  useAuthToken()

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex flex-col p-6">
        <h1 className="text-xl font-bold mb-10">📈 TJ</h1>
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
