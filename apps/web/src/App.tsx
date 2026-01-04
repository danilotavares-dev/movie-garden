import { BrowserRouter, Routes, Route} from 'react-router-dom'

import { Catalog } from './pages/Catalog'
import { Login } from './pages/Login'
import { Cadastro } from './pages/Cadastro'
import { LandingPage } from './pages/LandingPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>  
        <Route path='/login' element={<Login/>}/>  
        <Route path='/cadastro' element={<Cadastro/>}/>  
        <Route path='/catalogo' element={<Catalog/>}/>  

      </Routes>
    </BrowserRouter>
  )
}
