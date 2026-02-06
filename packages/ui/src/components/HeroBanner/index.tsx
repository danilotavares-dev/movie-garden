import { useTranslation } from 'react-i18next'

interface HeroBannerProps {
  title: string
  description: string
  backDropUrl: string
  onWatchClick?: () => void
}

export function HeroBanner({
  title,
  description,
  backDropUrl,
  onWatchClick,
}: HeroBannerProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <img
        src={backDropUrl}
        alt={title}
        className="h-full w-full object-top object-cover transition-transform duration-200 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#040404] via-[#040404]/60 to-transparent" />

      <div className="absolute bottom-32 left-0 p-8 w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          {title}
        </h1>

        <p className="text-zinc-200 text-lg line-clamp-3 drop-shadow-md">
          {description}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            className="bg-[#113A2D] hover:bg-[#1a5542] text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[#113A2D]/50"
          >
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {t('catalogPage.myList')}
          </button>

          <button
            type="button"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold transition-colors cursor-pointer border border-white/10"
            onClick={onWatchClick}
          >
            {t('catalogPage.seeDetails')}
          </button>
        </div>
      </div>
    </div>
  )
}
