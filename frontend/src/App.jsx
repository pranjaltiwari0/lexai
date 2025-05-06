import { useState } from 'react'
import Chat from './components/Chat'
import Navbar from './components/Navbar'
import FlashScreen from './components/FlashScreen'

function App() {
  const [showFlashScreen, setShowFlashScreen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#ffc9c9]">
      <FlashScreen setShowFlashScreen={setShowFlashScreen} />
      {!showFlashScreen && (
        <>
          <Navbar />
          <main className="pt-16">
            <Chat />
          </main>
        </>
      )}
    </div>
  )
}

export default App
