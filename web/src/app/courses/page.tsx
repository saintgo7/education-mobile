'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  level: string
  price: number
  rating: number
  image?: string
  students: number
  duration: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get('/api/courses')
      setCourses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || course.level === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Courses</h1>
        <p className="text-gray-600 mb-8">Choose from thousands of courses taught by industry experts</p>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-wrap">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-4">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No courses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{course.title}</h3>
                    <span className="text-yellow-500">⭐ {course.rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{course.instructor}</span>
                    <span className="text-sm font-semibold text-blue-600">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-gray-500 text-xs">{course.students} students</p>
                      <p className="text-gray-500 text-xs">{course.duration}h duration</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${course.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
