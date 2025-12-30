import { CatalogHeader, MovieCard } from '@movie-garden/ui'

export function Catalog() {
  return (
    <div className="min-h-screen bg-custom-gradient text-white p-4">
      <CatalogHeader />

      <main className="bg-[#D9D9D9] rounded-xl bg-opacity-60 w-full">
        <h1 className="text-black mb-5 font-sans text-[25px]">Minha Lista</h1>

        <div className="grid grid-cols-4 gap-5 max-w-[1000px]">
          <MovieCard
            title="Avatar: The Way of Water"
            posterPath="https://www.themoviedb.org/t/p/w600_and_h900_face/5Udy89ttZtJ5cMC9y3o22zzyevg.jpg"
            rating={8.6}
            category="Action, Adventure, and Science Fiction"
          />

          <MovieCard
            title="Demon Slayer: Kimetsu no Yaiba Infinity Castle"
            date="09/11/2025"
            posterPath="https://media.themoviedb.org/t/p/w300_and_h450_face/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg"
            rating={9.2}
            category="Animation, Action, and Fantasy"
          />

          <MovieCard
            title="Five Nights at Freddy's 2"
            posterPath="https://media.themoviedb.org/t/p/w300_and_h450_face/udAxQEORq2I5wxI97N2TEqdhzBE.jpg"
            rating={9.2}
            category="Horror and Thriller"
          />

          <MovieCard
            title="Zootopia 2"
            posterPath="https://media.themoviedb.org/t/p/w300_and_h450_face/oJ7g2CifqpStmoYQyaLQgEU32qO.jpg"
            rating={9.2}
            category="Animation, Comedy, Adventure, Family, and Mystery"
          />

          <MovieCard
            title="Stranger Things"
            posterPath="https://media.themoviedb.org/t/p/w300_and_h450_face/cVxVGwHce6xnW8UaVUggaPXbmoE.jpg"
            rating={9.2}
            category="Sci-Fi & Fantasy, Mystery, and Action & Adventure"
          />
        </div>
      </main>
    </div>
  )
}
