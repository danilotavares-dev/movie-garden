import { CatalogHeader, HeroBanner, MovieCard } from '@movie-garden/ui'

export function Catalog() {
  return (
    <div className="min-h-screen bg-custom-gradient text-white p-4">
      <header>
        <CatalogHeader />
      </header>

      <main className="bg-[#D9D9D9] p-2 rounded-xl bg-opacity-60 w-full">
        <HeroBanner
          title="Wicked: For Good"
          description="As an angry mob rises against the Wicked Witch, Glinda and Elphaba will need to come together one final time. With their singular friendship now the fulcrum of their futures, they will need to truly see each other, with honesty and empathy, if they are to change themselves, and all of Oz, for good."
          backDropUrl="https://media.themoviedb.org/t/p/original/l8pwO23MCvqYumzozpxynCNfck1.jpg"
        />

        <h1 className="text-black text-[20px] pb-2 font-bold">
          Recomendados para você
        </h1>

        <div className="grid grid-cols-7 gap-5 w-full max-w-[2250px]">
          <MovieCard
            title="Avatar: Fire and Ash"
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
        </div>
      </main>
    </div>
  )
}
