import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  HeroBanner,
  LanguageIcon,
  Logo,
  SearchIcon,
  MovieRow,
  LibraryButton,
  type LibraryItemsData,
} from '@movie-garden/ui'
import { tmdb } from '../services/tmdb'
import { genreMap } from '../utils/genres'
import { WatchListButton } from '../components/watchlistButton.tsx'
import { myListService } from '../services/api.ts'

interface TMDBMovieResult {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  vote_average: number
}

interface MediaItem {
  id: number
  title: string
  posterPath: string
  rating: number
  category: string
  mediaType: 'movie' | 'tv'
}

interface BannerItem {
  id: number
  title: string
  description: string
  backDropUrl: string
  posterPath: string
}

interface AiRecommendation {
  title: string
  reason: string
}

export function Catalog() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [quickLibrary, setQuickLibrary] = useState<LibraryItemsData[]>([])
  const [isLibraryLoading, setIsLibraryLoading] = useState(false)

  const [isLogOutModal, setIsLogOutModal] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [aiRecommendations, setAiRecommendations] = useState<
    AiRecommendation[]
  >([])
  const [isAiLoading, setIsAiLoading] = useState(false)

  const [aiDiscoveryMovies, setAiDiscoveryMovies] = useState<MediaItem[]>([])
  const [discoveryTitle, setDiscoveryTitle] = useState('')

  const currentLang = i18n.language

  const languages = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ]

  const [featuredMovie, setFeaturedMovie] = useState<BannerItem | null>(null)
  const [recommendedMovies, setRecommendedMovies] = useState<MediaItem[]>([])
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([])
  const [topRatedSeries, setTopRatedSeries] = useState<MediaItem[]>([])

  function handleLanguageChange(langCode: string) {
    i18n.changeLanguage(langCode)
    setIsLangMenuOpen(false)
  }

  function handleLogout() {
    setIsLogOutModal(true)
  }

  function handleNavigateToDetail(item: MediaItem) {
    if (item.mediaType === 'tv') {
      navigate(`/serie/${item.id}`)
    } else {
      navigate(`/movie/${item.id}`)
    }
  }

  async function handleAiSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsAiLoading(true)
    setAiRecommendations([])

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recommendations`,
        {
          movieTitle: searchTerm,
          userPreferences: 'Gosto do usuário baseado no prompt',
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setAiRecommendations(response.data)
      setTimeout(() => {
        document
          .getElementById('ai-results')
          ?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error(error)
      alert('Não foi possível obter recomendações da IA no momento.')
    } finally {
      setIsAiLoading(false)
    }
  }

  useEffect(() => {
    async function loadContent() {
      try {
        const token = localStorage.getItem('token')

        const [trendingData, seriesData, TopRatedData] = await Promise.all([
          tmdb.getTrendingMovies(currentLang),
          tmdb.getTrendingSeries(currentLang),
          tmdb.getTopRated(currentLang),
        ])

        if (trendingData.results.length > 0) {
          const randomFeatured =
            trendingData.results[
              Math.floor(Math.random() * trendingData.results.length)
            ]
          setFeaturedMovie({
            id: randomFeatured.id,
            title: randomFeatured.title,
            description: randomFeatured.overview || '',
            backDropUrl: `https://image.tmdb.org/t/p/original${randomFeatured.backdrop_path}`,
            posterPath: randomFeatured.poster_patch,
          })
        }

        const formatMedia = (
          list: any[],
          fallbackCategory: string,
          type: 'movie' | 'tv',
        ) =>
          list.map((item: any) => {
            const firstGenreId = item.genre_ids ? item.genre_ids[0] : null
            const genreKey = firstGenreId
              ? genreMap[firstGenreId]
              : 'genres.unknown'
            const genreName = genreKey ? t(genreKey) : fallbackCategory

            return {
              id: item.id,
              title: item.title || item.name,
              posterPath: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              rating: item.vote_average,
              category: genreName,
              mediaType: type,
            }
          })

        setTrendingMovies(
          formatMedia(
            trendingData.results,
            t('catalogPage.badgesCardMovie'),
            'movie',
          ),
        )
        setTopRatedSeries(
          formatMedia(
            seriesData.results,
            t('catalogPage.badgesCardSerie'),
            'tv',
          ),
        )
        setRecommendedMovies(
          formatMedia(
            TopRatedData.results,
            t('catalogPage.badgesCardRecommended'),
            'movie',
          ),
        )

        const themes = [
          'Cyberpunk e Distopias Tecnológicas',
          'Plot Twists Inacreditáveis',
          'Filmes de Terror Psicológico Cult',
          'Animações Japonesas Profundas',
          'Ficção Científica Filosófica',
          'Suspense Noir Policial',
          'Comédias Inteligentes dos Anos 90',
          'Viagem no Tempo e Paradoxos',
        ]

        const randomTheme = themes[Math.floor(Math.random() * themes.length)]
        setDiscoveryTitle(randomTheme)

        const aiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/recommendations`,
          {
            movieTitle: '',
            userPreferences: randomTheme,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )

        const suggestions: AiRecommendation[] = aiResponse.data

        const hydratedMovies = await Promise.all(
          suggestions.map(async (item) => {
            const tmdbResult = await tmdb.searchMovie(item.title)
            if (!tmdbResult) return null

            return {
              id: tmdbResult.id,
              title: tmdbResult.title,
              posterPath: `https://image.tmdb.org/t/p/w500${tmdbResult.poster_path}`,
              rating: tmdbResult.vote_average,
              category: 'Discovery',
            }
          }),
        )

        setAiDiscoveryMovies(hydratedMovies.filter(Boolean) as MediaItem[])
      } catch (error) {
        console.error(error)
      }
    }
    loadContent()
  }, [currentLang, t])

  useEffect(() => {
    async function loadQuickLibrary() {
      try {
        setIsLibraryLoading(true)

        const data = await myListService.getAll()

        const formatted: LibraryItemsData[] = data
          .slice(0, 10)
          .map((item: any) => ({
            id: item.mediaId,
            title: item.title,
            posterPath: item.poster,
            mediaType: item.mediaType,
          }))

        setQuickLibrary(formatted)
      } catch (error) {
        console.error('Erro ao carregar lista rápida')
      } finally {
        setIsLibraryLoading(false)
      }
    }

    const token = localStorage.getItem('token')
    if (token) loadQuickLibrary()
  }, [])

  return (
    <>
      {isLogOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm border-none cursor-default"
            onClick={() => setIsLogOutModal(false)}
            aria-label="Fechar modal"
          />
          <div className="relative bg-[#F5F7F5] rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4 border-2 border-[#113A2D]/10">
            <div className="w-16 h-16 bg-[#113A2D]/10 rounded-full flex items-center justify-center text-3xl">
              😟
            </div>
            <h3 className="text-2xl font-bold text-[#113A2D]">
              {t('modalConfirmLogOut.title')}
            </h3>
            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('isAuthenticated')
                  localStorage.removeItem('userId')
                  localStorage.removeItem('token')
                  navigate('/')
                }}
                className="w-full bg-red-800 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
              >
                {t('modalConfirmLogOut.confirmLogOut')}
              </button>
              <button
                type="button"
                onClick={() => setIsLogOutModal(false)}
                className="w-full bg-transparent text-zinc-500 py-2 font-medium hover:text-[#113A2D] transition-colors"
              >
                {t('modalConfirmLogOut.cancelLogOut')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen w-full bg-custom-gradient-night overflow-x-hidden">
        <header className="fixed flex flex-col justify-center items-center top-3 left-0 right-0 z-50 px-4 transition-all duration-300">
          <div className="flex items-center gap-3 w-full max-w-[1600px] mb-1">
            <LibraryButton
              tooltipText={t('catalogPage.openYourList')}
              items={quickLibrary}
              isLoading={isLibraryLoading}
              onViewAllClick={() => navigate('/library')}
              onItemClick={(item) => {
                if (item.mediaType === 'tv') navigate(`/serie/${item.id}`)
                else navigate(`/movie/${item.id}`)
              }}
              classNameButton="... bg-black/40 backdrop-blur-md"
            />

            <div className="h-14 flex-1 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-between px-4 py-2 mx-auto border border-white/10 shadow-lg">
              <div className="flex flex-row">
                <Logo className="h-8 w-8 text-white" />

                <div className="h-8 w-8 mx-5" />
              </div>

              <form
                onSubmit={handleAiSearch}
                className="hidden md:flex h-10 w-[400px] items-center cursor-text bg-white/10 rounded-full px-4 hover:bg-white/20 transition-colors border border-transparent focus-within:border-green-500/50 focus-within:bg-black/40"
              >
                <SearchIcon
                  className={`mr-3 h-4 ${isAiLoading ? 'text-green-400 animate-pulse' : 'text-zinc-400'}`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isAiLoading}
                  placeholder={
                    isAiLoading
                      ? 'A IA está pensando...'
                      : t('catalogPage.placeholderSearchBar')
                  }
                  className="bg-transparent w-full text-sm outline-none text-white placeholder:text-zinc-400"
                />
              </form>

              <div className="flex gap-3 items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white"
                  >
                    <LanguageIcon className="w-5 h-5" />
                  </button>
                  {isLangMenuOpen && (
                    <>
                      <button
                        type="button"
                        tabIndex={-1}
                        className="fixed inset-0 z-10 cursor-default w-full h-full bg-transparent border-none"
                        onClick={() => setIsLangMenuOpen(false)}
                      />
                      <div className="absolute top-full mt-2 right-0 bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden min-w-[160px] flex flex-col z-20 border border-white/10">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors hover:bg-white/5 text-zinc-300 ${currentLang === lang.code ? 'font-bold text-green-400' : ''}`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleLogout()}
                  className="px-5 h-10 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all shadow-lg hover:shadow-red-900/20"
                >
                  {t('catalogPage.logOut')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center border border-white/10 items-center bg-green-800/40 backdrop-blur-md max-w-[1000px] w-[600px] h-4 rounded-full"></div>
        </header>

        <main className="relative w-full">
          <div className="relative w-full h-[95vh] min-h-[700px]">
            {featuredMovie && (
              <HeroBanner
                title={featuredMovie.title}
                description={featuredMovie.description}
                backDropUrl={featuredMovie.backDropUrl}
                onWatchClick={() => navigate(`/movie/${featuredMovie.id}`)}
                actionSlot={
                  <WatchListButton
                    mediaId={featuredMovie.id}
                    mediaType="movie"
                    title={featuredMovie.title}
                    posterPath={featuredMovie.posterPath}
                  />
                }
              />
            )}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-[#000000]/60 to-transparent z-10 pointer-events-none" />
          </div>

          <div className="relative z-20 flex flex-col gap-4 px-4 md:px-6 -mt-24 items-center">
            {aiRecommendations.length > 0 && (
              <div
                id="ai-results"
                className="max-w-[1500px] h-auto min-h-[250px] mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-black border border-green-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-green-400">
                    Sugestões da IA para "{searchTerm}"
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiRecommendations.map((rec) => (
                    <div
                      key={rec.title}
                      className="h-auto min-h-[150px] bg-white/5 p-4 rounded-xl border border-white/10 hover:border-green-500/50 transition-all hover:bg-white/10"
                    >
                      <h3 className="font-bold text-lg text-white mb-2">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-zinc-300 italic">
                        "{rec.reason}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiDiscoveryMovies.length > 0 && (
              <MovieRow
                title={discoveryTitle}
                movies={aiDiscoveryMovies}
                onMovieClick={(movie) =>
                  handleNavigateToDetail(movie as MediaItem)
                }
              />
            )}

            <MovieRow
              title={t('catalogPage.trendingCinemas')}
              movies={trendingMovies}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.popSeries')}
              movies={topRatedSeries}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.recommended')}
              movies={recommendedMovies}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
          </div>
        </main>

        <footer className="bg-none w-full min-h-[200px] backdrop-blur-sm p-8 flex items-center justify-center text-zinc-500">
          <Logo className="absolute bottom-5 w-8 " />
          <p>© 2026 Movie Garden</p>
        </footer>
      </div>
    </>
  )
}
