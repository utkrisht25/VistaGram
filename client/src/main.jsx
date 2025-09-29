import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getJSON } from './lib/api'
import { setToken } from './lib/auth'
import store from './store'
import { setUser, setLoading } from './store/userSlice'
import './index.css'
import App from './App.jsx'

// Initialize theme based on system preference or saved preference
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Initialize auth state
const initAuth = async () => {
  const token = localStorage.getItem('vistagram_token')
  if (!token) return

  try {
    store.dispatch(setLoading(true))
    setToken(token)
    const user = await getJSON('/api/auth/me')
    store.dispatch(setUser(user))
  } catch (error) {
    console.error('Auth error:', error)
    localStorage.removeItem('vistagram_token')
  } finally {
    store.dispatch(setLoading(false))
  }
}

// Initialize theme and auth before rendering
initTheme();
initAuth().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
