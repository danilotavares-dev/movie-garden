import { useNavigate } from 'react-router-dom'
import { Logo, LanguageIcon } from '@movie-garden/ui'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-custom-gradient py-3 px-4 overflow-x-hidden">
      <header className="mb-7 sticky top-3 z-50">
        {' '}
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
        <div className="h-9 w-full max-w-[1400px] bg-zinc-300/60 backdrop-blur-md rounded-full text-sm font-medium text-green-900 flex items-center justify-center px-3 py-2 mx-auto gap-6 shadow-sm">
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
              className="hover:text-green-700 hover:scale-105 transition-all whitespace-nowrap"
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
            className="bg-[#113A2D] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl"
          >
            Começar Jornada
          </button>
        </div>
      </main>

      <footer className="bg-white/60 w-full min-h-[200px] rounded-3xl backdrop-blur-sm p-8 flex flex-col items-center justify-center text-zinc-500">
        <p>© 2026 Movie Garden</p>
      </footer>
    </div>
  )
}
