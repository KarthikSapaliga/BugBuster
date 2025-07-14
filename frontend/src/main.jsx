import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "./styles/tailwind.css"
import "./styles/index.css"
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
