import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { pnlColor, formatPnl, formatDate, formatPrice, scoreColor } from '../utils/format'
import type { TradeDto } from '../types'

interface TradesTableProps {
  trades: TradeDto[]
  onRowClick?: (trade: TradeDto) => void
  compact?: boolean   // hides Entry, Exit, Qty columns
}

type SortKey = keyof TradeDto
type SortDir = 'asc' | 'desc'

function TradesTable({ trades, onRowClick, compact = false }: TradesTableProps) {
  const isClickable = !!onRowClick
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('desc')
    } else if (sortDir === 'desc') {
      setSortDir('asc')
    } else {
      // 3rd click → reset
      setSortKey(null)
    }
  }

  const sortedTrades = useMemo(() => {
    if (!sortKey) return trades
    return [...trades].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va == null || vb == null) return 0
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [trades, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="opacity-40" />
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  const Header = ({ col, label }: { col: SortKey; label: string }) => (
    <th className="pb-3">
      <button
        onClick={() => handleSort(col)}
        className="flex items-center gap-1 text-gray-400 hover:text-white"
      >
        {label} <SortIcon col={col} />
      </button>
    </th>
  )

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b border-gray-800">
          <Header col="ticker" label="Ticker" />
          <Header col="optionType" label="Type" />
          <Header col="strategy" label="Strategy" />
          <Header col="tradeDate" label="Date" />
          {!compact && <Header col="entryPrice" label="Entry" />}
          {!compact && <Header col="exitPrice" label="Exit" />}
          {!compact && <Header col="quantity" label="Qty" />}
          <Header col="pnl" label="P&L" />
          <Header col="disciplineScore" label="Score" />
        </tr>
      </thead>
      <tbody>
        {sortedTrades.map(trade => (
          <tr
            key={trade.id}
            onClick={() => onRowClick?.(trade)}
            className={`border-b border-gray-800 ${isClickable ? 'hover:bg-gray-800/50 cursor-pointer' : ''}`}
          >
            <td className="py-3 font-medium">{trade.ticker}</td>
            <td className="py-3 text-gray-400">{trade.optionType}</td>
            <td className="py-3 text-gray-400">{trade.strategy}</td>
            <td className="py-3 text-gray-400">{formatDate(trade.tradeDate)}</td>
            {!compact && <td className="py-3 text-gray-400">{formatPrice(trade.entryPrice)}</td>}
            {!compact && <td className="py-3 text-gray-400">{formatPrice(trade.exitPrice)}</td>}
            {!compact && <td className="py-3 text-gray-400">{trade.quantity}</td>}
            <td className={`py-3 font-medium ${pnlColor(trade.pnl)}`}>
              {formatPnl(trade.pnl)}
            </td>
            <td className={`py-3 font-medium ${scoreColor(trade.disciplineScore)}`}>
              {trade.disciplineScore}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TradesTable
