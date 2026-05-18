import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../services/api'
import { confirmAction } from '../utils/confirm'
import { pnlColor, formatPnl, formatDate, formatPrice } from '../utils/format'
import { useTrade } from '../hooks/useTrades'
import { usePageTitle } from '../hooks/usePageTitle'
import { Skeleton } from '../components/Skeleton'
import TradeChat from '../components/TradeChat'
import ReactMarkdown from 'react-markdown'

function TradeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: trade, isLoading } = useTrade(id)
  usePageTitle(trade ? `${trade.ticker} – Trade` : 'Trade')

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/v1/trades/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Trade deleted')
      navigate('/trades')
    },
    onError: () => toast.error('Failed to delete trade')
  })

  const handleDelete = () => {
    confirmAction('Delete this trade? This cannot be undone.', () => deleteMutation.mutate())
  }

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-64" />
    </div>
  )
  if (!trade) return <p className="text-gray-400">Trade not found.</p>

  const apiBase = import.meta.env.VITE_API_BASE_URL

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/trades')}
            className="inline-flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium mb-3 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
          >
            ← Back to Trades
          </button>
          <h1 className="text-2xl font-bold">{trade.ticker} — {trade.optionType}</h1>
          <p className="text-gray-400 text-sm">{formatDate(trade.tradeDate)}</p>
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
        <Stat label="P&L" value={formatPnl(trade.pnl)} color={pnlColor(trade.pnl)} />
        <Stat label="Entry → Exit" value={`${formatPrice(trade.entryPrice)} → ${formatPrice(trade.exitPrice)}`} />
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
      {trade.aiFeedback && (() => {
        const [analysis, takeaways] = trade.aiFeedback.split(/###\s*Takeaways\s*/i)
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">AI Analysis</h2>
              <div className="text-gray-300 prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{analysis.trim()}</ReactMarkdown>
              </div>
            </div>
            {takeaways && (
              <div className="bg-blue-950/40 border border-blue-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-3 text-blue-300">💡 Actionable Takeaways</h2>
                <div className="text-blue-100 prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{takeaways.trim()}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* Chat */}
      <TradeChat tradeId={trade.id} />

      {/* Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trade.ibkrScreenshotUrl && (
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">IBKR Screenshot</h3>
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <img src={`${apiBase}${trade.ibkrScreenshotUrl}`} alt="IBKR" className="w-full h-full object-contain" />
            </div>
          </div>
        )}
        {trade.chartScreenshotUrl && (
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Chart Screenshot</h3>
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <img src={`${apiBase}${trade.chartScreenshotUrl}`} alt="Chart" className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg">
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
