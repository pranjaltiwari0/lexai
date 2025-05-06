import { useState } from 'react'
import { horizontalLogo } from '../assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import SidePanel from './SidePanel'

const Navbar = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center max-w-auto mx-auto">
            <img 
              src={horizontalLogo} 
              alt="Lex AI" 
              className="h-10" 
            />
            <button 
              onClick={() => setIsSidePanelOpen(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <FontAwesomeIcon 
                icon={faUser} 
                className="w-6 h-6 text-gray-700" 
              />
            </button>
          </div>
        </div>
      </nav>

      <SidePanel 
        isOpen={isSidePanelOpen} 
        onClose={() => setIsSidePanelOpen(false)} 
      />
    </>
  )
}

export default Navbar