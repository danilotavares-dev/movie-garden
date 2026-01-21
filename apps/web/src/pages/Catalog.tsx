import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LanguageIcon, Logo, SearchIcon } from '@movie-garden/ui'
import i18n from '../lib/i18n'
import { useState } from 'react'

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

  const [isLogOutModal, setIsLogOutModal] = useState(false)
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
    setIsLogOutModal(true)
  }

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

      <div className="min-h-screen w-full bg-custom-gradient overflow-x-hidden py-3 px-4">
        <header className="mb-10 sticky top-3 z-50">
          <div className="h-11 w-full max-w-[1600px] bg-white/60 backdrop-blur-md rounded-full flex items-center justify-between px-3 py-2 mx-auto mb-2 shadow-sm relative z-50">
            <Logo className="h-8 w-8" />

            <label className="h-full w-[400px] flex items-center cursor-text border border-zinc-700 rounded-xl px-2 hover:scale-x-105 transition-transform mx-12">
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
                className="px-6 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold text-nowrap transition-colors"
              >
                {t('catalogPage.logOut')}
              </button>
            </div>
          </div>
        </header>

        <main className="bg-white w-full min-h-screen overflow-hidden rounded-2xl bg-white/60">
          <div />
        </main>
      </div>
    </>
  )
}
