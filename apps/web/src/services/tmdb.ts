const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const fetchTMDB = async (endpoint: string, language: string = 'pt-BR') => {
  const separator = endpoint.includes('?') ? '&' : '?'

  const req = await fetch(
    `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=${language}`,
  )

  if (!req.ok) throw new Error('Erro na requisição TMDB')

  return await req.json()
}

export const tmdb = {
  getTrendingMovies: async (lang?: string) => {
    return await fetchTMDB('/trending/movie/week', lang)
  },

  getTrendingSeries: async (lang?: string) => {
    return await fetchTMDB('/trending/tv/week', lang)
  },

  getTopRated: async (lang?: string) => {
    return await fetchTMDB('/movie/top_rated', lang)
  },

  searchMovie: async (query: string) => {
    const result = await fetchTMDB(
      `/search/movie?query=${encodeURIComponent(query)}`,
    )

    return result.results && result.results.length > 0
      ? result.results[0]
      : null
  },
}
