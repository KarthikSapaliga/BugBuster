import React from 'react'
import SideBar from './components/SideBar'
import { SidebarProvider } from './components/ui/sidebar'

import TopBar from './components/TopBar'

function App() {
  return (
    <div>
      <TopBar />
      <SideBar/>
      <main className='text-5xl font-bold text-purple-600 flex items-center justify-center min-h-screen'>
        BugBuster
      </main>
    </div>
  )
}

export default App
