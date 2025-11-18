/**
 * API Gateway - 모든 마이크로서비스의 통합 진입점
 * 요청 라우팅, 인증, 로깅, 속도 제한 등을 담당
 */

import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'express-http-proxy';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ============================================
// MIDDLEWARE
// ============================================

// CORS 설정
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 로깅
app.use(morgan('combined'));

// 속도 제한
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 각 IP당 최대 100개 요청
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ============================================
// 인증 미들웨어
// ============================================

interface AuthRequest extends Request {
  userId?: string;
  token?: string;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // 공개 라우트는 토큰 없이도 접근 가능
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// 필수 인증 미들웨어
const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// ============================================
// 헬스 체크
// ============================================

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ============================================
// 라우팅 설정 - 마이크로서비스로 프록시
// ============================================

const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  course: process.env.COURSE_SERVICE_URL || 'http://localhost:3002',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
  video: process.env.VIDEO_SERVICE_URL || 'http://localhost:3004',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3005',
  collaboration: process.env.COLLABORATION_SERVICE_URL || 'http://localhost:3006',
  email: process.env.EMAIL_SERVICE_URL || 'http://localhost:3007',
  recommendation: process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:3008'
};

// 인증 서비스 (토큰 없이 접근 가능)
app.use('/api/auth', createProxyMiddleware({
  target: serviceUrls.auth,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
  logLevel: 'debug'
}));

// 코스 서비스 (인증 필수)
app.use('/api/courses', authenticateToken, createProxyMiddleware({
  target: serviceUrls.course,
  changeOrigin: true,
  pathRewrite: { '^/api/courses': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    // 사용자 ID를 헤더에 추가
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
    if (req.token) {
      proxyReq.setHeader('X-Token', req.token);
    }
  }
}));

// 결제 서비스 (인증 필수)
app.use('/api/payments', authenticateToken, requireAuth, createProxyMiddleware({
  target: serviceUrls.payment,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
  }
}));

// 비디오 서비스 (인증 필수)
app.use('/api/videos', authenticateToken, createProxyMiddleware({
  target: serviceUrls.video,
  changeOrigin: true,
  pathRewrite: { '^/api/videos': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
  }
}));

// 분석 서비스 (인증 필수)
app.use('/api/analytics', authenticateToken, requireAuth, createProxyMiddleware({
  target: serviceUrls.analytics,
  changeOrigin: true,
  pathRewrite: { '^/api/analytics': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
  }
}));

// 협업 서비스 (인증 필수)
app.use('/api/collaboration', authenticateToken, requireAuth, createProxyMiddleware({
  target: serviceUrls.collaboration,
  changeOrigin: true,
  pathRewrite: { '^/api/collaboration': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
  }
}));

// 이메일 마케팅 서비스 (관리자 전용)
app.use('/api/marketing', authenticateToken, createProxyMiddleware({
  target: serviceUrls.email,
  changeOrigin: true,
  pathRewrite: { '^/api/marketing': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
  }
}));

// 추천 서비스 (토큰 없이도 가능)
app.use('/api/recommendations', authenticateToken, createProxyMiddleware({
  target: serviceUrls.recommendation,
  changeOrigin: true,
  pathRewrite: { '^/api/recommendations': '' },
  onProxyReq: (proxyReq, req: AuthRequest) => {
    if (req.userId) {
      proxyReq.setHeader('X-User-ID', req.userId);
    }
  }
}));

// ============================================
// API 문서 엔드포인트
// ============================================

app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    title: 'Education Mobile API Gateway',
    version: '1.0.0',
    description: '모든 마이크로서비스를 통합하는 API 게이트웨이',
    baseUrl: `http://localhost:${PORT}/api`,
    services: {
      auth: {
        url: '/auth',
        description: '사용자 인증 서비스',
        endpoints: [
          'POST /register - 회원가입',
          'POST /login - 로그인',
          'POST /refresh-token - 토큰 갱신',
          'GET /profile - 프로필 조회 (인증 필수)'
        ]
      },
      courses: {
        url: '/courses',
        description: '코스 관리 서비스 (인증 필수)',
        endpoints: [
          'GET / - 모든 코스 조회',
          'GET /:id - 코스 상세 조회',
          'POST / - 코스 생성',
          'PUT /:id - 코스 수정',
          'DELETE /:id - 코스 삭제',
          'POST /:id/enroll - 코스 등록'
        ]
      },
      payments: {
        url: '/payments',
        description: '결제 처리 서비스 (인증 필수)',
        endpoints: [
          'POST /process - 결제 처리',
          'GET /history - 결제 이력 조회',
          'POST /refund - 환불 처리'
        ]
      },
      videos: {
        url: '/videos',
        description: '비디오 스트리밍 서비스 (인증 필수)',
        endpoints: [
          'POST /upload - 비디오 업로드',
          'GET /:id/stream - 비디오 스트리밍',
          'GET /my - 내 비디오 목록'
        ]
      },
      analytics: {
        url: '/analytics',
        description: '분석 서비스 (인증 필수)',
        endpoints: [
          'GET /dashboard - 대시보드 데이터',
          'GET /courses/:id/stats - 코스 통계',
          'GET /users/:id/progress - 사용자 진행상황'
        ]
      },
      collaboration: {
        url: '/collaboration',
        description: '협업 서비스 (인증 필수, WebSocket)',
        endpoints: [
          'GET /rooms - 협업 방 목록',
          'POST /rooms - 방 생성',
          'WS /rooms/:id - WebSocket 연결'
        ]
      },
      marketing: {
        url: '/marketing',
        description: '이메일 마케팅 서비스',
        endpoints: [
          'POST /campaigns - 캠페인 생성',
          'GET /campaigns - 캠페인 목록',
          'POST /campaigns/:id/send - 캠페인 전송'
        ]
      },
      recommendations: {
        url: '/recommendations',
        description: '추천 엔진 서비스',
        endpoints: [
          'GET / - 추천 코스 조회',
          'GET /courses/:id/similar - 유사 코스 추천'
        ]
      }
    }
  });
});

// ============================================
// 에러 핸들링
// ============================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Gateway Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 핸들러
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'The requested resource was not found'
  });
});

// ============================================
// 서버 시작
// ============================================

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`\nHealth check: http://localhost:${PORT}/health`);
  console.log(`API Docs: http://localhost:${PORT}/api/docs\n`);
  console.log('Connected Services:');
  Object.entries(serviceUrls).forEach(([name, url]) => {
    console.log(`  - ${name}: ${url}`);
  });
  console.log(`${'='.repeat(50)}\n`);
});

export default app;
