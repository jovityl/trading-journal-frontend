export interface TradeDto {
  id: string
  ticker: string
  optionType: string
  strategy: string
  entryPrice: number
  exitPrice: number
  quantity: number
  dte: number
  tradeDate: string
  pnl: number
  notes?: string
  ibkrScreenshotUrl?: string
  chartScreenshotUrl?: string
  aiScore: number
  aiFeedback?: string
  violationTags: string[]
  disciplineScore: number
  createdAt: string
}

export interface PnlChartDto {
  date: string
  pnl: number
}

export interface ScoreChartDto {
  date: string
  averageScore: number
}

export interface ViolationTagStatDto {
  tag: string
  count: number
}

export interface DashboardDto {
  totalPnl: number
  todayPnl: number
  monthlyPnl: number
  winRate: number
  averageDisciplineScore: number
  isDailyLossLimitHit: boolean
  isDailyProfitTargetHit: boolean
  dailyLossLimit: number
  dailyProfitTarget: number
  pnlChart: PnlChartDto[]
  equityCurve: PnlChartDto[]
  scoreChart: ScoreChartDto[]
  recentTrades: TradeDto[]
  violationTagStats: ViolationTagStatDto[]
  cleanTradeRate: number
}

export interface BaseResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}
