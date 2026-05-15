import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { BaseResponse, TradeDto } from '../types'
import CreateTradeModal from '../components/CreateTradeModal'

interface Filters {
  ticker: string
  optionType: string
  strategy: string
  fromDate: string
  toDate: string
}

const emptyFilters: Filters = {
  ticker: '',
  optionType: '',
  strategy: '',
  fromDate: '',
  toDate: '',
}

function TradesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['trades', filters],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filters.ticker) params.ticker = filters.ticker
      if (filters.optionType) params.optionType = filters.optionType
      if (filters.strategy) params.strategy = filters.strategy
      if (filters.fromDate) params.fromDate = filters.fromDate
      if (filters.toDate) params.toDate = filters.toDate

      const res = await api.get<BaseResponse<TradeDto[]>>('/api/v1/trades', { params })
      return res.data.data
    }
  })

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')
  const pnlColor = (val: number) => val >= 0 ? 'text-green-400' : 'text-red-400'

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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
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
        {isLoading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">Failed to load trades.</p>}
        {data && data.length === 0 && (
          <p className="text-gray-500 text-sm">
            {hasActiveFilters ? 'No trades match your filters.' : 'No trades yet. Log your first trade!'}
          </p>
        )}
        {data && data.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-800">
                <th className="pb-3">Ticker</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Strategy</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Entry</th>
                <th className="pb-3">Exit</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">P&L</th>
                <th className="pb-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map(trade => (
                <tr
                  key={trade.id}
                  onClick={() => navigate(`/trades/${trade.id}`)}
                  className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                >
                  <td className="py-3 font-medium">{trade.ticker}</td>
                  <td className="py-3 text-gray-400">{trade.optionType}</td>
                  <td className="py-3 text-gray-400">{trade.strategy}</td>
                  <td className="py-3 text-gray-400">{new Date(trade.tradeDate).toLocaleDateString()}</td>
                  <td className="py-3 text-gray-400">${trade.entryPrice.toFixed(2)}</td>
                  <td className="py-3 text-gray-400">${trade.exitPrice.toFixed(2)}</td>
                  <td className="py-3 text-gray-400">{trade.quantity}</td>
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

      {isModalOpen && <CreateTradeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default TradesPage
