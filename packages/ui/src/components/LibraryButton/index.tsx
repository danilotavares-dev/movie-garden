import { ComponentProps, useState } from 'react'

interface LibraryButtonProps extends ComponentProps<'button'> {
  classNameButton?: string
  tooltipText?: string
}

export function LibraryButton({
  tooltipText,
  classNameButton = 'bg-none w-8 h-8',
  ...props
}: LibraryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group flex flex-col items-center">
      <button
        type="button"
        onClick={(e) => {
          setIsOpen(!isOpen)
          if (props.onClick) props.onClick(e)
        }}
        className={`flex justify-center items-center p-2 rounded-full focus:outline-none group ${classNameButton}`}
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
        <div className="absolute w-12 h-6 top-[55px] bg-black left-0 z-50 "></div>
      )}
    </div>
  )
}
