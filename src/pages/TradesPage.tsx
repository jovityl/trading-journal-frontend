import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrades } from '../hooks/useTrades'
import type { TradeFilters } from '../hooks/useTrades'
import { usePageTitle } from '../hooks/usePageTitle'
import CreateTradeModal from '../components/CreateTradeModal'
import TradesTable from '../components/TradesTable'
import { TableSkeleton } from '../components/Skeleton'

const VIOLATION_TAGS = [
  'Revenge Trade',
  'FOMO Entry',
  'Oversized Position',
  'Early Exit',
  'Late Exit',
  'Chased Entry',
  'No Clear Setup',
  'Broke Profit Target',
  'Overtraded',
]

const emptyFilters: TradeFilters = {
  ticker: '',
  optionType: '',
  strategy: '',
  fromDate: '',
  toDate: '',
  violationTag: '',
}

function TradesPage() {
  usePageTitle('Trades')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<TradeFilters>(emptyFilters)
  const navigate = useNavigate()

  const { data, isLoading, error } = useTrades(filters)

  const updateFilter = (key: keyof TradeFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trades</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          + Log Trade
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Ticker..."
            value={filters.ticker}
            onChange={e => updateFilter('ticker', e.target.value)}
            className="input"
          />
          <select
            value={filters.optionType}
            onChange={e => updateFilter('optionType', e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="Call">Call</option>
            <option value="Put">Put</option>
          </select>
          <select
            value={filters.strategy}
            onChange={e => updateFilter('strategy', e.target.value)}
            className="input"
          >
            <option value="">All Strategies</option>
            <option value="Breakout + Retest">Breakout + Retest</option>
            <option value="Consolidation Zone">Consolidation Zone</option>
          </select>
          <input
            type="date"
            value={filters.fromDate}
            onChange={e => updateFilter('fromDate', e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={e => updateFilter('toDate', e.target.value)}
            className="input"
          />
          <select
            value={filters.violationTag}
            onChange={e => updateFilter('violationTag', e.target.value)}
            className="input"
          >
            <option value="">All Trades</option>
            {VIOLATION_TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(emptyFilters)}
            className="mt-3 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        {isLoading && <TableSkeleton />}
        {error && <p className="text-red-400">Failed to load trades.</p>}
        {data && data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {hasActiveFilters ? 'No matching trades' : 'No trades yet'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters.'
                : 'Log your first trade to start building your discipline score.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={() => setFilters(emptyFilters)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
              >
                + Log first trade
              </button>
            )}
          </div>
        )}
        {data && data.length > 0 && (
          <TradesTable
            trades={data}
            onRowClick={trade => navigate(`/trades/${trade.id}`)}
          />
        )}
      </div>

      {isModalOpen && <CreateTradeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default TradesPage
