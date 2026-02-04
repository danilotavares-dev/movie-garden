import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Catalog } from './pages/Catalog'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { LandingPage } from './pages/LandingPage'
import { Movies } from './pages/Movie'
import { Series } from './pages/Series'
import { PrivateRoute } from './components/PrivateRoute'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/movie/:id" element={<Movies />} />
        <Route path="/serie/:id" element={<Series />} />

        <Route element={<PrivateRoute />}>
          <Route path="catalogo" element={<Catalog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
