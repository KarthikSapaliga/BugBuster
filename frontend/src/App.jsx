import React from 'react'

import { Routes, Route } from 'react-router-dom'

import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar'
import { SidebarProvider } from './components/ui/sidebar'

import { useState } from 'react'

function App() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        if (sidebarOpen) {
            setSidebarOpen(false)
        } else {
            setSidebarOpen(true)
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden">
            <TopBar toggleSidebar={toggleSidebar} />
            <div className="flex flex-1">
                <SidebarProvider>
                    <SideBar />
                </SidebarProvider>

                <main className="flex-1 overflow-auto bg-background">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/issues" element={<div>Issues Page</div>} />
                        <Route path="/project-settings" element={<div>Settings</div>} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App