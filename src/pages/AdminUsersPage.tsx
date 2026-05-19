import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { usePageTitle } from '../hooks/usePageTitle'
import { Skeleton } from '../components/Skeleton'
import AdminTabs from '../components/AdminTabs'
import { pnlColor, formatPnl, formatDate } from '../utils/format'

function AdminUsersPage() {
  usePageTitle('Admin · Users')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminService.getUsers(),
  })

  if (isLoading) return <Skeleton className="h-96" />
  if (!data) return null

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminTabs />
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-400 text-sm mt-1">All registered users with activity stats.</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-left border-b border-gray-800">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3 text-right">Trades</th>
                  <th className="pb-3 text-right">Total P&L</th>
                  <th className="pb-3 text-right">AI Calls</th>
                  <th className="pb-3 text-right">AI Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.map(u => (
                  <tr key={u.id} className="border-b border-gray-800">
                    <td className="py-3 flex items-center gap-2">
                      <span>{u.email}</span>
                      {u.isAdmin && (
                        <span className="text-xs px-2 py-0.5 bg-purple-900/40 text-purple-300 rounded">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-400">{u.displayName}</td>
                    <td className="py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="py-3 text-right text-gray-400">{u.tradeCount}</td>
                    <td className={`py-3 text-right font-medium ${pnlColor(u.totalPnl)}`}>
                      {formatPnl(u.totalPnl)}
                    </td>
                    <td className="py-3 text-right text-gray-400">{u.totalAiCalls}</td>
                    <td className="py-3 text-right text-white font-medium">${u.totalAiCost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsersPage
