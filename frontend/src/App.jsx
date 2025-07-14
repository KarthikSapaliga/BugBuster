import React from 'react'

import { Routes, Route } from 'react-router-dom'

import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar'
import { SidebarProvider } from './components/ui/sidebar'

function App() {
    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden">
            <TopBar />
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