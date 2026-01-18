import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LanguageIcon, Logo, SearchIcon } from '@movie-garden/ui'
import i18n from '../lib/i18n'
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

export function Catalog() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

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

  function handleLogout() {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <div className="min-h-screen w-full bg-custom-gradient overflow-x-hidden py-3 px-4">
      <header className="mb-7 sticky top-3 z-50">
        <div className="h-11 w-full max-w-[1600px] bg-white/60 backdrop-blur-md rounded-full flex items-center justify-between px-3 py-2 mx-auto mb-2 shadow-sm relative z-50">
          <Logo className="h-8 w-8" />

          <label className="h-full w-[400px] flex items-center cursor-text border border-zinc-700 rounded-xl px-2 hover:scale-x-105 transition-transform">
            <SearchIcon className="mr-2 h-4" />

            <input
              type="text"
              placeholder={t('catalogPage.placeholderSearchBar')}
              className="bg-transparent w-full text-sm outline-none"
            />
          </label>

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
              onClick={() => handleLogout()}
              className="px-6 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors"
            >
              {t('catalogPage.logOut')}
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}
