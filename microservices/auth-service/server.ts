import express, { Express, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

interface AuthRequest extends Request {
  userId?: string
  user?: {
    id: string
    email: string
    role: string
  }
}

const app: Express = express()

// Middleware
app.use(express.json())
app.use(cors())

// Database connection would be here
// For demo: using in-memory store
const users: Map<string, any> = new Map()
const refreshTokens: Set<string> = new Set()

// Register endpoint
app.post('/auth/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if user exists
    if (users.has(email)) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password: hashedPassword,
      role: 'student',
      createdAt: new Date()
    }

    users.set(email, user)

    // Create tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    )

    refreshTokens.add(refreshToken)

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login endpoint
app.post('/auth/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' })
    }

    const user = users.get(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    )

    refreshTokens.add(refreshToken)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Refresh token endpoint
app.post('/auth/refresh', (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'
    ) as any

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    )

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Verify token middleware
const verifyToken = (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as any

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Protected route example
app.get('/auth/profile', verifyToken, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user })
})

// Logout endpoint
app.post('/auth/logout', (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    refreshTokens.delete(refreshToken)
  }
  res.json({ message: 'Logged out successfully' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`)
})

export default app
