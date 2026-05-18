export const pnlColor = (val: number) =>
  val >= 0 ? 'text-green-400' : 'text-red-400'

export const rateColor = (rate: number) => {
  if (rate >= 60) return 'text-green-400'
  if (rate >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

export const scoreColor = (score: number) => {
  if (score >= 75) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

export const formatPnl = (val: number) =>
  `${val >= 0 ? '+' : ''}$${val.toFixed(2)}`

export const formatDate = (val: string) =>
  new Date(val).toLocaleDateString()

export const formatPrice = (val: number) =>
  `$${val.toFixed(2)}`
