const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Auth methods
  async register(email: string, password: string, name: string) {
    return this.post('/api/auth/register', { email, password, name })
  }

  async login(email: string, password: string) {
    const response = await this.post<any>('/api/auth/login', { email, password })
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.token)
    }
    return response
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  async getProfile() {
    return this.get('/api/auth/profile')
  }

  // Course methods
  async getCourses(filters?: any) {
    const params = new URLSearchParams(filters).toString()
    return this.get(`/api/courses${params ? `?${params}` : ''}`)
  }

  async getCourse(id: string) {
    return this.get(`/api/courses/${id}`)
  }

  async enrollCourse(courseId: string) {
    return this.post(`/api/courses/${courseId}/enroll`, {})
  }

  async getMyCourses() {
    return this.get('/api/courses/my-courses')
  }

  // Payment methods
  async processPayment(courseId: string, paymentMethod: string) {
    return this.post('/api/payments/process', { courseId, paymentMethod })
  }

  // Video methods
  async uploadVideo(courseId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('courseId', courseId)

    return fetch(`${this.baseURL}/api/videos/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
      body: formData,
    }).then(res => res.json())
  }

  // Analytics methods
  async getDashboardStats() {
    return this.get('/api/analytics/dashboard')
  }

  async getCourseStats(courseId: string) {
    return this.get(`/api/analytics/courses/${courseId}/stats`)
  }

  // Recommendation methods
  async getRecommendations() {
    return this.get('/api/recommendations')
  }

  async getSimilarCourses(courseId: string) {
    return this.get(`/api/recommendations/courses/${courseId}/similar`)
  }
}

export const apiClient = new APIClient()
