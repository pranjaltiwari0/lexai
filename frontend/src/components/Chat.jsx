import { useState, useEffect, useRef } from 'react'
import useChatStore from '../store/chatStore'
import { FiSend } from 'react-icons/fi'
import { centerLogo } from '../assets'
import { auth } from '../firebase/config'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const Chat = () => {
  const [input, setInput] = useState('')
  const { messages, addMessage } = useChatStore()
  const [userName, setUserName] = useState('Guest')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const firstName = user.displayName?.split(' ')[0] || 'Guest'
        setUserName(firstName)
      } else {
        setUserName('Guest')
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message immediately
    addMessage({ role: 'user', content: input })
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      })

      // Log the response status and details for debugging
      console.log('Response status:', response.status)
      
      const contentType = response.headers.get('content-type')
      if (!response.ok) {
        let errorMessage = 'An error occurred'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || 'Unknown error'
        } catch (e) {
          errorMessage = await response.text() || 'Server error'
        }
        throw new Error(errorMessage)
      }

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (!data.response) {
        throw new Error('No response data received')
      }

      // Add AI response
      addMessage({
        role: 'assistant',
        content: data.response
      })
    } catch (error) {
      console.error('Detailed error:', error)
      addMessage({
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again.`
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center px-4 pt-8 h-screen">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="text-center">
          <img 
            src={centerLogo} 
            alt="Lex AI Logo" 
            className="w-24 h-24 mx-auto mb-6" 
          />
          <h1 className="text-[#737373] text-2xl mb-2">
            Hello {userName}!
          </h1>
          <h2 className="text-black text-3xl font-bold mb-2">
            You've got a legal query?
          </h2>
          <p className="text-[#A6A6A6] text-xl">
            Consider it handled.
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="w-full max-w-3xl space-y-4 mt-8 mb-24 overflow-y-auto flex-1 scrollbar-hide">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-red-500 text-white'
                  : 'bg-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-lg bg-white">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="fixed bottom-8 w-full max-w-2xl px-4">
        <div className="flex items-center p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Let's make the law work for you. Type your query!"
            className="flex-1 px-4 py-2 bg-transparent outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  )
}

// Add this CSS either in your global CSS file or as a style tag in your component
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;             /* Chrome, Safari and Opera */
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Chat 