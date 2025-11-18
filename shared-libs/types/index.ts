// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'student' | 'instructor' | 'admin'
  bio?: string
  phone?: string
  country?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  totalPoints: number
  streakDays: number
  enrolledCourses: number
  completedCourses: number
  averageScore: number
}

// Course Types
export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorId: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  rating: number
  students: number
  thumbnail: string
  lessons: Lesson[]
  duration: number
  createdAt: Date
  updatedAt: Date
  prerequisites?: string[]
  tags?: string[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  duration: number
  content: string
  videoUrl: string
  resources: Resource[]
  order: number
  createdAt: Date
}

export interface Resource {
  id: string
  title: string
  url: string
  type: 'pdf' | 'video' | 'code' | 'article' | 'exercise'
}

// Progress Types
export interface CourseProgress {
  userId: string
  courseId: string
  enrolledAt: Date
  completedLessons: number
  totalLessons: number
  progress: number
  lastAccessed: Date
  completed: boolean
  score: number
}

export interface LessonProgress {
  userId: string
  lessonId: string
  courseId: string
  completed: boolean
  watchedTime: number
  totalTime: number
  completedAt?: Date
}

// Enrollment Types
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  status: 'active' | 'completed' | 'dropped'
  progress: CourseProgress
  certificate?: Certificate
}

export interface Certificate {
  id: string
  userId: string
  courseId: string
  issueDate: Date
  certificateUrl: string
  verificationCode: string
}

// Assignment Types
export interface Assignment {
  id: string
  courseId: string
  lessonId: string
  title: string
  description: string
  dueDate: Date
  maxScore: number
  attachments: Resource[]
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  userId: string
  submittedAt: Date
  content: string
  attachments: Resource[]
  score?: number
  feedback?: string
  gradeDate?: Date
}

// Message Types
export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  type: 'text' | 'code' | 'file' | 'system'
  roomId?: string
  threadId?: string
  timestamp: Date
  edited: boolean
  editedAt?: Date
  reactions?: Record<string, string[]>
  attachments?: Resource[]
}

export interface Room {
  id: string
  name: string
  type: 'course' | 'group' | 'direct'
  instructorId: string
  courseId?: string
  participants: User[]
  createdAt: Date
  lastMessage?: Message
  messages: Message[]
}

// Analytics Types
export interface Analytics {
  userId: string
  totalHours: number
  completedCourses: number
  currentCourses: number
  averageScore: number
  streak: number
  lastActive: Date
  learningPath: string[]
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'course' | 'engagement' | 'performance'
  unlockedAt: Date
}

export interface CourseAnalytics {
  courseId: string
  courseName: string
  totalStudents: number
  activeStudents: number
  averageScore: number
  completionRate: number
  avgTimeToComplete: number
  engagement: EngagementMetrics
}

export interface EngagementMetrics {
  activeStudents: number
  totalInteractions: number
  messageCount: number
  videoWatchTime: number
  assignmentSubmissionRate: number
  averageSessionDuration: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Auth Types
export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'course' | 'message' | 'assignment' | 'system'
  title: string
  content: string
  link?: string
  read: boolean
  createdAt: Date
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  courseUpdates: boolean
  assignmentReminders: boolean
  messageNotifications: boolean
}

// Filter and Sort Types
export interface Filter {
  category?: string
  level?: string
  rating?: number
  price?: {
    min: number
    max: number
  }
  instructor?: string
  search?: string
}

export interface SortOptions {
  field: 'rating' | 'price' | 'students' | 'newest' | 'popular'
  order: 'asc' | 'desc'
}

// Error Types
export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  code: string
  message: string
  errors?: ValidationError[]
  timestamp: Date
}
