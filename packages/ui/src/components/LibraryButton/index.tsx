import { ComponentProps, useEffect, useRef, useState } from 'react'

export interface LibraryItemsData {
  id: number
  posterPath: string | null
  title: string
  mediaType: 'movie' | 'tv'
}

interface LibraryButtonProps extends ComponentProps<'button'> {
  classNameButton?: string
  tooltipText?: string
  items?: LibraryItemsData[]
  isLoading: boolean
  onViewAllClick?: () => void
  onItemClick?: (item: LibraryItemsData) => void
}

export function LibraryButton({
  tooltipText,
  classNameButton = 'bg-none w-8 h-8',
  items = [],
  isLoading = false,
  onViewAllClick,
  onItemClick,
  ...props
}: LibraryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative group flex flex-col items-center" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          setIsOpen(!isOpen)
          if (props.onClick) props.onClick(e)
        }}
        className={`flex justify-center items-center p-2 rounded-full focus:outline-none transition-colors group ${
          isOpen
            ? 'text-green-400 bg-white/10'
            : 'text-zinc-300 hover:text-white'
        } ${classNameButton}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[17px] transition-colors duration-300 fill-none stroke-current text-zinc-300 group-hover:text-zinc-400"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="20" y1="15" x2="20" y2="85" />
          <line x1="45" y1="15" x2="45" y2="85" />
          <path
            className="transition-all duration-300 ease-in-out"
            d={
              isOpen
                ? 'M 70 15 L 95 30 L 95 85 L 70 85 Z'
                : 'M 70 15 L 95 30 L 85 85 L 70 85 Z'
            }
            fill={isOpen ? 'currentColor' : 'none'}
          />
        </svg>
      </button>

      {tooltipText && !isOpen && (
        <span className="absolute top-full mt-2 group-hover:flex flex-col items-center opacity-0 invisible transition-all duration-300 group-hover:delay-1000 group-hover:opacity-100 group-hover:visible group-hover:traslate-y-0 z-50 whitespace-nowrap">
          <span className="bg-black/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg border border-white/10">
            {tooltipText}
          </span>
        </span>
      )}

      {isOpen && (
        <div className="absolute p-4 top-[60px] right-[-80px] md:right-0 w-[320px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 animate-fade-in origin-top-right">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold text-sm">Sua Lista</h3>
            {onViewAllClick && (
              <button
                type="button"
                onClick={onViewAllClick}
                className="text-xs text-green-400 hover:text-green-300 font-medium"
              >
                Ver Tudo →
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="h-24 flex items-center justify-center text-zinc-500 text-xs">
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="h-24 flex flex-col items-center justify-center text-zinc-500 text-xs gap-2">
              <span>Sua lista está vazia</span>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="flex-shrink-0 w-[80px] cursor-pointer group/card p-0 border-0 bg-transparent text-left"
                  onClick={() => onItemClick?.(item)}
                >
                  <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 relative border border-white/5 group-hover/card:border-green-500/50 transition-colors">
                    {item.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${item.posterPath}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 truncate group-hover/card:text-white transition-colors">
                    {item.title}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
