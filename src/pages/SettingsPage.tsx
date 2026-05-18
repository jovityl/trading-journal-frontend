import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { usersService } from '../services/usersService'
import { usePageTitle } from '../hooks/usePageTitle'
import { Skeleton } from '../components/Skeleton'

interface FormData {
  dailyLossLimit: number
  dailyProfitTarget: number
}

function SettingsPage() {
  usePageTitle('Settings')
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<FormData>()

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => usersService.getMe(),
  })

  // prefill the form once user data loads
  useEffect(() => {
    if (data) {
      reset({
        dailyLossLimit: data.dailyLossLimit,
        dailyProfitTarget: data.dailyProfitTarget,
      })
    }
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: (formData: FormData) => usersService.updateLimits(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Settings saved')
    },
    onError: () => toast.error('Failed to save settings')
  })

  if (isLoading) return (
    <div className="max-w-lg space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-64" />
    </div>
  )

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Limits</h2>
        <p className="text-gray-400 text-sm mb-6">
          Set your daily loss limit and profit target. The dashboard will alert you when you hit them.
        </p>

        <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Daily Loss Limit ($)</label>
            <input
              type="number"
              {...register('dailyLossLimit', { valueAsNumber: true })}
              className="input"
              placeholder="e.g. -500"
            />
            <p className="text-xs text-gray-500 mt-1">Use a negative number, e.g. -500</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Daily Profit Target ($)</label>
            <input
              type="number"
              {...register('dailyProfitTarget', { valueAsNumber: true })}
              className="input"
              placeholder="e.g. 1000"
            />
          </div>

          {mutation.isSuccess && (
            <p className="text-green-400 text-sm">Settings saved.</p>
          )}
          {mutation.isError && (
            <p className="text-red-400 text-sm">Failed to save.</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SettingsPage
