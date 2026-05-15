import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import type { BaseResponse, TradeDto } from '../types'

function TradeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: trade, isLoading } = useQuery({
    queryKey: ['trade', id],
    queryFn: async () => {
      const res = await api.get<BaseResponse<TradeDto>>(`/api/v1/trades/${id}`)
      return res.data.data
    },
    enabled: !!id
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/v1/trades/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate('/trades')
    }
  })

  const handleDelete = () => {
    if (confirm('Delete this trade? This cannot be undone.')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) return <p className="text-gray-400">Loading...</p>
  if (!trade) return <p className="text-gray-400">Trade not found.</p>

  const apiBase = import.meta.env.VITE_API_BASE_URL
  const pnlColor = trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/trades')}
            className="text-gray-400 hover:text-white text-sm mb-2"
          >
            ← Back to Trades
          </button>
          <h1 className="text-2xl font-bold">{trade.ticker} — {trade.optionType}</h1>
          <p className="text-gray-400 text-sm">{new Date(trade.tradeDate).toLocaleDateString()}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Trade'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="P&L" value={`${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`} color={pnlColor} />
        <Stat label="Entry → Exit" value={`$${trade.entryPrice.toFixed(2)} → $${trade.exitPrice.toFixed(2)}`} />
        <Stat label="Quantity" value={trade.quantity.toString()} />
        <Stat label="DTE" value={`${trade.dte} days`} />
      </div>

      {/* Discipline */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Discipline Score: {trade.disciplineScore}/100</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <Check label="Stop loss" value={trade.hasStopLoss} />
          <Check label="Profit target" value={trade.hasProfitTarget} />
          <Check label="Position sizing" value={trade.hasPositionSizing} />
          <Check label="Appropriate DTE" value={trade.hasAppropriateDte} />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
          <p>Ticked score: {trade.tickedScore}/20</p>
          <p>AI score: {trade.aiScore}/80</p>
        </div>
      </div>

      {/* Notes */}
      {trade.notes && (
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{trade.notes}</p>
        </div>
      )}

      {/* AI Feedback */}
      {trade.aiFeedback && (
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">AI Feedback</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{trade.aiFeedback}</p>
        </div>
      )}

      {/* Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trade.ibkrScreenshotUrl && (
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">IBKR Screenshot</h3>
            <img src={`${apiBase}${trade.ibkrScreenshotUrl}`} alt="IBKR" className="w-full rounded-lg" />
          </div>
        )}
        {trade.chartScreenshotUrl && (
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Chart Screenshot</h3>
            <img src={`${apiBase}${trade.chartScreenshotUrl}`} alt="Chart" className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-lg font-bold ${color ?? 'text-white'}`}>{value}</p>
    </div>
  )
}

function Check({ label, value }: { label: string; value: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${value ? 'text-green-400' : 'text-gray-500'}`}>
      <span>{value ? '✓' : '✗'}</span>
      <span>{label}</span>
    </div>
  )
}

export default TradeDetailPage
