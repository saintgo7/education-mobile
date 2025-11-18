import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/tauri'
import Dashboard from './pages/Dashboard'
import CourseDetail from './pages/CourseDetail'
import Analytics from './pages/Analytics'
import Collaboration from './pages/Collaboration'
import Navigation from './components/Navigation'
import './App.css'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'student' | 'instructor' | 'admin'
}

interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user data from Tauri backend
        const userData = await invoke<User>('get_user_data')
        setState(prev => ({
          ...prev,
          user: userData,
          isLoading: false
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load user data',
          isLoading: false
        }))
      }
    }

    initializeApp()
  }, [])

  if (state.isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Education Platform...</p>
      </div>
    )
  }

  if (!state.user) {
    return (
      <div className="error-container">
        <h2>Failed to Load</h2>
        <p>{state.error || 'Unable to authenticate user'}</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <BrowserRouter>
        <div className="app-layout">
          <Navigation user={state.user} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/collaborate" element={<Collaboration />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
