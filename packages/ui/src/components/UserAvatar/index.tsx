interface UserAvatarProps {
  src?: string | null
  alt?: string
  className?: string
}

export function UserAvatar({
  src,
  alt = 'Avatar do Usuário',
  className = '',
}: UserAvatarProps) {
  const classes = `rounded-full object-cover  flex-shrink-0 ${className}`

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${classes} border-2 border-[#113A2D]`}
      />
    )
  }

  return (
    <div
      className={`bg-[#040404] bg-opacity-60 flex items-center justify-center text-zinc-400 ${classes}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}
