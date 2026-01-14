const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const fetchTMDB = async (endpoint: string) => {
  const req = await fetch(
    `${BASE_URL}${endpoint}&api_key=${API_KEY}&language=pt-BR`,
  )
  return await req.json()
}

export const tmdb = {
  getTrendingMovies: async () => {
    return await fetchTMDB('/trending/movie/week?')
  },

  getTrendingSeries: async () => {
    return await fetchTMDB('/trending/tv/week?')
  },
}
