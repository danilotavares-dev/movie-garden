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
import { useAppDialog } from '../components/AppDialog'

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
  mediaType?: 'movie' | 'tv'
}

interface CatalogSearchResult extends MediaItem {}

export function Catalog() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { showDialog } = useAppDialog()

  const [quickLibrary, setQuickLibrary] = useState<LibraryItemsData[]>([])
  const [isLibraryLoading, setIsLibraryLoading] = useState(false)

  const [isLogOutModal, setIsLogOutModal] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('')
  const [catalogSearchResults, setCatalogSearchResults] = useState<
    CatalogSearchResult[]
  >([])
  const [isCatalogSearching, setIsCatalogSearching] = useState(false)
  const [catalogSearchPage, setCatalogSearchPage] = useState(1)
  const [catalogSearchTotalPages, setCatalogSearchTotalPages] = useState(1)
  const [aiRecommendations, setAiRecommendations] = useState<
    AiRecommendation[]
  >([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiRecommendationMovies, setAiRecommendationMovies] = useState<
    MediaItem[]
  >([])

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
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([])
  const [popularSeries, setPopularSeries] = useState<MediaItem[]>([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MediaItem[]>([])
  const [popularMoviesPageTwo, setPopularMoviesPageTwo] = useState<MediaItem[]>([])
  const [popularSeriesPageTwo, setPopularSeriesPageTwo] = useState<MediaItem[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<MediaItem[]>([])
  const [topRatedSeriesList, setTopRatedSeriesList] = useState<MediaItem[]>([])
  const [airingTodaySeries, setAiringTodaySeries] = useState<MediaItem[]>([])
  const [onTheAirSeries, setOnTheAirSeries] = useState<MediaItem[]>([])

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
    setAiRecommendationMovies([])

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recommendations`,
        {
          movieTitle: searchTerm,
          userPreferences: `Idioma da resposta: ${currentLang}. O pedido pode incluir filmes e séries.`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const recommendations: AiRecommendation[] = Array.isArray(response.data)
        ? response.data
        : []
      setAiRecommendations(recommendations)

      const hydratedRecommendations = await Promise.all(
        recommendations.map(async (recommendation) => {
          const mediaType = recommendation.mediaType === 'tv' ? 'tv' : 'movie'
          const result =
            mediaType === 'tv'
              ? await tmdb.searchTv(recommendation.title, currentLang)
              : await tmdb.searchMovie(recommendation.title)

          if (!result) return null

          return {
            id: result.id,
            title: result.title || result.name,
            posterPath: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
            rating: result.vote_average,
            category: recommendation.reason,
            mediaType,
          } satisfies MediaItem
        }),
      )
      setAiRecommendationMovies(
        hydratedRecommendations.filter(
          (item): item is MediaItem => item !== null,
        ),
      )
      setTimeout(() => {
        document
          .getElementById('ai-results')
          ?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error(error)
      showDialog('Não foi possível obter recomendações da IA no momento.', {
        title: 'Recomendações indisponíveis',
        variant: 'error',
      })
    } finally {
      setIsAiLoading(false)
    }

  }

  async function handleCatalogSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = catalogSearchTerm.trim()
    if (!query) return

    setIsCatalogSearching(true)
    try {
      const [movies, series] = await Promise.all([
        tmdb.searchMovies(query, currentLang),
        tmdb.searchSeries(query, currentLang),
      ])
      const results = [
        ...movies.results.map((movie: any): CatalogSearchResult => ({
          id: movie.id,
          title: movie.title,
          posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average,
          category: t('catalogPage.badgesCardMovie'),
          mediaType: 'movie',
        })),
        ...series.results.map((show: any): CatalogSearchResult => ({
          id: show.id,
          title: show.name,
          posterPath: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
          rating: show.vote_average,
          category: t('catalogPage.badgesCardSerie'),
          mediaType: 'tv',
        })),
      ]

      setCatalogSearchResults(results)
      setCatalogSearchPage(1)
      setCatalogSearchTotalPages(
        Math.max(movies.total_pages ?? 1, series.total_pages ?? 1),
      )
    } catch (error) {
      console.error('Erro ao pesquisar no catálogo', error)
      showDialog('Não foi possível realizar a busca agora.', {
        title: 'Busca indisponível',
        variant: 'error',
      })
    } finally {
      setIsCatalogSearching(false)
    }
  }

  async function handleLoadMoreCatalogResults() {
    const nextPage = catalogSearchPage + 1
    if (
      isCatalogSearching ||
      nextPage > catalogSearchTotalPages ||
      !catalogSearchTerm.trim()
    ) {
      return
    }

    setIsCatalogSearching(true)
    try {
      const [movies, series] = await Promise.all([
        tmdb.searchMovies(catalogSearchTerm, currentLang, nextPage),
        tmdb.searchSeries(catalogSearchTerm, currentLang, nextPage),
      ])
      const nextResults = [
        ...movies.results.map((movie: any): CatalogSearchResult => ({
          id: movie.id,
          title: movie.title,
          posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.vote_average,
          category: t('catalogPage.badgesCardMovie'),
          mediaType: 'movie',
        })),
        ...series.results.map((show: any): CatalogSearchResult => ({
          id: show.id,
          title: show.name,
          posterPath: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
          rating: show.vote_average,
          category: t('catalogPage.badgesCardSerie'),
          mediaType: 'tv',
        })),
      ]

      setCatalogSearchResults((currentResults) => [
        ...currentResults,
        ...nextResults,
      ])
      setCatalogSearchPage(nextPage)
    } catch (error) {
      console.error('Erro ao carregar mais resultados do catálogo', error)
      showDialog('Não foi possível carregar mais resultados.', {
        title: 'Busca indisponível',
        variant: 'error',
      })
    } finally {
      setIsCatalogSearching(false)
    }
  }

  useEffect(() => {
    async function loadContent() {
      try {
        const token = localStorage.getItem('token')

        const [
          trendingData,
          seriesData,
          topRatedData,
          popularMoviesData,
          popularSeriesData,
          nowPlayingData,
          popularMoviesPageTwoData,
          popularSeriesPageTwoData,
          upcomingMoviesData,
          topRatedSeriesData,
          airingTodayData,
          onTheAirData,
        ] = await Promise.all([
          tmdb.getTrendingMovies(currentLang, 1),
          tmdb.getTrendingSeries(currentLang, 1),
          tmdb.getTopRated(currentLang, 1),
          tmdb.getPopularMovies(currentLang, 1),
          tmdb.getPopularSeries(currentLang, 1),
          tmdb.getNowPlaying(currentLang, 1),
          tmdb.getPopularMovies(currentLang, 2),
          tmdb.getPopularSeries(currentLang, 2),
          tmdb.getUpcoming(currentLang, 1),
          tmdb.getTopRatedSeries(currentLang, 1),
          tmdb.getAiringToday(currentLang, 1),
          tmdb.getOnTheAir(currentLang, 1),
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
        setTopRatedSeriesList(
          formatMedia(
            topRatedSeriesData.results,
            t('catalogPage.badgesCardSerie'),
            'tv',
          ),
        )
        setRecommendedMovies(
          formatMedia(
            topRatedData.results,
            t('catalogPage.badgesCardRecommended'),
            'movie',
          ),
        )
        setPopularMovies(
          formatMedia(
            popularMoviesData.results,
            t('catalogPage.badgesCardMovie'),
            'movie',
          ),
        )
        setPopularSeries(
          formatMedia(
            popularSeriesData.results,
            t('catalogPage.badgesCardSerie'),
            'tv',
          ),
        )
        setNowPlayingMovies(
          formatMedia(
            nowPlayingData.results,
            t('catalogPage.badgesCardMovie'),
            'movie',
          ),
        )
        setPopularMoviesPageTwo(
          formatMedia(
            popularMoviesPageTwoData.results,
            t('catalogPage.badgesCardMovie'),
            'movie',
          ),
        )
        setPopularSeriesPageTwo(
          formatMedia(
            popularSeriesPageTwoData.results,
            t('catalogPage.badgesCardSerie'),
            'tv',
          ),
        )
        setUpcomingMovies(
          formatMedia(
            upcomingMoviesData.results,
            t('catalogPage.badgesCardMovie'),
            'movie',
          ),
        )
        setAiringTodaySeries(
          formatMedia(
            airingTodayData.results,
            t('catalogPage.badgesCardSerie'),
            'tv',
          ),
        )
        setOnTheAirSeries(
          formatMedia(
            onTheAirData.results,
            t('catalogPage.badgesCardSerie'),
            'tv',
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-4 animate-fade-in">
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm border-none cursor-default"
            onClick={() => setIsLogOutModal(false)}
            aria-label="Fechar modal"
          />
          <div className="relative max-h-[calc(100vh-2rem)] overflow-y-auto bg-[#F5F7F5] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4 border-2 border-[#113A2D]/10">
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
          <div className="flex items-center gap-1 sm:gap-3 w-full max-w-[1600px] mb-1">
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

            <div className="h-12 sm:h-14 flex-1 min-w-0 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-between px-2 sm:px-4 py-2 mx-auto border border-white/10 shadow-lg">
              <div className="flex flex-row">
                <Logo className="h-8 w-8 text-white" />

                <div className="h-8 w-2 sm:w-8 sm:mx-5" />
              </div>

              <form
                onSubmit={handleCatalogSearch}
                className="flex h-10 min-w-0 w-full max-w-[400px] items-center cursor-text rounded-full border border-transparent bg-white/10 px-3 transition-colors hover:bg-white/20 focus-within:border-green-500/50 focus-within:bg-black/40"
              >
                <SearchIcon className="mr-3 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={catalogSearchTerm}
                  onChange={(e) => setCatalogSearchTerm(e.target.value)}
                  disabled={isCatalogSearching}
                  placeholder="Pesquisar filmes e séries"
                  className="bg-transparent w-full text-sm outline-none text-white placeholder:text-zinc-400"
                />
              </form>

              <div className="flex gap-1 sm:gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setIsAiPanelOpen(true)}
                  className="flex h-9 items-center gap-2 rounded-full bg-green-500/15 px-3 text-xs font-semibold text-green-300 transition-colors hover:bg-green-500/25 sm:h-10 sm:px-4"
                  aria-label="Abrir busca por inteligência artificial"
                >
                  <span aria-hidden="true">✦</span>
                  <span className="hidden sm:inline">Busca IA</span>
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white"
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
                      <div className="absolute top-full mt-2 right-0 w-max min-w-[160px] max-w-[calc(100vw-1rem)] bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col z-20 border border-white/10">
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
                  className="px-3 sm:px-5 h-9 sm:h-10 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-red-900/20"
                >
                  {t('catalogPage.logOut')}
                </button>
              </div>
            </div>
          </div>
        </header>

        {isAiPanelOpen && (
          <>
            <button
              type="button"
              aria-label="Fechar busca por IA"
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsAiPanelOpen(false)}
            />
            <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#101613] p-5 text-white shadow-2xl sm:p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
                    Movie Garden AI
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Busca por IA</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Descreva o que você quer assistir e receba recomendações.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiPanelOpen(false)}
                  className="rounded-full bg-white/10 px-3 py-2 text-zinc-300 hover:bg-white/20"
                  aria-label="Fechar painel"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAiSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isAiLoading}
                  placeholder="Ex.: séries parecidas com Dark"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-green-500/60"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !searchTerm.trim()}
                  className="rounded-xl bg-green-500 px-4 font-bold text-black transition-colors hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAiLoading ? '...' : 'Enviar'}
                </button>
              </form>

              <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
                {isAiLoading && (
                  <p className="rounded-xl bg-white/5 p-4 text-sm text-zinc-300">
                    A IA está pensando...
                  </p>
                )}
                {aiRecommendations.map((recommendation) => (
                  <div
                    key={`${recommendation.mediaType}-${recommendation.title}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold">{recommendation.title}</h3>
                      <span className="shrink-0 text-xs text-green-300">
                        {recommendation.mediaType === 'tv' ? 'Série' : 'Filme'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">
                      {recommendation.reason}
                    </p>
                  </div>
                ))}
                {aiRecommendationMovies.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {aiRecommendationMovies.map((movie) => (
                      <button
                        key={`${movie.mediaType}-${movie.id}`}
                        type="button"
                        onClick={() => {
                          setIsAiPanelOpen(false)
                          handleNavigateToDetail(movie)
                        }}
                        className="overflow-hidden rounded-lg text-left"
                      >
                        <img
                          src={movie.posterPath}
                          alt={movie.title}
                          className="aspect-[2/3] w-full object-cover"
                        />
                        <span className="mt-1 block truncate text-xs text-zinc-300">
                          {movie.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </>
        )}

        <main className="relative w-full">
          <div className="relative w-full h-[78vh] min-h-[560px] sm:h-[95vh] sm:min-h-[700px]">
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
            {catalogSearchResults.length > 0 && (
              <section className="w-full max-w-[1500px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-white">
                    Resultados para "{catalogSearchTerm}"
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogSearchResults([])
                      setCatalogSearchTerm('')
                      setCatalogSearchPage(1)
                      setCatalogSearchTotalPages(1)
                    }}
                    className="text-sm text-zinc-400 hover:text-white"
                  >
                    Limpar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {catalogSearchResults.map((movie) => (
                    <button
                      key={`${movie.mediaType}-${movie.id}`}
                      type="button"
                      onClick={() => handleNavigateToDetail(movie)}
                      className="text-left"
                    >
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="aspect-[2/3] w-full rounded-xl object-cover transition-transform hover:scale-[1.03]"
                      />
                      <p className="mt-2 truncate text-sm font-medium text-white">
                        {movie.title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {movie.category} · {movie.rating.toFixed(1)}
                      </p>
                    </button>
                  ))}
                </div>
                {catalogSearchPage < catalogSearchTotalPages && (
                  <button
                    type="button"
                    onClick={handleLoadMoreCatalogResults}
                    disabled={isCatalogSearching}
                    className="mx-auto mt-6 block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCatalogSearching ? 'Carregando...' : 'Carregar mais'}
                  </button>
                )}
              </section>
            )}

            {aiRecommendations.length > 0 && (
              <div
                id="ai-results"
                className="w-full max-w-[1500px] mb-8 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-900/20 to-black p-4 backdrop-blur-sm sm:p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                      {t('catalogPage.aiLabel')}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-white">
                      {t('catalogPage.aiResultsFor', { query: searchTerm })}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                    {aiRecommendations.length}{' '}
                    {t('catalogPage.aiResultsCount')}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {aiRecommendations.map((rec) => (
                    <div
                      key={`${rec.mediaType}-${rec.title}`}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-green-500/50 hover:bg-white/10"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {rec.title}
                        </h3>
                        <span className="shrink-0 text-xs text-green-300">
                          {rec.mediaType === 'tv'
                            ? t('catalogPage.aiSeries')
                            : t('catalogPage.aiMovie')}
                        </span>
                      </div>
                      <p className="text-sm italic text-zinc-300">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiRecommendationMovies.length > 0 && (
              <MovieRow
                title={t('catalogPage.aiCatalogResults')}
                movies={aiRecommendationMovies}
                onMovieClick={(movie) =>
                  handleNavigateToDetail(movie as MediaItem)
                }
              />
            )}

            {aiRecommendations.length > 0 &&
              aiRecommendationMovies.length === 0 && (
                <p className="w-full max-w-[1500px] rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                  {t('catalogPage.aiNoCatalogResults')}
                </p>
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
              title={t('catalogPage.topRatedSeries')}
              movies={topRatedSeriesList}
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
            <MovieRow
              title={t('catalogPage.popularMovies')}
              movies={popularMovies}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.popularSeries')}
              movies={popularSeries}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.nowPlaying')}
              movies={nowPlayingMovies}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.upcoming')}
              movies={upcomingMovies}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.airingToday')}
              movies={airingTodaySeries}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.onTheAir')}
              movies={onTheAirSeries}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.morePopularMovies')}
              movies={popularMoviesPageTwo}
              onMovieClick={(movie) =>
                handleNavigateToDetail(movie as MediaItem)
              }
            />
            <MovieRow
              title={t('catalogPage.morePopularSeries')}
              movies={popularSeriesPageTwo}
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
