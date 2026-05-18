import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import api from '../services/api'
import type { BaseResponse } from '../types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TradeChatProps {
  tradeId: string
}

function TradeChat({ tradeId }: TradeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const mutation = useMutation({
    mutationFn: async (newMessages: Message[]) => {
      const res = await api.post<BaseResponse<string>>(`/api/v1/trades/${tradeId}/chat`, {
        messages: newMessages,
      })
      return res.data.data
    },
    onSuccess: (reply) => {
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    }
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, mutation.isPending])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || mutation.isPending) return

    const next: Message[] = [...messages, { role: 'user', content: input }]
    setMessages(next)
    setInput('')
    mutation.mutate(next)
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-blue-400" size={20} />
        <h2 className="text-lg font-semibold">Ask AI About This Trade</h2>
      </div>

      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500 italic py-4">
            Ask anything about this trade. e.g. "Why was my entry early?" or "What should I do differently next time?"
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm prose prose-sm prose-invert max-w-none ${
              m.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-200'
            }`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
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
