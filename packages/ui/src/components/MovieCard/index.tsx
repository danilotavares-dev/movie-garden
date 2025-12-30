interface MovieCardProps {
  title: string
  posterPath: string
  rating?: number
  category?: string
  date?: string
}

export function MovieCard({
  title,
  posterPath,
  rating,
  category,
  date,
}: MovieCardProps) {
  return (
    <div className="group relative w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform hover:scale-105 hover:shadow-xl cursor-pointer">
      <div className="aspect-[2/3] w-full">
        <img
          src={posterPath}
          alt={`Capa do filme ${title}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

      <div className="absolute bottom-0 left-0 p-4 w-full">
        {category && (
          <span className="mb-2 inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-400 backdrop-blur-sm">
            {category}
          </span>
        )}

        <h3 className="text-lg font-bold text-white leading-tight drop-shadow-sm">
          {title}
        </h3>

        <span className="text-zinc-500 text-sm font-bold">{date}</span>
        {rating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium text-gray-200">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
