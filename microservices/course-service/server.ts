import express, { Express, Request, Response } from 'express'
import cors from 'cors'

interface CourseRequest extends Request {
  userId?: string
}

const app: Express = express()
app.use(express.json())
app.use(cors())

// In-memory database
interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  students: number
  lessons: Lesson[]
  thumbnail: string
  price: number
}

interface Lesson {
  id: string
  title: string
  duration: number
  content: string
  videoUrl: string
  resources: string[]
  order: number
}

const courses: Map<string, Course> = new Map()
const enrollments: Map<string, string[]> = new Map() // userId -> courseIds

// Initialize with sample courses
const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'React.js Advanced Patterns',
    description: 'Master advanced React patterns and best practices',
    instructor: 'John Smith',
    category: 'Programming',
    level: 'advanced',
    rating: 4.8,
    students: 2500,
    price: 99,
    thumbnail: 'https://example.com/react.jpg',
    lessons: [
      {
        id: 'l1',
        title: 'Intro to Advanced Patterns',
        duration: 45,
        content: 'Learn about advanced React patterns',
        videoUrl: 'https://example.com/video1.mp4',
        resources: ['slides.pdf', 'code.zip'],
        order: 1
      }
    ]
  },
  {
    id: '2',
    title: 'TypeScript Mastery',
    description: 'Complete TypeScript course for beginners to advanced',
    instructor: 'Jane Doe',
    category: 'Programming',
    level: 'intermediate',
    rating: 4.9,
    students: 3200,
    price: 79,
    thumbnail: 'https://example.com/typescript.jpg',
    lessons: []
  },
  {
    id: '3',
    title: 'Web Design Fundamentals',
    description: 'Learn modern web design principles and practices',
    instructor: 'Mike Johnson',
    category: 'Design',
    level: 'beginner',
    rating: 4.7,
    students: 1800,
    price: 49,
    thumbnail: 'https://example.com/design.jpg',
    lessons: []
  }
]

sampleCourses.forEach(course => {
  courses.set(course.id, course)
})

// Get all courses
app.get('/courses', (req: CourseRequest, res: Response) => {
  try {
    const category = req.query.category as string
    const level = req.query.level as string

    let courseList = Array.from(courses.values())

    if (category) {
      courseList = courseList.filter(c => c.category === category)
    }

    if (level) {
      courseList = courseList.filter(c => c.level === level)
    }

    res.json(courseList)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

// Get course by ID
app.get('/courses/:id', (req: CourseRequest, res: Response) => {
  try {
    const course = courses.get(req.params.id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.json(course)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' })
  }
})

// Create new course (instructor only)
app.post('/courses', (req: CourseRequest, res: Response) => {
  try {
    const { title, description, category, level, price } = req.body

    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      level,
      price,
      instructor: 'Current User',
      rating: 0,
      students: 0,
      thumbnail: '',
      lessons: []
    }

    courses.set(newCourse.id, newCourse)
    res.status(201).json(newCourse)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' })
  }
})

// Update course
app.put('/courses/:id', (req: CourseRequest, res: Response) => {
  try {
    const course = courses.get(req.params.id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    const updated = { ...course, ...req.body }
    courses.set(req.params.id, updated)

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' })
  }
})

// Delete course
app.delete('/courses/:id', (req: CourseRequest, res: Response) => {
  try {
    if (!courses.has(req.params.id)) {
      return res.status(404).json({ error: 'Course not found' })
    }

    courses.delete(req.params.id)
    res.json({ message: 'Course deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' })
  }
})

// Enroll in course
app.post('/courses/:id/enroll', (req: CourseRequest, res: Response) => {
  try {
    const course = courses.get(req.params.id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    const userId = req.userId || 'anonymous'
    const userCourses = enrollments.get(userId) || []

    if (!userCourses.includes(req.params.id)) {
      userCourses.push(req.params.id)
      enrollments.set(userId, userCourses)
      course.students++
    }

    res.json({ message: 'Enrolled successfully', courseId: req.params.id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll' })
  }
})

// Get enrolled courses
app.get('/users/:userId/courses', (req: CourseRequest, res: Response) => {
  try {
    const userCourses = enrollments.get(req.params.userId) || []
    const enrolledCourseList = userCourses
      .map(id => courses.get(id))
      .filter(Boolean) as Course[]

    res.json(enrolledCourseList)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses' })
  }
})

// Add lesson to course
app.post('/courses/:id/lessons', (req: CourseRequest, res: Response) => {
  try {
    const course = courses.get(req.params.id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    const { title, duration, content, videoUrl, resources } = req.body

    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      duration,
      content,
      videoUrl,
      resources,
      order: course.lessons.length + 1
    }

    course.lessons.push(newLesson)
    res.status(201).json(newLesson)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' })
  }
})

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`)
})

export default app
