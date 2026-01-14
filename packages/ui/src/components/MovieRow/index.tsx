import { useRef } from 'react'
import { MovieCard } from '../MovieCard'

interface Movie {
  id: number
  title: string
  posterPath: string
  rating: number
  category: string
}

interface MovieRowProps {
  title: string
  movies: Movie[]
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const handleScrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const handleScrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 mb-12 relative group">
      <h2 className="text-2xl font-bold text-[#113A2D] mb-6 border-l-4 border-[#113A2D] pl-3">
        {title}
      </h2>

      <button
        type="button"
        onClick={handleScrollLeft}
        className="absolute left-0 top-[60%] -translate-y-1/2 z-10 bg-black/50 hover:bg-[#113A2D] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 cursor-pointer backdrop-blur-sm"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div
        ref={listRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide p-3 snap-x scroll-smooth"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[220px] max-w-[220px] w-full h-auto snap-center"
          >
            <MovieCard
              title={movie.title}
              posterPath={movie.posterPath}
              rating={movie.rating}
              category={movie.category}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleScrollRight}
        className="absolute right-0 top-[60%] -translate-y-1/2 z-10 bg-black/50 hover:bg-[#113A2D] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </section>
  )
}
