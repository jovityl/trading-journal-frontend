import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminService } from '../services/adminService'
import { usePageTitle } from '../hooks/usePageTitle'
import { Skeleton } from '../components/Skeleton'

function AdminPromptsPage() {
  usePageTitle('Admin · Prompts')
  const queryClient = useQueryClient()
  const { data: prompts, isLoading } = useQuery({
    queryKey: ['admin', 'prompts'],
    queryFn: () => adminService.getPrompts(),
  })

  // local edits keyed by prompt key
  const [edits, setEdits] = useState<Record<string, string>>({})

  useEffect(() => {
    if (prompts) {
      // only initialize keys that haven't been edited yet (preserves unsaved local edits)
      setEdits(prev => {
        const next = { ...prev }
        prompts.forEach(p => {
          if (!(p.key in next)) next[p.key] = p.content
        })
        return next
      })
    }
  }, [prompts])

  const updateMutation = useMutation({
    mutationFn: ({ key, content }: { key: string; content: string }) =>
      adminService.updatePrompt(key, content),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'prompts'] })
      toast.success(`Prompt "${key}" updated`)
    },
    onError: () => toast.error('Failed to update prompt'),
  })

  if (isLoading) return <Skeleton className="h-96" />
  if (!prompts) return null

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Prompts</h1>
        <p className="text-gray-400 text-sm mt-1">
          Edit AI prompts here. Changes take effect immediately, no deploy needed.
        </p>
      </div>

      {prompts.map(prompt => (
        <div key={prompt.key} className="bg-gray-900 rounded-xl p-6 space-y-3">
          <div className="flex justify-between items-baseline">
            <h2 className="text-lg font-semibold font-mono">{prompt.key}</h2>
            <span className="text-xs text-gray-500">
              Last updated: {new Date(prompt.updatedAt).toLocaleString()}
            </span>
          </div>

          <textarea
            value={edits[prompt.key] ?? ''}
            onChange={e => setEdits(prev => ({ ...prev, [prompt.key]: e.target.value }))}
            rows={16}
            className="input font-mono text-xs"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEdits(prev => ({ ...prev, [prompt.key]: prompt.content }))}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            >
              Reset
            </button>
            <button
              onClick={() => updateMutation.mutate({ key: prompt.key, content: edits[prompt.key] })}
              disabled={updateMutation.isPending || edits[prompt.key] === prompt.content}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminPromptsPage
