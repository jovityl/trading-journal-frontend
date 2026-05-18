import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/adminService'
import { usePageTitle } from '../hooks/usePageTitle'
import { Skeleton } from '../components/Skeleton'
import AdminTabs from '../components/AdminTabs'

function AdminUsagePage() {
  usePageTitle('Admin · Usage')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'usage'],
    queryFn: () => adminService.getUsage(),
  })

  if (isLoading) return <Skeleton className="h-96" />
  if (!data) return null

  return (
    <div className="space-y-6 max-w-5xl">
      <AdminTabs />
      <div>
        <h1 className="text-2xl font-bold">Token Usage</h1>
        <p className="text-gray-400 text-sm mt-1">AI token consumption across all users.</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Cost" value={`$${data.totalCost.toFixed(4)}`} />
        <Stat label="Total Calls" value={data.totalCalls.toLocaleString()} />
        <Stat label="Input Tokens" value={data.totalInputTokens.toLocaleString()} />
        <Stat label="Output Tokens" value={data.totalOutputTokens.toLocaleString()} />
      </div>

      {/* Recent calls */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Calls (last 50)</h2>
        {data.recentCalls.length === 0 ? (
          <p className="text-gray-500 text-sm">No calls yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-left border-b border-gray-800">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Endpoint</th>
                  <th className="pb-3">Model</th>
                  <th className="pb-3 text-right">Input</th>
                  <th className="pb-3 text-right">Output</th>
                  <th className="pb-3 text-right">Cache hit</th>
                  <th className="pb-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.recentCalls.map(c => (
                  <tr key={c.id} className="border-b border-gray-800">
                    <td className="py-2 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="py-2 text-gray-400">{c.email}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${c.endpoint === 'scoring' ? 'bg-blue-900/40 text-blue-300' : 'bg-purple-900/40 text-purple-300'}`}>
                        {c.endpoint}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500 text-xs">{c.model}</td>
                    <td className="py-2 text-right text-gray-400">{c.inputTokens.toLocaleString()}</td>
                    <td className="py-2 text-right text-gray-400">{c.outputTokens.toLocaleString()}</td>
                    <td className="py-2 text-right text-gray-500">{c.cacheReadTokens.toLocaleString()}</td>
                    <td className="py-2 text-right text-white font-medium">${c.cost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Per user table */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">By User</h2>
        {data.perUser.length === 0 ? (
          <p className="text-gray-500 text-sm">No usage data yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-800">
                <th className="pb-3">User</th>
                <th className="pb-3">Calls</th>
                <th className="pb-3">Input Tokens</th>
                <th className="pb-3">Output Tokens</th>
                <th className="pb-3">Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.perUser.map(u => (
                <tr key={u.userId} className="border-b border-gray-800">
                  <td className="py-3">{u.email}</td>
                  <td className="py-3 text-gray-400">{u.totalCalls.toLocaleString()}</td>
                  <td className="py-3 text-gray-400">{u.totalInputTokens.toLocaleString()}</td>
                  <td className="py-3 text-gray-400">{u.totalOutputTokens.toLocaleString()}</td>
                  <td className="py-3 font-medium text-white">${u.totalCost.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default AdminUsagePage
