# 배포 가이드

## 🚀 빠른 시작

### 사전 요구사항

```bash
# 설치 필요 패키지
- Docker & Docker Compose
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- MongoDB 5+
- Redis 7+
- Kubernetes 1.25+ (프로덕션)
```

## 📦 로컬 개발 환경

### 1단계: 저장소 클론

```bash
git clone https://github.com/saintgo7/education-mobile.git
cd education-mobile
```

### 2단계: 환경 변수 설정

```bash
# .env.local 파일 생성
cp .env.example .env.local

# 주요 환경 변수
DATABASE_URL=mongodb://localhost:27017/education
POSTGRES_URL=postgresql://user:password@localhost:5432/education
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-...
```

### 3단계: 마이크로서비스 시작

```bash
# Docker Compose로 모든 서비스 시작
docker-compose -f docker-compose.yml up -d

# 또는 개별 시작
cd microservices/auth-service && npm start
cd microservices/course-service && npm start
cd microservices/collaboration-service && npm start
cd microservices/analytics-service && npm start
python ai-ml-engine/api.py
```

### 4단계: 클라이언트 앱 시작

```bash
# Vue Native
cd vue-native
npm install
npm start

# React Native (Expo)
cd react-native-expo
npm install
npm start

# Next.js Web
cd next-web-app
npm install
npm run dev

# React Tauri
cd react-tauri
npm install
npm run dev
```

## 🐳 Docker 배포

### Dockerfile 예제

```dockerfile
# 다중 단계 빌드
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # MongoDB
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: education

  # PostgreSQL
  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: education
      POSTGRES_PASSWORD: password
      POSTGRES_DB: education
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # Auth Service
  auth-service:
    build: ./microservices/auth-service
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: mongodb://mongo:27017/education
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongo

  # Course Service
  course-service:
    build: ./microservices/course-service
    ports:
      - "3002:3002"
    environment:
      DATABASE_URL: mongodb://mongo:27017/education
    depends_on:
      - mongo

  # Collaboration Service
  collaboration-service:
    build: ./microservices/collaboration-service
    ports:
      - "3003:3003"
    environment:
      REDIS_URL: redis://redis:6379

  # Analytics Service
  analytics-service:
    build: ./microservices/analytics-service
    ports:
      - "3004:3004"
    environment:
      DATABASE_URL: postgresql://education:password@postgres:5432/education

  # AI/ML Engine
  ai-engine:
    build: ./ai-ml-engine
    ports:
      - "5000:5000"
    volumes:
      - ./ai-ml-engine:/app

volumes:
  mongo-data:
  postgres-data:
  redis-data:
```

## ☸️ Kubernetes 배포

### Deployment 설정

```yaml
# auth-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: education
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: education/auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: mongo-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secrets
              key: jwt-secret
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service 및 Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: education-ingress
  namespace: education
spec:
  ingressClassName: nginx
  rules:
  - host: api.education.com
    http:
      paths:
      - path: /auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 3001
      - path: /courses
        pathType: Prefix
        backend:
          service:
            name: course-service
            port:
              number: 3002
      - path: /collaborate
        pathType: Prefix
        backend:
          service:
            name: collaboration-service
            port:
              number: 3003
      - path: /analytics
        pathType: Prefix
        backend:
          service:
            name: analytics-service
            port:
              number: 3004
      - path: /recommend
        pathType: Prefix
        backend:
          service:
            name: ai-engine
            port:
              number: 5000
```

### ConfigMap & Secret

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: education
data:
  NODE_ENV: production
  LOG_LEVEL: info

# secret.yaml (Base64 인코딩)
apiVersion: v1
kind: Secret
metadata:
  name: db-secrets
  namespace: education
type: Opaque
data:
  mongo-url: bW9uZ29kYjovL3VzZXI6cGFzc3dvcmRAaW9zdC5jb206MjcwMTcvZWR1Y2F0aW9u
  postgres-url: cG9zdGdyZXM6Ly91c2VyOnBhc3N3b3JkQGRiLmNvbTovZWR1Y2F0aW9u
```

## 🔄 CI/CD 파이프라인

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build

      - name: Run linting
        run: npm run lint

      - name: Build Docker image
        run: docker build -t education-platform:latest .

      - name: Push to registry
        run: |
          docker login -u ${{ secrets.DOCKER_USER }} -p ${{ secrets.DOCKER_PASS }}
          docker push education-platform:latest

      - name: Deploy to K8s
        run: |
          kubectl apply -f k8s/
          kubectl rollout status deployment/education-platform
```

## 📊 모니터링 설정

### Prometheus + Grafana

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'auth-service'
    static_configs:
      - targets: ['localhost:3001']

  - job_name: 'course-service'
    static_configs:
      - targets: ['localhost:3002']

# grafana-datasource.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
data:
  prometheus.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus:9090
        isDefault: true
```

### ELK Stack (로깅)

```yaml
# logstash.conf
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [service] == "auth-service" {
    mutate { add_tag => ["auth"] }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{service}-%{+YYYY.MM.dd}"
  }
}
```

## 🧪 테스트 환경 배포

```bash
# 테스트 환경 변수
export ENV=test
export DATABASE_URL=mongodb://test-mongo:27017/education-test
export API_BASE_URL=http://localhost:3000

# 테스트 환경 시작
docker-compose -f docker-compose.test.yml up

# 테스트 실행
npm run test:integration
npm run test:e2e
```

## 📈 성능 최적화

### 캐싱 전략

```typescript
// Redis 캐시
const cache = {
  ttl: 3600, // 1시간
  keys: {
    courses: 'courses:*',
    users: 'users:*',
    progress: 'progress:*'
  }
}
```

### CDN 설정

```nginx
# Nginx CDN 설정
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## 🔐 보안 배포 체크리스트

- [ ] 환경 변수 설정
- [ ] HTTPS/TLS 인증서
- [ ] 데이터베이스 암호화
- [ ] API 키 보안
- [ ] 방화벽 규칙
- [ ] DDoS 보호
- [ ] 취약점 스캔
- [ ] 백업 설정

## 🚨 문제 해결

### 서비스 연결 오류

```bash
# 서비스 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs auth-service

# 네트워크 확인
docker network ls
docker inspect education-mobile_default
```

### 성능 문제

```bash
# CPU/메모리 모니터링
docker stats

# 데이터베이스 쿼리 성능
db.collection.find().explain("executionStats")

# 응답 시간 추적
npm run profile
```

## 📞 지원

- 문제 보고: [GitHub Issues](https://github.com/saintgo7/education-mobile/issues)
- 문서: [전체 가이드](./README.md)
