import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

interface CreateTradeModalProps {
  onClose: () => void
}

interface FormData {
  ticker: string
  optionType: string
  strategy: string
  entryPrice: number
  exitPrice: number
  quantity: number
  dte: number
  tradeDate: string
  notes?: string
  hasStopLoss: boolean
  hasProfitTarget: boolean
  hasPositionSizing: boolean
  hasAppropriateDte: boolean
  ibkrScreenshot?: FileList
  chartScreenshot?: FileList
}

function CreateTradeModal({ onClose }: CreateTradeModalProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tradeDate: new Date().toISOString().split('T')[0],
      optionType: 'Call',
      strategy: 'Breakout + Retest',
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData()
      formData.append('Ticker', data.ticker)
      formData.append('OptionType', data.optionType)
      formData.append('Strategy', data.strategy)
      formData.append('EntryPrice', data.entryPrice.toString())
      formData.append('ExitPrice', data.exitPrice.toString())
      formData.append('Quantity', data.quantity.toString())
      formData.append('Dte', data.dte.toString())
      formData.append('TradeDate', new Date(data.tradeDate).toISOString())
      formData.append('HasStopLoss', data.hasStopLoss.toString())
      formData.append('HasProfitTarget', data.hasProfitTarget.toString())
      formData.append('HasPositionSizing', data.hasPositionSizing.toString())
      formData.append('HasAppropriateDte', data.hasAppropriateDte.toString())
      if (data.notes) formData.append('Notes', data.notes)
      if (data.ibkrScreenshot?.[0]) formData.append('IbkrScreenshot', data.ibkrScreenshot[0])
      if (data.chartScreenshot?.[0]) formData.append('ChartScreenshot', data.chartScreenshot[0])

      return api.post('/api/v1/trades', formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
    }
  })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Log New Trade</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ticker" error={errors.ticker?.message}>
              <input
                {...register('ticker', { required: 'Required' })}
                className="input"
                placeholder="AAPL"
              />
            </Field>

            <Field label="Trade Date" error={errors.tradeDate?.message}>
              <input
                type="date"
                {...register('tradeDate', { required: 'Required' })}
                className="input"
              />
            </Field>

            <Field label="Option Type">
              <select {...register('optionType')} className="input">
                <option>Call</option>
                <option>Put</option>
              </select>
            </Field>

            <Field label="Strategy">
              <select {...register('strategy')} className="input">
                <option>Breakout + Retest</option>
                <option>Consolidation Zone</option>
              </select>
            </Field>

            <Field label="Entry Price" error={errors.entryPrice?.message}>
              <input
                type="number"
                step="0.01"
                {...register('entryPrice', { required: 'Required', valueAsNumber: true })}
                className="input"
              />
            </Field>

            <Field label="Exit Price" error={errors.exitPrice?.message}>
              <input
                type="number"
                step="0.01"
                {...register('exitPrice', { required: 'Required', valueAsNumber: true })}
                className="input"
              />
            </Field>

            <Field label="Quantity" error={errors.quantity?.message}>
              <input
                type="number"
                {...register('quantity', { required: 'Required', valueAsNumber: true })}
                className="input"
              />
            </Field>

            <Field label="DTE (days to expiry)" error={errors.dte?.message}>
              <input
                type="number"
                {...register('dte', { required: 'Required', valueAsNumber: true })}
                className="input"
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              {...register('notes')}
              className="input"
              rows={3}
              placeholder="Why did you take this trade?"
            />
          </Field>

          <div className="border-t border-gray-800 pt-4">
            <p className="text-sm font-medium text-gray-400 mb-3">Discipline Checks (5 pts each)</p>
            <div className="grid grid-cols-2 gap-3">
              <Checkbox label="Had stop loss" {...register('hasStopLoss')} />
              <Checkbox label="Had profit target" {...register('hasProfitTarget')} />
              <Checkbox label="Proper position sizing" {...register('hasPositionSizing')} />
              <Checkbox label="Appropriate DTE" {...register('hasAppropriateDte')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="IBKR Screenshot">
              <input type="file" {...register('ibkrScreenshot')} className="input-file" accept="image/*" />
            </Field>
            <Field label="Chart Screenshot">
              <input type="file" {...register('chartScreenshot')} className="input-file" accept="image/*" />
            </Field>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">Failed to create trade.</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              {mutation.isPending ? 'Saving...' : 'Save Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

const Checkbox = ({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
    <input type="checkbox" {...rest} className="accent-blue-600" />
    {label}
  </label>
)

export default CreateTradeModal
