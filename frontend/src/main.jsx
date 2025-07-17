import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'

import "./styles/tailwind.css"
import "./styles/index.css"

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </ThemeProvider>
)
