import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { tradesService } from '../services/tradesService'
import FileDropzone from './FileDropzone'

interface CreateTradeModalProps {
  onClose: () => void
}

interface FormData {
  ticker: string
  optionType: string
  strategy: string
  entryPrice: number
  exitPrice: number
  underlyingEntryPrice?: number
  underlyingExitPrice?: number
  quantity: number
  dte: number
  tradeDate: string
  notes?: string
  entryQuality: number
  exitQuality: number
  riskManagement: number
  planAdherence: number
  ibkrScreenshot?: FileList
  chartScreenshot?: FileList
}

function CreateTradeModal({ onClose }: CreateTradeModalProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      tradeDate: new Date().toISOString().split('T')[0],
      optionType: 'Call',
      strategy: 'Breakout + Retest',
      entryQuality: 3,
      exitQuality: 3,
      riskManagement: 3,
      planAdherence: 3,
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
      formData.append('EntryQuality', data.entryQuality.toString())
      formData.append('ExitQuality', data.exitQuality.toString())
      formData.append('RiskManagement', data.riskManagement.toString())
      formData.append('PlanAdherence', data.planAdherence.toString())
      if (data.notes) formData.append('Notes', data.notes)
      if (data.underlyingEntryPrice) formData.append('UnderlyingEntryPrice', data.underlyingEntryPrice.toString())
      if (data.underlyingExitPrice) formData.append('UnderlyingExitPrice', data.underlyingExitPrice.toString())
      if (data.ibkrScreenshot?.[0]) formData.append('IbkrScreenshot', data.ibkrScreenshot[0])
      if (data.chartScreenshot?.[0]) formData.append('ChartScreenshot', data.chartScreenshot[0])

      return tradesService.create(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Trade logged successfully')
      onClose()
    },
    onError: () => toast.error('Failed to log trade')
  })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Log New Trade</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-6">
          {/* Section: Trade Info */}
          <Section title="Trade Info">
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
          </Section>

          {/* Section: Option Premium */}
          <Section title="Option Premium">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </Section>

          {/* Section: Underlying Stock (optional) */}
          <Section title="Underlying Stock (optional)" hint="Helps the AI evaluate entry/exit timing">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Underlying Entry Price">
                <input
                  type="number"
                  step="0.01"
                  {...register('underlyingEntryPrice', { valueAsNumber: true })}
                  className="input"
                  placeholder="e.g. 423.50"
                />
              </Field>

              <Field label="Underlying Exit Price">
                <input
                  type="number"
                  step="0.01"
                  {...register('underlyingExitPrice', { valueAsNumber: true })}
                  className="input"
                  placeholder="e.g. 425.80"
                />
              </Field>
            </div>
          </Section>

          {/* Section: Notes */}
          <Section title="Notes">
            <Field label="">
              <textarea
                {...register('notes')}
                className="input"
                rows={3}
                placeholder="Your own thoughts, observations, mistakes, or wins..."
              />
            </Field>
          </Section>

          {/* Section: Self-Rating (1-5 each, sum = up to 20 pts) */}
          <Section title="Self-Rating" hint="Rate yourself 1-5 in each area (max 20 pts of discipline score)">
            <div className="space-y-3">
              <Controller name="entryQuality" control={control} render={({ field }) =>
                <StarRow label="Entry quality" value={field.value} onChange={field.onChange} />
              } />
              <Controller name="exitQuality" control={control} render={({ field }) =>
                <StarRow label="Exit quality" value={field.value} onChange={field.onChange} />
              } />
              <Controller name="riskManagement" control={control} render={({ field }) =>
                <StarRow label="Risk management" value={field.value} onChange={field.onChange} />
              } />
              <Controller name="planAdherence" control={control} render={({ field }) =>
                <StarRow label="Plan adherence" value={field.value} onChange={field.onChange} />
              } />
            </div>
          </Section>

          {/* Section: Screenshots */}
          <Section title="Screenshots">
            <div className="grid grid-cols-2 gap-4">
              <Field label="IBKR Screenshot">
                <FileDropzone {...register('ibkrScreenshot')} />
              </Field>
              <Field label="Chart Screenshot">
                <FileDropzone {...register('chartScreenshot')} />
              </Field>
            </div>
          </Section>

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

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{title}</h3>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function StarRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="text-gray-600 hover:text-yellow-400 transition"
          >
            <Star size={20} fill={n <= value ? '#facc15' : 'none'} className={n <= value ? 'text-yellow-400' : ''} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default CreateTradeModal
