import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Catalog } from './pages/Catalog'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { LandingPage } from './pages/LandingPage'
import { Movies } from './pages/MoviePage'
import { Series } from './pages/SeriesPage'
import { Releases } from './pages/ReleasesPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/catalogo" element={<Series />} />
        <Route path="/catalogo" element={<Releases />} />
      </Routes>
    </BrowserRouter>
  )
}
