const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const fetchTMDB = async (endpoint: string, language: string = 'pt-BR') => {
  const req = await fetch(
    `${BASE_URL}${endpoint}&api_key=${API_KEY}&language=${language}`,
  )
  return await req.json()
}

export const tmdb = {
  getTrendingMovies: async (lang?: string) => {
    return await fetchTMDB('/trending/movie/week?', lang)
  },

  getTrendingSeries: async (lang?: string) => {
    return await fetchTMDB('/trending/tv/week?', lang)
  },

  getTopRated: async (lang?: string) => {
    return await fetchTMDB('/movie/top_rated', lang)
  },
}
