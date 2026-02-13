import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { myListService } from '../../services/api'
import { useNavigate } from 'react-router-dom'

interface WatchListButtonProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string
}

export function WatchListButton({
  mediaId,
  mediaType,
  title,
  posterPath,
}: WatchListButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [isInList, setIsInList] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && mediaId) {
      myListService
        .checkStatus(mediaId)
        .then((data) => setIsInList(data.isInList))
        .catch(() => setIsInList(false))
    }
  }, [mediaId])

  async function handleToggle() {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Faça login para salvar filmes!')
      navigate('/login')
      return
    }

    const wasInList = isInList

    setIsInList(!wasInList)

    try {
      if (wasInList) {
        await myListService.remove(mediaId)
      } else {
        await myListService.add({
          mediaId,
          title,
          posterPath,
          mediaType,
        })
      }
    } catch (error) {
      setIsInList(wasInList)
      console.log('Erro ao atualizar lista', error)
      alert('Erro ao atualizar a lista.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`h-[50px] border border-white/20 px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 backdrop-blur-sm
        ${
          isInList
            ? 'bg-green-600 border-green-600 text-white hover:bg-green-700 shadow-[0_0_15px_rgba(34, 197, 94, 0.5)]'
            : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
        }`}
    >
      {isInList ? (
        t('MovieDetailPage.AddedListbutton')
      ) : (
        t('MovieDetailPage.AddListbutton')
      )}
    </button>
  )
}
