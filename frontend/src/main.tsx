// Arquivo de entrada principal da aplicação React
// Responsável por renderizar o componente App no DOM

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Renderiza a aplicação no elemento com id 'root'
createRoot(document.getElementById('root')!).render(
  // StrictMode desativado temporariamente para evitar renderizações duplas em desenvolvimento
  // <StrictMode>
    <App />
  // {/* </StrictMode>, */}
)
