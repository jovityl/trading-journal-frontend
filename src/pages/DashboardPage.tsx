import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CircleDollarSign, PiggyBank, Trophy, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { tradesService } from '../services/tradesService'
import { confirmAction } from '../utils/confirm'
import { formatPnl, pnlColor, rateColor, scoreColor } from '../utils/format'
import { useDashboard } from '../hooks/useDashboard'
import { usePageTitle } from '../hooks/usePageTitle'
import TradesTable from '../components/TradesTable'
import { DashboardSkeleton } from '../components/Skeleton'

function StatCard({ label, value, icon, valueColor, highlight }: { label: string; value: string; icon: React.ReactNode; valueColor?: string; highlight?: boolean }) {
  return (
    <div className={`bg-gray-900 rounded-xl p-6 transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg ${highlight ? 'border border-red-500' : 'border border-transparent'}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{label}</p>
        <div className="text-gray-500">{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${valueColor ?? 'text-white'}`}>{value}</p>
    </div>
  )
}

function DashboardPage() {
  usePageTitle('Dashboard')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data, isLoading, error } = useDashboard()

  const seedMutation = useMutation({
    mutationFn: () => tradesService.seed(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      toast.success('Seeded test data')
    },
    onError: () => toast.error('Failed to seed data')
  })

  const deleteAllMutation = useMutation({
    mutationFn: () => tradesService.removeAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      toast.success('All trades deleted')
    },
    onError: () => toast.error('Failed to delete trades')
  })

  const handleDeleteAll = () => {
    confirmAction('Delete ALL trades? This cannot be undone.', () => deleteAllMutation.mutate())
  }

  if (isLoading) return <DashboardSkeleton />
  if (error) return <p className="text-red-400">Failed to load dashboard.</p>
  if (!data) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Total P&L</span>
            <span className={`text-lg font-semibold ${pnlColor(data.totalPnl)}`}>{formatPnl(data.totalPnl)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition"
          >
            {seedMutation.isPending ? 'Seeding...' : '🧪 Seed test data'}
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={deleteAllMutation.isPending}
            className="text-xs bg-red-900/50 hover:bg-red-900 text-red-300 px-3 py-1.5 rounded-lg transition"
          >
            {deleteAllMutation.isPending ? 'Deleting...' : '🗑 Delete all trades'}
          </button>
        </div>
      </div>

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
          value={formatPnl(data.todayPnl)}
          icon={<CircleDollarSign size={18} />}
          valueColor={pnlColor(data.todayPnl)}
          highlight={data.isDailyLossLimitHit}
        />
        <StatCard
          label="Monthly P&L"
          value={formatPnl(data.monthlyPnl)}
          icon={<PiggyBank size={18} />}
          valueColor={pnlColor(data.monthlyPnl)}
        />
        <StatCard
          label="Win Rate"
          value={`${data.winRate}%`}
          icon={<Trophy size={18} />}
          valueColor={rateColor(data.winRate)}
        />
        <StatCard
          label="Avg Discipline Score"
          value={`${data.averageDisciplineScore}/100`}
          icon={<Target size={18} />}
          valueColor={scoreColor(data.averageDisciplineScore)}
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
                formatter={(val) => [`$${Number(val).toFixed(2)}`, 'P&L']}
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
          <div className="text-center py-10">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-gray-400 text-sm mb-4">No trades yet.</p>
            <Link
              to="/trades"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              + Log a trade
            </Link>
          </div>
        ) : (
          <TradesTable
            trades={data.recentTrades}
            compact
            onRowClick={trade => navigate(`/trades/${trade.id}`)}
          />
        )}
      </div>
    </div>
  )
}

export default DashboardPage
