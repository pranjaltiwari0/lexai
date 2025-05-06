import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faUser, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'
import useChatStore from '../store/chatStore'
import { auth } from '../firebase/config'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useState, useEffect } from 'react'

const SidePanel = ({ isOpen, onClose }) => {
  const { resetChat, chatHistory, deleteChat } = useChatStore(state => ({
    resetChat: state.resetChat,
    chatHistory: state.chatHistory,
    deleteChat: state.deleteChat
  }))
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleNewChat = () => {
    resetChat()
    onClose()
  }

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation() // Prevent triggering the chat selection
    deleteChat(chatId)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed md:left-1/4 top-[88px] p-2 hover:bg-white/10 rounded-full z-50"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6 text-gray-700" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-[72px] w-full md:w-1/4 h-[calc(100vh-72px)] bg-white shadow-lg z-40"
      >
        {/* New Suit Button */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>New Suit</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Previous Chats</h3>
          <div className="space-y-2">
            {chatHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No previous chats</p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    className="w-full text-left"
                    onClick={() => {
                      // Handle selecting this chat
                      onClose()
                    }}
                  >
                    <p className="text-sm font-medium truncate">Legal Query #{chat.id}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.lastMessage || 'No messages yet...'}
                    </p>
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-full transition-opacity"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Button */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          <button 
            onClick={user ? handleLogout : handleLogin}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user && user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Profile'} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-gray-600" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium">{user ? user.displayName : 'Login'}</p>
              <p className="text-sm text-gray-500">{user ? 'Sign Out' : 'Sign In with Google'}</p>
            </div>
          </button>
        </div>
      </motion.div>
    </>
  )
}

export default SidePanel 