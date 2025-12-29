import React from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

const container = document.getElementById('root')

if (!container) {
  throw new Error(
    "Erro Crítico: Não foi possível encontrar o elemento 'root' no HTML.",
  )
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
