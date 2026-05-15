import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../services/api'
import type { BaseResponse, DashboardDto } from '../types'

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${highlight ? 'border border-red-500' : ''}`}>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get<BaseResponse<DashboardDto>>('/api/v1/dashboard')
      return res.data.data
    }
  })

  if (isLoading) return <p className="text-gray-400">Loading...</p>
  if (error) return <p className="text-red-400">Failed to load dashboard.</p>
  if (!data) return null

  const pnlColor = (val: number) => val >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Alerts */}
      {data.isDailyLossLimitHit && (
        <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          ⚠️ Daily loss limit hit (${data.dailyLossLimit}). Consider stopping for the day.
        </div>
      )}
      {data.isDailyProfitTargetHit && (
        <div className="bg-green-900/40 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
          🎯 Daily profit target reached (${data.dailyProfitTarget}). Great job!
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's P&L"
          value={`${data.todayPnl >= 0 ? '+' : ''}$${data.todayPnl.toFixed(2)}`}
          highlight={data.isDailyLossLimitHit}
        />
        <StatCard
          label="Monthly P&L"
          value={`${data.monthlyPnl >= 0 ? '+' : ''}$${data.monthlyPnl.toFixed(2)}`}
        />
        <StatCard
          label="Win Rate"
          value={`${data.winRate}%`}
        />
        <StatCard
          label="Avg Discipline Score"
          value={`${data.averageDisciplineScore}/100`}
        />
      </div>

      {/* P&L Chart */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">P&L — Last 30 Days</h2>
        {data.pnlChart.length === 0 ? (
          <p className="text-gray-500 text-sm">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.pnlChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: 'none' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(val: number) => [`$${val.toFixed(2)}`, 'P&L']}
              />
              <Line type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent trades */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
        {data.recentTrades.length === 0 ? (
          <p className="text-gray-500 text-sm">No trades yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-800">
                <th className="pb-3">Ticker</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Strategy</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">P&L</th>
                <th className="pb-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTrades.map(trade => (
                <tr key={trade.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 font-medium">{trade.ticker}</td>
                  <td className="py-3 text-gray-400">{trade.optionType}</td>
                  <td className="py-3 text-gray-400">{trade.strategy}</td>
                  <td className="py-3 text-gray-400">{new Date(trade.tradeDate).toLocaleDateString()}</td>
                  <td className={`py-3 font-medium ${pnlColor(trade.pnl)}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="py-3 text-gray-400">{trade.disciplineScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
