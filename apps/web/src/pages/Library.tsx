import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSelector, Logo } from '@movie-garden/ui'
import { myListService } from '../services/api'
import type { LibraryItemsData } from '@movie-garden/ui'
import { useTranslation } from 'react-i18next'

export function Library() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [items, setItems] = useState<LibraryItemsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    myListService
      .getAll()
      .then((data) => {
        setItems(
          data.map((item: {
            mediaId: number
            title: string
            poster: string | null
            mediaType: 'movie' | 'tv'
          }) => ({
            id: item.mediaId,
            title: item.title,
            posterPath: item.poster,
            mediaType: item.mediaType,
          })),
        )
      })
      .catch((error) => {
        console.error('Erro ao carregar watchlist:', error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function openItem(item: LibraryItemsData) {
    navigate(`/${item.mediaType === 'tv' ? 'serie' : 'movie'}/${item.id}`)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-custom-gradient-night px-4 py-6 text-white sm:px-8">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/catalogo')}
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"
        >
          {t('libraryPage.back')}
        </button>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Logo className="h-10 w-10" />
        </div>
      </header>

      <section className="mx-auto mt-10 w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-green-400 sm:text-4xl">
          {t('libraryPage.title')}
        </h1>
        <p className="mt-2 text-zinc-400">
          {t('libraryPage.subtitle')}
        </p>

        {isLoading ? (
          <p className="py-16 text-center text-zinc-400">
            {t('libraryPage.loading')}
          </p>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
            {t('libraryPage.empty')}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((item) => (
              <button
                type="button"
                key={`${item.mediaType}-${item.id}`}
                onClick={() => openItem(item)}
                className="group min-w-0 text-left"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
                  {item.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                      alt={t('libraryPage.posterAlt', { title: item.title })}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-3 text-center text-xs text-zinc-500">
                      {t('libraryPage.noImage')}
                    </div>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-medium text-zinc-200 group-hover:text-green-400">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
