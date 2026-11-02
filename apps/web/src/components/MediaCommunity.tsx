import { useEffect, useState } from 'react'
import { mediaCommunityService } from '../services/api'
import { useAppDialog } from './AppDialog'

interface MediaCommunityProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
}

interface Message {
  id: string
  content: string
  userName: string
  createdAt: string
}

export function MediaCommunity({
  mediaId,
  mediaType,
  title,
}: MediaCommunityProps) {
  const { showDialog } = useAppDialog()
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    let active = true
    mediaCommunityService
      .get(mediaType, mediaId)
      .then((data) => {
        if (!active) return
        setMessages(data.messages)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [mediaId, mediaType])

  async function handleSendMessage(event: React.FormEvent) {
    event.preventDefault()
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const created = await mediaCommunityService.sendMessage(
        mediaType,
        mediaId,
        message,
      )
      setMessages((current) => [created, ...current])
      setMessage('')
    } catch {
      showDialog('Não foi possível enviar sua mensagem.', {
        title: 'Chat indisponível',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!localStorage.getItem('token')) return null

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div>
        <h2 className="text-xl font-bold text-green-400">Comentários</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Compartilhe sua opinião sobre este título.
        </p>
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={500}
          placeholder={`Comente sobre ${title}...`}
          className="min-w-0 flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Publicar
        </button>
      </form>
      <div className="mt-5 max-h-80 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">Seja o primeiro a comentar.</p>
        ) : (
          messages.map((item) => (
            <div key={item.id} className="rounded-xl bg-white/5 p-3">
              <p className="text-xs font-bold text-green-400">{item.userName}</p>
              <p className="mt-1 break-words text-sm text-zinc-200">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
