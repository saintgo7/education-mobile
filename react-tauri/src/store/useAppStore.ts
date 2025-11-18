import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  progress: number
  lessons: number
  completedLessons: number
  thumbnail: string
  rating: number
  students: number
}

interface Lesson {
  id: string
  title: string
  duration: number
  content: string
  videoUrl: string
  resources: string[]
  completed: boolean
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  totalPoints: number
  streakDays: number
  role: 'student' | 'instructor' | 'admin'
}

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  roomId: string
}

interface AppState {
  // User state
  user: User | null
  setUser: (user: User) => void

  // Course state
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  updateCourse: (id: string, updates: Partial<Course>) => void

  // Enrollment state
  enrolledCourses: string[]
  enrollCourse: (courseId: string) => void
  unenrollCourse: (courseId: string) => void

  // Lesson state
  currentLesson: Lesson | null
  setCurrentLesson: (lesson: Lesson) => void
  completeLesson: (lessonId: string) => void

  // Progress tracking
  updateProgress: (courseId: string, progress: number) => void

  // Messaging state
  messages: Message[]
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void

  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void
  darkMode: boolean
  toggleDarkMode: () => void

  // Data loading
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // User state
        user: null,
        setUser: (user) => set({ user }),

        // Course state
        courses: [],
        setCourses: (courses) => set({ courses }),
        addCourse: (course) =>
          set((state) => ({
            courses: [...state.courses, course]
          })),
        updateCourse: (id, updates) =>
          set((state) => ({
            courses: state.courses.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            )
          })),

        // Enrollment state
        enrolledCourses: [],
        enrollCourse: (courseId) =>
          set((state) => ({
            enrolledCourses: [...state.enrolledCourses, courseId]
          })),
        unenrollCourse: (courseId) =>
          set((state) => ({
            enrolledCourses: state.enrolledCourses.filter(
              (id) => id !== courseId
            )
          })),

        // Lesson state
        currentLesson: null,
        setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
        completeLesson: (lessonId) => {
          const state = get()
          if (state.currentLesson && state.currentLesson.id === lessonId) {
            set({
              currentLesson: { ...state.currentLesson, completed: true }
            })
          }
        },

        // Progress tracking
        updateProgress: (courseId, progress) => {
          set((state) => ({
            courses: state.courses.map((c) =>
              c.id === courseId
                ? {
                    ...c,
                    progress,
                    completedLessons: Math.floor(
                      (progress / 100) * c.lessons
                    )
                  }
                : c
            )
          }))
        },

        // Messaging state
        messages: [],
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message]
          })),
        setMessages: (messages) => set({ messages }),

        // UI state
        sidebarOpen: true,
        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen
          })),
        darkMode: false,
        toggleDarkMode: () =>
          set((state) => ({
            darkMode: !state.darkMode
          })),

        // Data loading
        isLoading: false,
        setIsLoading: (loading) => set({ isLoading: loading }),
        error: null,
        setError: (error) => set({ error })
      }),
      {
        name: 'education-app-store'
      }
    )
  )
)

// Selectors
export const selectUserName = (state: AppState) => state.user?.name
export const selectEnrolledCourses = (state: AppState) =>
  state.courses.filter((c) => state.enrolledCourses.includes(c.id))
export const selectCompletionRate = (state: AppState) => {
  if (state.courses.length === 0) return 0
  const total = state.courses.reduce((sum, c) => sum + c.progress, 0)
  return Math.round(total / state.courses.length)
}
