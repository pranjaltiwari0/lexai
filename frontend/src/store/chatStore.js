import { create } from 'zustand'

const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  darkMode: false,
  chatHistory: [],
  currentChat: null,
  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message] 
    })),
  setLoading: (loading) => 
    set({ isLoading: loading }),
  toggleDarkMode: () => 
    set((state) => ({ darkMode: !state.darkMode })),
  resetChat: () => {
    const newChat = {
      id: Date.now(), // Simple way to generate unique IDs
      lastMessage: '',
      messages: []
    }
    set((state) => ({
      chatHistory: [newChat, ...state.chatHistory],
      currentChat: newChat
    }))
  },
  deleteChat: (chatId) => {
    set((state) => ({
      chatHistory: state.chatHistory.filter(chat => chat.id !== chatId)
    }))
  },
  updateLastMessage: (chatId, message) => {
    set((state) => ({
      chatHistory: state.chatHistory.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: message }
          : chat
      )
    }))
  }
}))

export default useChatStore 