import express, { Express, Request, Response } from 'express'
import cors from 'cors'

interface AnalyticsRequest extends Request {
  userId?: string
}

const app: Express = express()
app.use(express.json())
app.use(cors())

// Types
interface UserAnalytics {
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

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
}

interface CourseProgress {
  courseId: string
  courseName: string
  progress: number
  hoursSpent: number
  lessonsCompleted: number
  lastAccessed: Date
  assignments: AssignmentProgress[]
}

interface AssignmentProgress {
  id: string
  title: string
  submitted: boolean
  score: number
  feedback: string
}

interface CourseAnalytics {
  courseId: string
  courseName: string
  totalStudents: number
  averageScore: number
  completionRate: number
  avgTimeToComplete: number
  topicAnalysis: Map<string, number>
  engagement: EngagementMetrics
}

interface EngagementMetrics {
  activeStudents: number
  totalInteractions: number
  messageCount: number
  videoWatchTime: number
  assignmentSubmissionRate: number
}

// In-memory storage
const userAnalytics: Map<string, UserAnalytics> = new Map()
const courseProgressData: Map<string, CourseProgress[]> = new Map() // userId -> courseProgress[]
const courseAnalytics: Map<string, CourseAnalytics> = new Map()

// Initialize achievements
const achievements: Achievement[] = [
  {
    id: 'fast-learner',
    name: 'Fast Learner',
    description: 'Complete 5 lessons in one day',
    icon: '⚡',
    unlockedAt: new Date()
  },
  {
    id: 'course-master',
    name: 'Course Master',
    description: 'Complete an entire course',
    icon: '🏆',
    unlockedAt: new Date()
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    unlockedAt: new Date()
  }
]

// Get user analytics
app.get('/analytics/users/:userId', (req: AnalyticsRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const analytics = userAnalytics.get(userId)

    if (!analytics) {
      // Return default analytics
      return res.json({
        userId,
        totalHours: 0,
        completedCourses: 0,
        currentCourses: 0,
        averageScore: 0,
        streak: 0,
        lastActive: new Date(),
        learningPath: [],
        achievements: []
      })
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user analytics' })
  }
})

// Get user course progress
app.get('/analytics/users/:userId/courses', (req: AnalyticsRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const progress = courseProgressData.get(userId) || []

    res.json(progress)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course progress' })
  }
})

// Get specific course progress
app.get('/analytics/users/:userId/courses/:courseId', (req: AnalyticsRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const courseId = req.params.courseId
    const progress = courseProgressData.get(userId) || []
    const courseProgress = progress.find(cp => cp.courseId === courseId)

    if (!courseProgress) {
      return res.status(404).json({ error: 'Course progress not found' })
    }

    res.json(courseProgress)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course progress' })
  }
})

// Update course progress
app.put('/analytics/users/:userId/courses/:courseId/progress', (req: AnalyticsRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const courseId = req.params.courseId
    const { progress, hoursSpent } = req.body

    let userProgress = courseProgressData.get(userId)
    if (!userProgress) {
      userProgress = []
      courseProgressData.set(userId, userProgress)
    }

    let courseProgress = userProgress.find(cp => cp.courseId === courseId)
    if (courseProgress) {
      courseProgress.progress = progress
      courseProgress.hoursSpent = hoursSpent
      courseProgress.lastAccessed = new Date()
    }

    res.json({ message: 'Progress updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' })
  }
})

// Get course analytics
app.get('/analytics/courses/:courseId', (req: AnalyticsRequest, res: Response) => {
  try {
    const courseId = req.params.courseId
    const analytics = courseAnalytics.get(courseId)

    if (!analytics) {
      return res.status(404).json({ error: 'Course analytics not found' })
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course analytics' })
  }
})

// Get leaderboard
app.get('/analytics/leaderboard', (req: AnalyticsRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const category = req.query.category as string || 'hours'

    const leaderboard = Array.from(userAnalytics.values())
      .sort((a, b) => {
        if (category === 'hours') {
          return b.totalHours - a.totalHours
        } else if (category === 'courses') {
          return b.completedCourses - a.completedCourses
        } else {
          return b.averageScore - a.averageScore
        }
      })
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        ...user
      }))

    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// Get learning insights
app.get('/analytics/users/:userId/insights', (req: AnalyticsRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const progress = courseProgressData.get(userId) || []

    const insights = {
      totalCoursesEnrolled: progress.length,
      averageProgressPerCourse: progress.length > 0
        ? Math.round(progress.reduce((sum, cp) => sum + cp.progress, 0) / progress.length)
        : 0,
      mostActiveHours: '14:00-16:00', // Would be calculated from real data
      recommendedNextCourse: 'Advanced React Patterns',
      strengths: ['JavaScript', 'Problem Solving'],
      areasForImprovement: ['Data Structures', 'System Design']
    }

    res.json(insights)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' })
  }
})

// Track event
app.post('/analytics/events', (req: AnalyticsRequest, res: Response) => {
  try {
    const { userId, eventType, courseId, metadata } = req.body

    // Log event (in real implementation, would be stored)
    console.log(`Event tracked: ${eventType} for user ${userId}`)

    // Update analytics based on event
    if (eventType === 'lesson-completed') {
      let userProgress = courseProgressData.get(userId)
      if (!userProgress) {
        userProgress = []
        courseProgressData.set(userId, userProgress)
      }

      let courseProgress = userProgress.find(cp => cp.courseId === courseId)
      if (courseProgress) {
        courseProgress.lessonsCompleted++
      }
    }

    res.json({ message: 'Event tracked successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' })
  }
})

const PORT = process.env.PORT || 3004

app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`)
})

export default app
