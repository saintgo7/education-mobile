'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const userData = await apiClient.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(userData)

      const courses = await apiClient.get('/api/courses/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEnrolledCourses(Array.isArray(courses) ? courses : [])
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Courses Enrolled', value: enrolledCourses.length },
            { label: 'Learning Hours', value: Math.floor(Math.random() * 100) + 10 },
            { label: 'Certificates', value: 3 },
            { label: 'Achievement Points', value: Math.floor(Math.random() * 500) + 100 }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
              <a
                href="/courses"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse Courses
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course: any) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="mb-4">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{course.progress || 0}% complete</p>
                  </div>
                  <a
                    href={`/courses/${course.id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Continue Learning →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
