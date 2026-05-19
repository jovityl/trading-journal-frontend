import { NavLink } from 'react-router-dom'

function AdminTabs() {
  return (
    <div className="flex gap-1 border-b border-gray-800 mb-6">
      <Tab to="/admin/users">Users</Tab>
      <Tab to="/admin/usage">Token Usage</Tab>
      <Tab to="/admin/prompts">Prompts</Tab>
    </div>
  )
}

function Tab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
          isActive
            ? 'border-purple-500 text-white'
            : 'border-transparent text-gray-400 hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default AdminTabs
