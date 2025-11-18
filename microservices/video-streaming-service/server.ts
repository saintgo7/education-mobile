import express, { Express, Request, Response } from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'

interface VideoRequest extends Request {
  userId?: string
  file?: Express.Multer.File
}

const app: Express = express()
app.use(express.json())
app.use(cors())

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/webm', 'video/ogg']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid video format'))
    }
  }
})

// Types
interface Video {
  id: string
  lessonId: string
  courseId: string
  title: string
  description: string
  duration: number
  fileSize: number
  videoUrl: string
  thumbnailUrl: string
  uploadedBy: string
  status: 'processing' | 'ready' | 'failed'
  quality: VideoQuality[]
  createdAt: Date
  updatedAt: Date
}

interface VideoQuality {
  resolution: '360p' | '480p' | '720p' | '1080p'
  bitrate: string
  url: string
}

interface PlaybackSession {
  id: string
  userId: string
  videoId: string
  startTime: Date
  lastPosition: number
  duration: number
  completed: boolean
  watchedAt: Date[]
}

interface StreamingAnalytics {
  videoId: string
  totalWatches: number
  averageWatchTime: number
  completionRate: number
  qualityDistribution: Record<string, number>
  bufferingIssues: number
  avgBufferingDuration: number
}

// In-memory storage
const videos: Map<string, Video> = new Map()
const playbackSessions: Map<string, PlaybackSession> = new Map()
const streamingAnalytics: Map<string, StreamingAnalytics> = new Map()
const videoTranscodingQueue: string[] = []

// Upload video
app.post('/videos/upload', upload.single('video'), async (req: VideoRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' })
    }

    const { lessonId, courseId, title, description } = req.body
    const userId = req.userId || 'anonymous'

    const video: Video = {
      id: Math.random().toString(36).substr(2, 9),
      lessonId,
      courseId,
      title,
      description,
      duration: 0,
      fileSize: req.file.size,
      videoUrl: `/videos/${req.file.filename}`,
      thumbnailUrl: '/videos/default-thumb.jpg',
      uploadedBy: userId,
      status: 'processing',
      quality: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    videos.set(video.id, video)

    // Add to transcoding queue
    videoTranscodingQueue.push(video.id)

    // Simulate transcoding process
    simulateTranscoding(video.id)

    res.status(201).json({
      id: video.id,
      message: 'Video uploaded successfully. Processing...',
      status: video.status
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get video details
app.get('/videos/:videoId', (req: VideoRequest, res: Response) => {
  try {
    const video = videos.get(req.params.videoId)

    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    res.json(video)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get videos for lesson
app.get('/lessons/:lessonId/videos', (req: VideoRequest, res: Response) => {
  try {
    const lessonId = req.params.lessonId
    const lessonVideos = Array.from(videos.values())
      .filter(v => v.lessonId === lessonId && v.status === 'ready')

    res.json({
      lessonId,
      videos: lessonVideos
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Stream video
app.get('/videos/:videoId/stream', (req: VideoRequest, res: Response) => {
  try {
    const video = videos.get(req.params.videoId)

    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    if (video.status !== 'ready') {
      return res.status(400).json({ error: 'Video is not ready for streaming' })
    }

    // Get quality preference
    const quality = (req.query.quality as string) || '720p'
    const videoQuality = video.quality.find(q => q.resolution === quality)

    if (!videoQuality) {
      return res.status(400).json({ error: 'Requested quality not available' })
    }

    // Create playback session
    const session: PlaybackSession = {
      id: Math.random().toString(36).substr(2, 9),
      userId: req.userId || 'anonymous',
      videoId: req.params.videoId,
      startTime: new Date(),
      lastPosition: 0,
      duration: video.duration,
      completed: false,
      watchedAt: []
    }

    playbackSessions.set(session.id, session)

    // Return HLS/DASH streaming URL
    res.json({
      sessionId: session.id,
      streamUrl: videoQuality.url,
      videoId: video.id,
      duration: video.duration,
      availableQualities: video.quality.map(q => q.resolution),
      currentQuality: quality
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update playback progress
app.post('/videos/:videoId/progress', (req: VideoRequest, res: Response) => {
  try {
    const { sessionId, position, completed } = req.body
    const session = playbackSessions.get(sessionId)

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    session.lastPosition = position
    session.completed = completed
    session.watchedAt.push(new Date())

    if (completed) {
      recordAnalytics(session.videoId, session)
    }

    res.json({
      message: 'Progress updated',
      position,
      completed
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get playback session
app.get('/sessions/:sessionId', (req: VideoRequest, res: Response) => {
  try {
    const session = playbackSessions.get(req.params.sessionId)

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(session)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get user's watch history
app.get('/users/:userId/watch-history', (req: VideoRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const userSessions = Array.from(playbackSessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())

    const watchHistory = userSessions.map(session => {
      const video = videos.get(session.videoId)
      return {
        videoId: session.videoId,
        title: video?.title,
        watchedAt: session.watchedAt,
        lastPosition: session.lastPosition,
        duration: session.duration,
        completed: session.completed
      }
    })

    res.json({
      userId,
      watchHistory
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get streaming analytics
app.get('/videos/:videoId/analytics', (req: VideoRequest, res: Response) => {
  try {
    const analytics = streamingAnalytics.get(req.params.videoId)

    if (!analytics) {
      return res.status(404).json({
        videoId: req.params.videoId,
        totalWatches: 0,
        averageWatchTime: 0,
        completionRate: 0,
        qualityDistribution: {},
        bufferingIssues: 0,
        avgBufferingDuration: 0
      })
    }

    res.json(analytics)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Download video (for offline viewing)
app.post('/videos/:videoId/download', (req: VideoRequest, res: Response) => {
  try {
    const video = videos.get(req.params.videoId)

    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    const { quality = '480p' } = req.body

    res.json({
      videoId: video.id,
      title: video.title,
      downloadUrl: `/videos/${video.id}/download/${quality}`,
      fileSize: estimateFileSize(quality),
      expiresIn: '7 days'
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Delete video
app.delete('/videos/:videoId', (req: VideoRequest, res: Response) => {
  try {
    const video = videos.get(req.params.videoId)

    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    videos.delete(req.params.videoId)

    res.json({ message: 'Video deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Helper functions
function simulateTranscoding(videoId: string): void {
  setTimeout(() => {
    const video = videos.get(videoId)
    if (video) {
      video.status = 'ready'
      video.duration = 3600 // 1 hour
      video.quality = [
        { resolution: '360p', bitrate: '500k', url: `/stream/${videoId}/360p.m3u8` },
        { resolution: '480p', bitrate: '1000k', url: `/stream/${videoId}/480p.m3u8` },
        { resolution: '720p', bitrate: '2500k', url: `/stream/${videoId}/720p.m3u8` },
        { resolution: '1080p', bitrate: '5000k', url: `/stream/${videoId}/1080p.m3u8` }
      ]
      console.log(`Video ${videoId} transcoding completed`)
    }
  }, 5000) // Simulate 5 second processing
}

function recordAnalytics(videoId: string, session: PlaybackSession): void {
  let analytics = streamingAnalytics.get(videoId)

  if (!analytics) {
    analytics = {
      videoId,
      totalWatches: 0,
      averageWatchTime: 0,
      completionRate: 0,
      qualityDistribution: {},
      bufferingIssues: 0,
      avgBufferingDuration: 0
    }
    streamingAnalytics.set(videoId, analytics)
  }

  analytics.totalWatches++
  analytics.averageWatchTime = (analytics.averageWatchTime + session.lastPosition) / 2
  if (session.completed) {
    analytics.completionRate = (analytics.completionRate + 1) / analytics.totalWatches * 100
  }
}

function estimateFileSize(quality: string): string {
  const sizes: Record<string, string> = {
    '360p': '250MB',
    '480p': '500MB',
    '720p': '1.2GB',
    '1080p': '2.5GB'
  }
  return sizes[quality] || '500MB'
}

const PORT = process.env.PORT || 3006

app.listen(PORT, () => {
  console.log(`Video streaming service running on port ${PORT}`)
})

export default app
