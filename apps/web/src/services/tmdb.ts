const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const fetchTMDB = async (
  endpoint: string,
  language: string = 'pt-BR',
  page?: number,
) => {
  const separator = endpoint.includes('?') ? '&' : '?'
  const pageParam = page ? `&page=${page}` : ''

  const req = await fetch(
    `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=${language}${pageParam}`,
  )

  if (!req.ok) throw new Error('Erro na requisição TMDB')

  return await req.json()
}

export const tmdb = {
  getTrendingMovies: async (lang?: string, page?: number) => {
    return await fetchTMDB('/trending/movie/week', lang, page)
  },

  getTrendingSeries: async (lang?: string, page?: number) => {
    return await fetchTMDB('/trending/tv/week', lang, page)
  },

  getTopRated: async (lang?: string, page?: number) => {
    return await fetchTMDB('/movie/top_rated', lang, page)
  },

  getTopRatedSeries: async (lang?: string, page?: number) => {
    return await fetchTMDB('/tv/top_rated', lang, page)
  },

  getPopularMovies: async (lang?: string, page?: number) => {
    return await fetchTMDB('/movie/popular', lang, page)
  },

  getPopularSeries: async (lang?: string, page?: number) => {
    return await fetchTMDB('/tv/popular', lang, page)
  },

  getNowPlaying: async (lang?: string, page?: number) => {
    return await fetchTMDB('/movie/now_playing', lang, page)
  },

  getUpcoming: async (lang?: string, page?: number) => {
    return await fetchTMDB('/movie/upcoming', lang, page)
  },

  getAiringToday: async (lang?: string, page?: number) => {
    return await fetchTMDB('/tv/airing_today', lang, page)
  },

  getOnTheAir: async (lang?: string, page?: number) => {
    return await fetchTMDB('/tv/on_the_air', lang, page)
  },

  searchMovie: async (query: string) => {
    const result = await fetchTMDB(
      `/search/movie?query=${encodeURIComponent(query)}`,
    )

    return result.results && result.results.length > 0
      ? result.results[0]
      : null
  },

  searchTv: async (query: string, lang: string = 'pt-BR') => {
    const result = await fetchTMDB(
      `/search/tv?query=${encodeURIComponent(query)}`,
      lang,
    )

    return result.results && result.results.length > 0
      ? result.results[0]
      : null
  },

  searchMovies: async (
    query: string,
    lang: string = 'pt-BR',
    page: number = 1,
  ) => {
    return await fetchTMDB(
      `/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
      lang,
      page,
    )
  },

  searchSeries: async (
    query: string,
    lang: string = 'pt-BR',
    page: number = 1,
  ) => {
    return await fetchTMDB(
      `/search/tv?query=${encodeURIComponent(query)}&include_adult=false`,
      lang,
      page,
    )
  },

  getMovieDetails: async (movieId: string, lang: string = 'pt-BR') => {
    return await fetchTMDB(`/movie/${movieId}`, lang)
  },

  getMovieCredits: async (movieId: string, lang: string = 'pt-BR') => {
    return await fetchTMDB(`/movie/${movieId}/credits`, lang)
  },

  getMovieVideos: async (movieId: string, lang: string = 'pt-BR') => {
    return await fetchTMDB(`/movie/${movieId}/videos`, lang)
  },

  getTvDetails: async (tvId: string, lang: string = 'pt-BR') => {
    return await fetchTMDB(`/tv/${tvId}`, lang)
  },

  getTvCredits: async (tvId: string, lang: string = 'pt-BR') => {
    return await fetchTMDB(`/tv/${tvId}/credits`, lang)
  },
}
