# Mobile Backend - Node.js REST API

모바일 교육 앱을 위한 Node.js/Express 백엔드 서버입니다.

## 📡 주요 기능

### API 엔드포인트

#### 인증 (Authentication)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/forgot-password` - 비밀번호 찾기

#### 사용자 (User)
- `GET /api/user/profile` - 프로필 조회 (인증 필요)
- `PUT /api/user/profile` - 프로필 수정 (인증 필요)
- `POST /api/user/avatar` - 아바타 업로드 (인증 필요)

#### 상품 (Products)
- `GET /api/products` - 상품 목록
- `GET /api/products/:id` - 상품 상세
- `GET /api/products/search?q=검색어` - 상품 검색
- `GET /api/products/categories` - 카테고리 목록
- `POST /api/products` - 상품 생성 (인증 필요)
- `PUT /api/products/:id` - 상품 수정 (인증 필요)
- `DELETE /api/products/:id` - 상품 삭제 (인증 필요)

#### 알림 (Notifications)
- `POST /api/notifications/register-token` - FCM/APNS 토큰 등록
- `POST /api/notifications/send` - 알림 전송
- `POST /api/notifications/send-to-all` - 전체 알림 전송

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- MongoDB

### 설치 방법

1. **의존성 설치**
```bash
cd mobile-backend
npm install
```

2. **환경 변수 설정**
```bash
cp .env.example .env
# .env 파일을 열어서 설정 수정
```

3. **MongoDB 실행**
```bash
# Docker 사용시
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 또는 로컬 MongoDB 실행
mongod
```

4. **서버 실행**
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

서버가 http://localhost:3000 에서 실행됩니다.

## 📁 프로젝트 구조

```
mobile-backend/
├── src/
│   ├── controllers/        # 비즈니스 로직
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productsController.js
│   │   └── notificationsController.js
│   ├── models/             # MongoDB 모델
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/             # API 라우트
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── products.js
│   │   └── notifications.js
│   ├── middleware/         # 미들웨어
│   │   └── auth.js
│   ├── config/             # 설정 파일
│   │   └── database.js
│   └── index.js            # 서버 진입점
├── .env.example
├── package.json
└── README.md
```

## 🔧 기술 스택

- **Express** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - ODM
- **JWT** - 인증 토큰
- **bcryptjs** - 비밀번호 암호화
- **express-validator** - 유효성 검사

## 💡 API 사용 예시

### 회원가입
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "hong@example.com",
    "password": "password123"
  }'
```

### 로그인
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hong@example.com",
    "password": "password123"
  }'
```

### 프로필 조회 (인증 필요)
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 상품 목록
```bash
curl -X GET http://localhost:3000/api/products
```

## 🔐 인증

이 API는 JWT (JSON Web Token)를 사용합니다.

1. `/api/auth/login` 또는 `/api/auth/register`로 로그인
2. 응답에서 `token` 받기
3. 인증이 필요한 요청의 헤더에 포함:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

## 📊 데이터베이스 스키마

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  fcmToken: String,
  apnsToken: String,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  inStock: Boolean,
  rating: Number,
  reviews: Array,
  createdAt: Date
}
```

## 🔔 푸시 알림

Firebase Admin SDK를 사용하여 푸시 알림을 전송합니다.

1. Firebase 프로젝트 생성
2. 서비스 계정 키 다운로드
3. `.env`에 Firebase 설정 추가
4. `notificationsController.js`에서 Firebase Admin SDK 초기화

## 📄 라이센스

MIT License
