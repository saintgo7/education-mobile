import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  User,
  Course,
  Enrollment,
  CourseProgress,
  Message,
  ApiResponse,
  PaginatedResponse,
  AuthCredentials,
  AuthResponse,
  Notification
} from '../types'

class EducationApiClient {
  private apiClient: AxiosInstance
  private baseURL: string
  private authToken: string | null = null

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL
    this.apiClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth methods
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      { email, password, name }
    )
    if (response.data.data) {
      this.authToken = response.data.data.accessToken
    }
    return response.data.data!
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    )
    if (response.data.data) {
      this.authToken = response.data.data.accessToken
    }
    return response.data.data!
  }

  async logout(): Promise<void> {
    this.authToken = null
    await this.apiClient.post('/auth/logout')
  }

  setAuthToken(token: string): void {
    this.authToken = token
  }

  // User methods
  async getUserProfile(): Promise<User> {
    const response = await this.apiClient.get<ApiResponse<User>>(
      '/users/profile'
    )
    return response.data.data!
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const response = await this.apiClient.put<ApiResponse<User>>(
      `/users/${userId}`,
      updates
    )
    return response.data.data!
  }

  // Course methods
  async getCourses(
    page = 1,
    pageSize = 10,
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<Course>> {
    const response = await this.apiClient.get<ApiResponse<PaginatedResponse<Course>>>(
      '/courses',
      { params: { page, pageSize, ...filters } }
    )
    return response.data.data!
  }

  async getCourse(courseId: string): Promise<Course> {
    const response = await this.apiClient.get<ApiResponse<Course>>(
      `/courses/${courseId}`
    )
    return response.data.data!
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const response = await this.apiClient.post<ApiResponse<Course>>(
      '/courses',
      courseData
    )
    return response.data.data!
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
    const response = await this.apiClient.put<ApiResponse<Course>>(
      `/courses/${courseId}`,
      updates
    )
    return response.data.data!
  }

  async deleteCourse(courseId: string): Promise<void> {
    await this.apiClient.delete(`/courses/${courseId}`)
  }

  // Enrollment methods
  async enrollCourse(courseId: string): Promise<Enrollment> {
    const response = await this.apiClient.post<ApiResponse<Enrollment>>(
      `/courses/${courseId}/enroll`
    )
    return response.data.data!
  }

  async getEnrolledCourses(userId: string): Promise<Course[]> {
    const response = await this.apiClient.get<ApiResponse<Course[]>>(
      `/users/${userId}/courses`
    )
    return response.data.data!
  }

  async getEnrollments(userId: string): Promise<Enrollment[]> {
    const response = await this.apiClient.get<ApiResponse<Enrollment[]>>(
      `/users/${userId}/enrollments`
    )
    return response.data.data!
  }

  // Progress methods
  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgress> {
    const response = await this.apiClient.get<ApiResponse<CourseProgress>>(
      `/users/${userId}/courses/${courseId}/progress`
    )
    return response.data.data!
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progress: Partial<CourseProgress>
  ): Promise<CourseProgress> {
    const response = await this.apiClient.put<ApiResponse<CourseProgress>>(
      `/users/${userId}/courses/${courseId}/progress`,
      progress
    )
    return response.data.data!
  }

  // Message methods
  async getMessages(roomId: string, page = 1, pageSize = 50): Promise<PaginatedResponse<Message>> {
    const response = await this.apiClient.get<ApiResponse<PaginatedResponse<Message>>>(
      `/rooms/${roomId}/messages`,
      { params: { page, pageSize } }
    )
    return response.data.data!
  }

  async sendMessage(roomId: string, content: string): Promise<Message> {
    const response = await this.apiClient.post<ApiResponse<Message>>(
      `/rooms/${roomId}/messages`,
      { content }
    )
    return response.data.data!
  }

  // Notification methods
  async getNotifications(userId: string): Promise<Notification[]> {
    const response = await this.apiClient.get<ApiResponse<Notification[]>>(
      `/users/${userId}/notifications`
    )
    return response.data.data!
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.apiClient.put(
      `/notifications/${notificationId}/read`
    )
  }

  // Analytics methods
  async getAnalytics(userId: string): Promise<Record<string, any>> {
    const response = await this.apiClient.get<ApiResponse<Record<string, any>>>(
      `/analytics/users/${userId}`
    )
    return response.data.data!
  }

  async getCourseAnalytics(courseId: string): Promise<Record<string, any>> {
    const response = await this.apiClient.get<ApiResponse<Record<string, any>>>(
      `/analytics/courses/${courseId}`
    )
    return response.data.data!
  }

  // Recommendation methods
  async getRecommendations(userId: string, numCourses = 5): Promise<Course[]> {
    const response = await this.apiClient.get<ApiResponse<Course[]>>(
      `/recommendations/${userId}`,
      { params: { num_courses: numCourses } }
    )
    return response.data.data!
  }

  async recordInteraction(
    userId: string,
    courseId: string,
    type: string,
    duration?: number
  ): Promise<void> {
    await this.apiClient.post(
      `/analytics/interactions/${userId}`,
      { course_id: courseId, type, duration }
    )
  }

  async rateCourse(userId: string, courseId: string, rating: number): Promise<void> {
    await this.apiClient.post(
      `/analytics/ratings/${userId}/${courseId}`,
      { rating }
    )
  }

  // Search methods
  async searchCourses(query: string, limit = 10): Promise<Course[]> {
    const response = await this.apiClient.get<ApiResponse<Course[]>>(
      '/courses/search',
      { params: { q: query, limit } }
    )
    return response.data.data!
  }
}

export default EducationApiClient
export { EducationApiClient }
