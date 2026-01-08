import { useNavigate } from 'react-router-dom'
import { Logo, LanguageIcon, MovieRow } from '@movie-garden/ui'

export function LandingPage() {
  const navigate = useNavigate()

  {
    /* Dados Fictícios */
  }
  const PREVIEW_MOVIES = [
    {
      id: 1,
      title: 'Avatar: Fire and Ash',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/5Udy89ttZtJ5cMC9y3o22zzyevg.jpg',
      rating: 8.6,
      category: 'Sci-Fi',
    },
    {
      id: 2,
      title: 'Wicked',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/c5Tqxeo1UpBvnAc3csUm7j3y8qT.jpg',
      rating: 7.8,
      category: 'Fantasy',
    },
    {
      id: 3,
      title: 'Mufasa',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/lurEK87Luk7BuAtEj7ALxDd9TjA.jpg',
      rating: 7.5,
      category: 'Adventure',
    },
    {
      id: 4,
      title: 'Sonic 3',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/nyq6Pj0z512tNf1r9G4k2x6sX2.jpg',
      rating: 8.2,
      category: 'Action',
    },
    {
      id: 5,
      title: 'Kraven',
      posterPath:
        'https://image.tmdb.org/t/p/original/1Gf3J5c9N5F5c9N5F5c9N5F5c9.jpg',
      rating: 6.9,
      category: 'Action',
    },
    {
      id: 5,
      title: 'Kraven',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1Gf3J5c9N5F5c9N5F5c9N5F5c9.jpg',
      rating: 6.9,
      category: 'Action',
    },
    {
      id: 5,
      title: 'Kraven',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1Gf3J5c9N5F5c9N5F5c9N5F5c9.jpg',
      rating: 6.9,
      category: 'Action',
    },
  ]

  const PREVIEW_SERIES = [
    {
      id: 1,
      title: 'Arcane',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/abf8tHznhSvl9BAlDUSwIXx7mMB.jpg',
      rating: 9.5,
      category: 'Animation',
    },
    {
      id: 2,
      title: 'The Last of Us',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/uKvVjHNqB5VmOrdxqAt2F7J78Tw.jpg',
      rating: 8.6,
      category: 'Drama',
    },
    {
      id: 3,
      title: 'Stranger Things',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      rating: 8.6,
      category: 'Mystery',
    },
    {
      id: 4,
      title: 'Wednesday',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/9RkwQB56a0c5zZqWb1O3j3N4X4.jpg',
      rating: 8.5,
      category: 'Fantasy',
    },
    {
      id: 5,
      title: 'House of the Dragon',
      posterPath:
        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/t9XkeE7SzOqwrKnJmZEnNC09UvI.jpg',
      rating: 8.4,
      category: 'Drama',
    },
  ]

  return (
    <div className="min-h-screen bg-custom-gradient py-3 px-4 overflow-x-hidden">
      <header className="mb-7 sticky top-3 z-50">
        <div className="h-11 w-full max-w-[1600px] bg-white/60 backdrop-blur-md rounded-full flex items-center justify-between px-3 py-2 mx-auto mb-2 shadow-sm">
          <Logo className="h-8 w-8" />

          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="w-12 h-7 bg-[#616161]/60 hover:bg-[#616161]/80 rounded-full flex items-center justify-center transition-colors text-white"
            >
              <LanguageIcon className="w-5 h-5" />
            </button>

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

        <MovieRow title="Lançamentos no Cinema" movies={PREVIEW_MOVIES} />

        <MovieRow title="Séries em Alta" movies={PREVIEW_SERIES} />

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
        <p>© 2026 Movie Garden</p>
      </footer>
    </div>
  )
}
