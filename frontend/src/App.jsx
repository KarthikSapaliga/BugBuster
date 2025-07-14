import React from 'react'
import SideBar from './components/SideBar'
import { SidebarProvider } from './components/ui/sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className='max-w-screen max-h-screen w-screen h-screen overflow-auto relative'>
      <TopBar />
      <SidebarProvider>
        <SideBar />
      </SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route />
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
