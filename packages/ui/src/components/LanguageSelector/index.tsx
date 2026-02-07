import { LanguageIcon } from '../LanguageIcon'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function LanguageSelector() {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()

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

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="border border-zinc-400/90 w-10 h-10 bg-green-900 hover:bg-green-800/80 rounded-full flex items-center justify-center transition-colors text-white"
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
  )
}
