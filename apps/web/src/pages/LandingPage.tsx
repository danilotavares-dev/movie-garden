import { useNavigate } from 'react-router-dom'
import { Logo, LanguageIcon, MovieRow } from '@movie-garden/ui'
import { useEffect, useState } from 'react'
import { tmdb } from '../services/tmdb'
import { useTranslation } from 'react-i18next'

interface TMDBMovieResult {
  id: number
  title: string
  poster_path: string
  vote_average: number
}
interface TMDBSeriesResult {
  id: number
  name: string
  poster_path: string
  vote_average: number
}
interface MediaItem {
  id: number
  title: string
  posterPath: string
  rating: number
  category: string
}

export function LandingPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [movies, setMovies] = useState<MediaItem[]>([])
  const [series, setSeries] = useState<MediaItem[]>([])

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const currentLang = i18n.language

  const languages = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ]

  function handleLanguageChange(langCode: string) {
    i18n.changeLanguage(langCode)
    setIsLangMenuOpen(false)
  }

  function handleMovieClick() {
    setIsLoginModalOpen(true)
  }

  useEffect(() => {
    async function loadContent() {
      try {
        const [moviesData, seriesData] = await Promise.all([
          tmdb.getTrendingMovies(currentLang),
          tmdb.getTrendingSeries(currentLang),
        ])
        const formattedMovies = moviesData.results.map(
          (item: TMDBMovieResult) => ({
            id: item.id,
            title: item.title,
            posterPath: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            rating: item.vote_average,
            category: 'Cinema',
          }),
        )
        const formattedSeries = seriesData.results.map(
          (item: TMDBSeriesResult) => ({
            id: item.id,
            title: item.name,
            posterPath: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            rating: item.vote_average,
            category: 'TV Show',
          }),
        )
        setMovies(formattedMovies)
        setSeries(formattedSeries)
      } catch (error) {
        console.error(error)
      }
    }
    loadContent()
  }, [currentLang])

  return (
    <div className="min-h-screen bg-custom-gradient py-3 px-4 overflow-x-hidden relative">
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm border-none cursor-default"
            onClick={() => setIsLoginModalOpen(false)}
            aria-label="Fechar modal"
          />

          <div className="relative bg-[#F5F7F5] rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4 border-2 border-[#113A2D]/10">
            <div className="w-16 h-16 bg-[#113A2D]/10 rounded-full flex items-center justify-center text-3xl">
              🔒
            </div>

            <h3 className="text-2xl font-bold text-[#113A2D]">
              {t('modal.title')}
            </h3>

            <p className="text-zinc-600 mb-4">{t('modal.text')}</p>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-[#113A2D] text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
              >
                {t('modal.login')}
              </button>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full bg-transparent text-zinc-500 py-2 font-medium hover:text-[#113A2D] transition-colors"
              >
                {t('modal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-7 sticky top-3 z-50">
        <div className="h-11 w-full max-w-[1600px] bg-white/60 backdrop-blur-md rounded-full flex items-center justify-between px-3 py-2 mx-auto mb-2 shadow-sm relative z-50">
          <Logo className="h-8 w-8" />
          <div className="flex gap-2 items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="w-12 h-7 bg-[#616161]/60 hover:bg-[#616161]/80 rounded-full flex items-center justify-center transition-colors text-white relative z-20"
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
                  <div className="absolute top-full mt-2 right-0 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden min-w-[160px] flex flex-col z-20 border border-white/50">
                    {languages.map((lang) => (
                      <button
                        type="button"
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors hover:bg-[#113A2D]/10 ${
                          currentLang === lang.code
                            ? 'font-bold text-[#113A2D] bg-[#113A2D]/5'
                            : 'text-zinc-600'
                        }`}
                      >
                        <span className="text-lg leading-none">
                          {lang.flag}
                        </span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-6 h-7 bg-[#616161]/60 hover:bg-[#616161]/80 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors"
            >
              {t('login')}
            </button>
          </div>
        </div>
        <div className="h-8 w-full max-w-[1400px] bg-zinc-300/60 backdrop-blur-md rounded-full text-sm font-medium text-green-900 flex items-center justify-center px-3 py-2 mx-auto gap-6 shadow-sm">
          {['movies', 'series', 'releases', 'popular', 'community'].map(
            (key) => (
              <a
                key={key}
                href="/"
                className="hover:text-green-700 min-w-[30px] hover:scale-105 transition-all whitespace-nowrap"
              >
                {t(`nav.${key}`)}
              </a>
            ),
          )}
        </div>
      </header>

      <main className="flex flex-col w-full min-h-screen bg-[#D9D9D9]/60 rounded-3xl mb-7 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#113A2D] rounded-full blur-[180px] opacity-40 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-[600px] text-center gap-6">
          <h1 className="text-5xl md:text-7xl font-bold text-[#113A2D] drop-shadow-sm">
            {t('hero.title')} <br /> Movie Garden
          </h1>
          <p className="text-xl text-zinc-700 max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/cadastro')}
            className="bg-[#113A2D] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 shadow-xl"
          >
            {t('hero.button')}
          </button>
        </div>

        <MovieRow
          title={t('sections.movies')}
          movies={movies}
          onMovieClick={handleMovieClick}
        />

        <MovieRow
          title={t('sections.series')}
          movies={series}
          onMovieClick={handleMovieClick}
        />

        <section className="w-full max-w-[1400px] mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#113A2D] mb-4">
              {t('why.title')}
            </h2>
            <p className="text-zinc-600">{t('why.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 hover:border-[#113A2D]/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-12 h-12 bg-[#113A2D]/10 rounded-full flex items-center justify-center mb-4 text-[#113A2D]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 6h13" />
                  <path d="M8 12h13" />
                  <path d="M8 18h13" />
                  <path d="M3 6h.01" />
                  <path d="M3 12h.01" />
                  <path d="M3 18h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#113A2D] mb-2">
                {t('cards.organize.title')}
              </h3>
              <p className="text-zinc-600 text-sm">
                {t('cards.organize.text')}
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 hover:border-[#113A2D]/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-12 h-12 bg-[#113A2D]/10 rounded-full flex items-center justify-center mb-4 text-[#113A2D]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#113A2D] mb-2">
                {t('cards.rate.title')}
              </h3>
              <p className="text-zinc-600 text-sm">{t('cards.rate.text')}</p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 hover:border-[#113A2D]/50 transition-all hover:-translate-y-1 shadow-sm">
              <div className="w-12 h-12 bg-[#113A2D]/10 rounded-full flex items-center justify-center mb-4 text-[#113A2D]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#113A2D] mb-2">
                {t('cards.connect.title')}
              </h3>
              <p className="text-zinc-600 text-sm">{t('cards.connect.text')}</p>
            </div>
          </div>
        </section>

        <section className="w-full px-4 mb-12">
          <div className="max-w-[1400px] mx-auto bg-[#113A2D] rounded-3xl p-12 relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {t('cta.title')}
              </h2>
              <p className="text-zinc-300 max-w-lg">{t('cta.text')}</p>
              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="bg-white text-[#113A2D] px-8 py-3 rounded-xl font-bold hover:bg-zinc-100 hover:scale-105 shadow-lg"
              >
                {t('cta.button')}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white/60 w-full min-h-[200px] rounded-3xl backdrop-blur-sm p-8 flex flex-col items-center justify-center text-zinc-500">
        <Logo className="absolute bottom-5 w-8 " />
        <p>© 2026 Movie Garden</p>
      </footer>
    </div>
  )
}
