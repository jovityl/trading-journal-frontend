export const pnlColor = (val: number) =>
  val >= 0 ? 'text-green-400' : 'text-red-400'

export const formatPnl = (val: number) =>
  `${val >= 0 ? '+' : ''}$${val.toFixed(2)}`

export const formatDate = (val: string) =>
  new Date(val).toLocaleDateString()

export const formatPrice = (val: number) =>
  `$${val.toFixed(2)}`
