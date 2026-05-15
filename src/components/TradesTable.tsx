import { pnlColor, formatPnl, formatDate, formatPrice } from '../utils/format'
import type { TradeDto } from '../types'

interface TradesTableProps {
  trades: TradeDto[]
  onRowClick?: (trade: TradeDto) => void
  compact?: boolean   // hides Entry, Exit, Qty columns
}

function TradesTable({ trades, onRowClick, compact = false }: TradesTableProps) {
  const isClickable = !!onRowClick

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-gray-400 text-left border-b border-gray-800">
          <th className="pb-3">Ticker</th>
          <th className="pb-3">Type</th>
          <th className="pb-3">Strategy</th>
          <th className="pb-3">Date</th>
          {!compact && <th className="pb-3">Entry</th>}
          {!compact && <th className="pb-3">Exit</th>}
          {!compact && <th className="pb-3">Qty</th>}
          <th className="pb-3">P&L</th>
          <th className="pb-3">Score</th>
        </tr>
      </thead>
      <tbody>
        {trades.map(trade => (
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
            <td className="py-3 text-gray-400">{trade.disciplineScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TradesTable
