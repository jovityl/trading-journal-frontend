import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import { tradesService, type TradeMessageDto } from '../services/tradesService'
import { confirmAction } from '../utils/confirm'

interface TradeChatProps {
  tradeId: string
}

const MODEL_OPTIONS = [
  // All models must support vision since chat includes the chart screenshot
  { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (premium)' },
  { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (cheap)' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (cheap)' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (cheap)' },
]

function TradeChat({ tradeId }: TradeChatProps) {
  const queryClient = useQueryClient()
  const [input, setInput] = useState('')
  const [model, setModel] = useState<string>(MODEL_OPTIONS[0].value)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: messages = [] } = useQuery({
    queryKey: ['trade-messages', tradeId],
    queryFn: () => tradesService.getMessages(tradeId),
  })

  const mutation = useMutation({
    mutationFn: (allMessages: { role: 'user' | 'assistant'; content: string }[]) =>
      tradesService.chat(tradeId, allMessages, model),
    onMutate: async (allMessages) => {
      // Optimistic update — show user's message immediately
      await queryClient.cancelQueries({ queryKey: ['trade-messages', tradeId] })
      const previous = queryClient.getQueryData(['trade-messages', tradeId])

      const latestUser = allMessages[allMessages.length - 1]
      queryClient.setQueryData(['trade-messages', tradeId], (old: TradeMessageDto[] = []) => [
        ...old,
        {
          id: `temp-${Date.now()}`,
          role: latestUser.role,
          content: latestUser.content,
          createdAt: new Date().toISOString(),
        },
      ])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['trade-messages', tradeId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-messages', tradeId] })
    }
  })

  const clearMutation = useMutation({
    mutationFn: () => tradesService.clearMessages(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-messages', tradeId] })
      toast.success('Chat cleared')
    },
    onError: () => toast.error('Failed to clear chat'),
  })

  const handleClear = () => {
    confirmAction('Clear all chat messages for this trade?', () => clearMutation.mutate())
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, mutation.isPending])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || mutation.isPending) return

    const fullConversation = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: input }
    ]
    setInput('')
    mutation.mutate(fullConversation)
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-400" size={20} />
          <h2 className="text-lg font-semibold">Ask AI About This Trade</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300"
          >
            {MODEL_OPTIONS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearMutation.isPending}
              title="Clear chat"
              className="text-gray-400 hover:text-red-400 disabled:opacity-50 p-1.5 rounded-lg hover:bg-gray-800 transition"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="space-y-4 mb-4 h-[500px] overflow-y-auto pr-2">
        {messages.length === 0 && !mutation.isPending && (
          <div className="text-sm text-gray-500 italic py-4">
            Ask anything about this trade. e.g. "Why was my entry early?" or "What should I do differently next time?"
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${m.role === 'user' ? 'max-w-[75%]' : 'max-w-[90%]'} px-4 py-3 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-800 text-gray-200 rounded-bl-sm'
            }`}>
              <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          className="input flex-1"
          disabled={mutation.isPending}
        />
        <button
          type="submit"
          disabled={!input.trim() || mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 rounded-lg transition flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

export default TradeChat
