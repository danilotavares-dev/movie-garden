import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tmdb } from '../services/tmdb'
import { LanguageIcon } from '@movie-garden/ui'
import { useTranslation } from 'react-i18next'

interface SerieDetail {
  id: number
  name: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  first_air_date: string
  number_of_seasons: number
  genres: { id: number; name: string }[]
  created_by: { name: string }[]
}

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export function Series() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [serie, setSerie] = useState<SerieDetail | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [creator, setCreator] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
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

  useEffect(() => {
    async function loadDetails() {
      if (!id) return

      try {
        setLoading(true)
        window.scrollTo(0, 0)

        const [detailsData, creditsData] = await Promise.all([
          tmdb.getTvDetails(id, currentLang),
          tmdb.getTvCredits(id, currentLang),
        ])

        setSerie(detailsData)

        const creators = detailsData.created_by
          ?.map((c: any) => c.name)
          .join(', ')
        setCreator(creators || t('SerieDetailPage.unknownCreator'))

        setCast(creditsData.cast.slice(0, 20))
      } catch (error) {
        console.error('Erro ao carregar série:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [id, t, navigate, currentLang])

  if (loading || !serie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 animate-pulse text-xl font-bold">
          {t('loadingDatas')}
        </div>
      </div>
    )
  }

  const formattedDate = serie.first_air_date
    ? new Date(serie.first_air_date).toLocaleDateString('pt-BR')
    : t('SerieDetailPage.unknownData') 
  const seasons = serie.number_of_seasons

  return (
    <div className="min-h-screen bg-custom-gradient-night text-white overflow-x-hidden">
      <header className="absolute flex justify-between top-0 items-center left-0 w-full p-6 z-50">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-green-950 hover:bg-green-600/80 px-4 py-2 rounded-full backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
        >
          {t('MovieDetailPage.backButton')}
        </button>

        <div>
          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-10 h-10 bg-white/10 border border-zinc-400 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white"
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
              <div className="absolute top-full -mt-3 right-8 bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden min-w-[160px] flex flex-col z-20 border border-white/10">
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
      </header>

      <div className="relative w-full h-[65vh] lg:h-[75vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-10" />

        <img
          src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`}
          alt={serie.name}
          className="w-full h-full object-cover opacity-60"
        />

        <div className="flex absolute bottom-0 left-0 p-8 z-20 max-w-8xl w-full md:pl-12 pb-12">
          <div className="mr-7 z-20 relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
              alt={`Poster ${serie.name}`}
              className="w-[300px] rounded-xl shadow-2xl border-4 border-[#1a1a1a] hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {serie.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-zinc-300 mb-6 font-medium">
              <span className="text-green-400 font-bold border border-green-400/50 bg-green-400/10 px-2 py-0.5 rounded">
                {serie.vote_average.toFixed(1)} nota
              </span>
              <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
              <span>{formattedDate}</span>
              <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
              <span>
                {seasons} {seasons === 1 ? t('SerieDetailPage.season') : t('SerieDetailPage.seasons')}
              </span>
              <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
              <span className="italic text-zinc-100">
                {serie.genres.map((g) => g.name).join(', ')}
              </span>
            </div>

            <p className="text-zinc-200 text-lg max-w-5xl mb-[100px] leading-relaxed drop-shadow-md">
              {serie.overview}
            </p>

            <button
              type="button"
              className="h-[50px] bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 backdrop-blur-sm"
            >
              + {t('MovieDetailPage.MyListbutton')}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-12 gap-12 left-12">
        <div className="max-w-[1200px] flex flex-col justify-center gap-10">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 inline-block max-w-md">
            <h3 className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">
              {t('SerieDetailPage.creators')}
            </h3>
            <p className="text-2xl font-medium text-white">{creator}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center border-l-4 border-white pl-3 gap-2">
              {t('MovieDetailPage.mainCastMovie')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-[#111] rounded-xl overflow-hidden border border-white/5 hover:border-green-500/50 transition-all group hover:-translate-y-1 duration-300"
                >
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-48 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-48 bg-zinc-800 flex items-center justify-center text-zinc-500 text-3xl">
                      👤
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-bold text-sm truncate text-zinc-100">
                      {actor.name}
                    </p>
                    <p className="text-xs text-green-400/80 truncate mt-1">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
