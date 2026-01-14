import { useNavigate } from 'react-router-dom'
import { Logo, LanguageIcon, MovieRow } from '@movie-garden/ui'
import { useEffect, useState } from 'react'
import { tmdb } from '../services/tmdb'

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

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('pt-BR')

  const languages = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ]

  function handleLanguageChange(langCode: string) {
    setCurrentLang(langCode)
    setIsLangMenuOpen(false)

    console.log('Idioma alterado para:', langCode)
  }

  const [movies, setMovies] = useState<MediaItem[]>([])
  const [series, setSeries] = useState<MediaItem[]>([])

  useEffect(() => {
    async function loadContent() {
      const [moviesData, seriesData] = await Promise.all([
        tmdb.getTrendingMovies(),
        tmdb.getTrendingSeries(),
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
    }

    loadContent()
  }, [])

  return (
    <div className="min-h-screen bg-custom-gradient py-3 px-4 overflow-x-hidden">
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
                    aria-label="Fechar menu"
                  />

                  <div className="absolute top-full mt-2 right-0 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden min-w-[160px] flex flex-col z-20 border border-white/50 animate-fade-in">
                    {languages.map((lang) => (
                      <button
                        type="button"
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors hover:bg-[#113A2D]/10
                          ${currentLang === lang.code ? 'font-bold text-[#113A2D] bg-[#113A2D]/5' : 'text-zinc-600'}
                        `}
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
              Entrar
            </button>
          </div>
        </div>
        <div className="h-8 w-full max-w-[1400px] bg-zinc-300/60 backdrop-blur-md rounded-full text-sm font-medium text-green-900 flex items-center justify-center px-3 py-2 mx-auto gap-6 shadow-sm">
          {[
            'Filmes',
            'Séries',
            'Lançamentos',
            'Listas Populares',
            'Comunidade',
          ].map((item) => (
            <a
              key={item}
              href="/"
              className="hover:text-green-700 min-w-[30px] hover:scale-105 transition-all whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>
      </header>

      <main className="flex flex-col w-full min-h-screen bg-[#D9D9D9]/60 rounded-3xl mb-7 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#113A2D] rounded-full blur-[180px] opacity-40 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-[600px] text-center gap-6">
          <h1 className="text-5xl md:text-7xl font-bold text-[#113A2D] drop-shadow-sm">
            Bem-vindo ao <br /> Movie Garden
          </h1>
          <p className="text-xl text-zinc-700 max-w-2xl">
            Seu espaço para plantar ideias, colher recomendações e cultivar seu
            amor pelo cinema.
          </p>
          <button
            type="button"
            onClick={() => navigate('/cadastro')}
            className="bg-[#113A2D] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 shadow-xl"
          >
            Começar Jornada
          </button>
        </div>

        <MovieRow title="Lançamentos no Cinema" movies={movies} />

        <MovieRow title="Séries em Alta" movies={series} />

        <section className="w-full max-w-[1400px] mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#113A2D] mb-4">
              Por que criar uma conta?
            </h2>
            <p className="text-zinc-600">
              Leve sua paixão por cinema para o próximo nível.
            </p>
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
                Organize sua lista
              </h3>
              <p className="text-zinc-600 text-sm">
                Nunca mais esqueça o que assistir. Crie listas personalizadas de
                "Para Assistir", "Favoritos" e "Já Vistos".
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
                Avalie e Critique
              </h3>
              <p className="text-zinc-600 text-sm">
                Dê notas para os filmes e escreva reviews. Sua opinião ajuda a
                comunidade a descobrir novas joias.
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#113A2D] mb-2">
                Conecte-se
              </h3>
              <p className="text-zinc-600 text-sm">
                Siga amigos, veja o que eles estão assistindo e compartilhe suas
                descobertas nas redes sociais.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full px-4 mb-12">
          <div className="max-w-[1400px] mx-auto bg-[#113A2D] rounded-3xl p-12 relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Pronto para montar seu jardim?
              </h2>
              <p className="text-zinc-300 max-w-lg">
                É rápido, fácil e totalmente gratuito. Junte-se a milhares de
                amantes de cinema hoje mesmo.
              </p>
              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="bg-white text-[#113A2D] px-8 py-3 rounded-xl font-bold hover:bg-zinc-100 hover:scale-105 shadow-lg"
              >
                Criar Conta Grátis
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
