'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const user = await apiClient.getProfile()
        setUserName(user.name)
        setIsAuthenticated(true)
      }
    } catch {
      setIsAuthenticated(false)
    }
  }

  const handleLogout = async () => {
    await apiClient.logout()
    setIsAuthenticated(false)
    setUserName('')
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">📚</span>
            <span className="font-bold text-gray-900">EduMobile</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition">
              Courses
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                Dashboard
              </Link>
            )}
            <Link href="/#features" className="text-gray-700 hover:text-blue-600 transition">
              Features
            </Link>
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 text-sm">Hi, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/courses" className="block py-2 text-gray-700 hover:text-blue-600">
              Courses
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
