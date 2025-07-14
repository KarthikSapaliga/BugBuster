import { createRoot } from 'react-dom/client'

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'

import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar'
import { SidebarProvider } from './components/ui/sidebar'

import "./styles/tailwind.css"
import "./styles/index.css"


createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <div className='max-w-screen max-h-screen w-screen h-screen overflow-auto relative'>
      <TopBar />

      <BrowserRouter>
        <SidebarProvider>
          <SideBar />
        </SidebarProvider>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  </ThemeProvider>
)
