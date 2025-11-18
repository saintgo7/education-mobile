import express, { Express, Request, Response } from 'express'
import http from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import cors from 'cors'

const app: Express = express()
app.use(express.json())
app.use(cors())

const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Types
interface Room {
  id: string
  name: string
  instructor: string
  participants: Map<string, Participant>
  createdAt: Date
  messages: Message[]
  sharedContent: SharedContent[]
}

interface Participant {
  id: string
  name: string
  role: 'instructor' | 'student'
  joinedAt: Date
  active: boolean
}

interface Message {
  id: string
  sender: string
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'code' | 'file'
}

interface SharedContent {
  id: string
  type: 'document' | 'video' | 'code'
  title: string
  url: string
  sharedBy: string
  sharedAt: Date
}

// In-memory storage
const rooms: Map<string, Room> = new Map()
const userRooms: Map<string, Set<string>> = new Map() // userId -> roomIds

// REST endpoints
app.get('/rooms', (req: Request, res: Response) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    instructor: room.instructor,
    participantCount: room.participants.size,
    createdAt: room.createdAt
  }))

  res.json(roomList)
})

app.post('/rooms', (req: Request, res: Response) => {
  try {
    const { name, instructor } = req.body

    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      instructor,
      participants: new Map(),
      createdAt: new Date(),
      messages: [],
      sharedContent: []
    }

    rooms.set(newRoom.id, newRoom)

    res.status(201).json({
      id: newRoom.id,
      name: newRoom.name,
      instructor: newRoom.instructor
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' })
  }
})

app.get('/rooms/:id', (req: Request, res: Response) => {
  const room = rooms.get(req.params.id)

  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }

  res.json({
    id: room.id,
    name: room.name,
    instructor: room.instructor,
    participants: Array.from(room.participants.values()),
    messages: room.messages,
    sharedContent: room.sharedContent
  })
})

app.get('/rooms/:id/messages', (req: Request, res: Response) => {
  const room = rooms.get(req.params.id)

  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }

  res.json(room.messages)
})

// WebSocket handlers
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('join-room', (data: { roomId: string; userId: string; userName: string; role: string }) => {
    const room = rooms.get(data.roomId)

    if (!room) {
      socket.emit('error', 'Room not found')
      return
    }

    socket.join(data.roomId)

    // Add participant
    const participant: Participant = {
      id: data.userId,
      name: data.userName,
      role: data.role as 'instructor' | 'student',
      joinedAt: new Date(),
      active: true
    }

    room.participants.set(data.userId, participant)

    // Track user rooms
    if (!userRooms.has(data.userId)) {
      userRooms.set(data.userId, new Set())
    }
    userRooms.get(data.userId)?.add(data.roomId)

    // Notify others
    io.to(data.roomId).emit('participant-joined', {
      user: participant,
      totalParticipants: room.participants.size
    })
  })

  socket.on('send-message', (data: { roomId: string; userId: string; userName: string; content: string; type: string }) => {
    const room = rooms.get(data.roomId)

    if (!room) {
      socket.emit('error', 'Room not found')
      return
    }

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: data.userId,
      senderName: data.userName,
      content: data.content,
      timestamp: new Date(),
      type: data.type as 'text' | 'code' | 'file'
    }

    room.messages.push(message)

    // Broadcast to room
    io.to(data.roomId).emit('new-message', message)
  })

  socket.on('share-content', (data: { roomId: string; userId: string; type: string; title: string; url: string }) => {
    const room = rooms.get(data.roomId)

    if (!room) {
      socket.emit('error', 'Room not found')
      return
    }

    const content: SharedContent = {
      id: Math.random().toString(36).substr(2, 9),
      type: data.type as 'document' | 'video' | 'code',
      title: data.title,
      url: data.url,
      sharedBy: data.userId,
      sharedAt: new Date()
    }

    room.sharedContent.push(content)

    // Broadcast to room
    io.to(data.roomId).emit('content-shared', content)
  })

  socket.on('typing', (data: { roomId: string; userId: string; userName: string; isTyping: boolean }) => {
    socket.to(data.roomId).emit('user-typing', {
      userId: data.userId,
      userName: data.userName,
      isTyping: data.isTyping
    })
  })

  socket.on('leave-room', (data: { roomId: string; userId: string }) => {
    const room = rooms.get(data.roomId)

    if (room) {
      room.participants.delete(data.userId)

      io.to(data.roomId).emit('participant-left', {
        userId: data.userId,
        totalParticipants: room.participants.size
      })
    }

    socket.leave(data.roomId)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    // Clean up user rooms
    for (const [userId, roomIds] of userRooms.entries()) {
      for (const roomId of roomIds) {
        const room = rooms.get(roomId)
        if (room) {
          room.participants.delete(userId)
          io.to(roomId).emit('participant-left', {
            userId: userId,
            totalParticipants: room.participants.size
          })
        }
      }
    }
  })
})

const PORT = process.env.PORT || 3003

server.listen(PORT, () => {
  console.log(`Collaboration service running on port ${PORT}`)
})

export default app
