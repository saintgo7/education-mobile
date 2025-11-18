import { createStore } from 'vuex'
import axios from 'axios'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  progress: number
  lessons: number
  completedLessons: number
  thumbnail: string
}

interface UserState {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    level: string
    totalPoints: number
    bio: string
  } | null
  courses: Course[]
  enrolledCourses: string[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  courses: [],
  enrolledCourses: [],
  loading: false,
  error: null
}

export default createStore<UserState>({
  state() {
    return initialState
  },

  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setCourses(state, courses) {
      state.courses = courses
    },
    setEnrolledCourses(state, enrolledCourses) {
      state.enrolledCourses = enrolledCourses
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
    enrollCourse(state, courseId: string) {
      if (!state.enrolledCourses.includes(courseId)) {
        state.enrolledCourses.push(courseId)
      }
    },
    updateUserProgress(state, { courseId, progress }) {
      const course = state.courses.find(c => c.id === courseId)
      if (course) {
        course.progress = progress
        course.completedLessons = Math.floor(
          (progress / 100) * course.lessons
        )
      }
    }
  },

  actions: {
    async loadUserData({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('/api/user/profile')
        commit('setUser', response.data)
        commit('setError', null)
      } catch (error: any) {
        commit('setError', error.message)
      } finally {
        commit('setLoading', false)
      }
    },

    async loadCourses({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('/api/courses')
        const courses: Course[] = response.data.map((course: any) => ({
          ...course,
          completedLessons: 0,
          progress: 0
        }))
        commit('setCourses', courses)
        commit('setError', null)
      } catch (error: any) {
        commit('setError', error.message)
      } finally {
        commit('setLoading', false)
      }
    },

    async enrollCourse({ commit, state }, courseId: string) {
      try {
        await axios.post('/api/enrollment', { courseId })
        commit('enrollCourse', courseId)
      } catch (error: any) {
        commit('setError', error.message)
        throw error
      }
    },

    async updateProgress({ commit }, { courseId, progress }) {
      try {
        await axios.put(`/api/progress/${courseId}`, { progress })
        commit('updateUserProgress', { courseId, progress })
      } catch (error: any) {
        commit('setError', error.message)
      }
    },

    async logout({ commit }) {
      commit('setUser', null)
      commit('setEnrolledCourses', [])
      commit('setCourses', [])
      await axios.post('/api/auth/logout')
    }
  },

  getters: {
    isAuthenticated(state) {
      return state.user !== null
    },
    userDisplayName(state) {
      return state.user?.name || 'Guest'
    },
    enrolledCoursesList(state) {
      return state.courses.filter(c => state.enrolledCourses.includes(c.id))
    },
    completionRate(state) {
      if (state.courses.length === 0) return 0
      const total = state.courses.reduce((sum, c) => sum + c.progress, 0)
      return Math.round(total / state.courses.length)
    }
  }
})
