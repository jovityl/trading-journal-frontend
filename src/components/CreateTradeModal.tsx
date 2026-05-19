import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { tradesService } from '../services/tradesService'
import FileDropzone from './FileDropzone'

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
  violationTags: string[]
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
      violationTags: [],
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
      data.violationTags.forEach(tag => formData.append('ViolationTags', tag))
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

          {/* Section: Underlying Stock */}
          <Section title="Underlying Stock" hint="Required for accurate AI analysis">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Underlying Entry Price" error={errors.underlyingEntryPrice?.message}>
                <input
                  type="number"
                  step="0.01"
                  {...register('underlyingEntryPrice', { required: 'Required', valueAsNumber: true })}
                  className="input"
                  placeholder="e.g. 423.50"
                />
              </Field>

              <Field label="Underlying Exit Price" error={errors.underlyingExitPrice?.message}>
                <input
                  type="number"
                  step="0.01"
                  {...register('underlyingExitPrice', { required: 'Required', valueAsNumber: true })}
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

          {/* Section: Discipline */}
          <Section title="Discipline" hint="Tag any rules you broke — no tags means a clean trade">
            <Controller
              name="violationTags"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {VIOLATION_TAGS.map(tag => {
                    const selected = field.value.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => field.onChange(
                          selected
                            ? field.value.filter(t => t !== tag)
                            : [...field.value, tag]
                        )}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          selected
                            ? 'bg-red-500/20 border-red-500 text-red-300'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              )}
            />
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

export default CreateTradeModal
