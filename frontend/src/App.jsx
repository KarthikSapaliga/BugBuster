import React from 'react'

import { Routes, Route } from 'react-router-dom'

import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar'
import { SidebarProvider } from './components/ui/sidebar'

function App() {
    return (
        <div className='max-w-screen max-h-screen w-screen h-screen overflow-auto relative'>
            <TopBar />
            <SidebarProvider>
                <SideBar />
            </SidebarProvider>
            <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route />
                <Route />
            </Routes>
        </div>
    )
}

export default App