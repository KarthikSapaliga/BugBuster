import React from 'react'

import TopBar from './components/TopBar'

function App() {
  return (
    <div>
      <TopBar />
      <h1 className='text-5xl font-bold text-purple-600 flex items-center justify-center min-h-screen -translate-y-10'>
        BugBuster
      </h1>
    </div>
  )
}

export default App