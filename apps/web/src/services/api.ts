import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const myListService = {
  add: async (media: {
    mediaId: number
    title: string
    posterPath: string
    mediaType: 'movie' | 'tv'
  }) => {
    return await api.post('/watchlist', media)
  },

  remove: async (mediaId: number) => {
    return api.delete(`/watchlist/${mediaId}`)
  },

  checkStatus: async (mediaId: number) => {
    const response = await api.get(`/watchlist/${mediaId}/status`)
    return response.data
  },
}
