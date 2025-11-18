# Complete Service Deployment Guide

이 문서는 Education Mobile 플랫폼 전체를 배포하기 위한 완벽한 가이드입니다.

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
3. [Docker를 사용한 배포](#docker를-사용한-배포)
4. [Kubernetes 배포](#kubernetes-배포)
5. [CI/CD 파이프라인](#cicd-파이프라인)
6. [모니터링 및 로깅](#모니터링-및-로깅)
7. [보안 설정](#보안-설정)
8. [트러블슈팅](#트러블슈팅)

## 사전 요구사항

### 필수 소프트웨어
- Docker & Docker Compose 20.10+
- Node.js 18+
- npm 9+
- Git
- kubectl (Kubernetes 배포 시)

### 선택적 소프트웨어
- Kubernetes 클러스터
- AWS CLI (AWS 배포 시)
- Terraform (IaC 사용 시)

## 로컬 개발 환경 설정

### 1단계: 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 개발 환경에 맞게 편집
nano .env
```

중요한 설정값:
- `JWT_SECRET`: 강력한 비밀 키로 변경
- `STRIPE_SECRET_KEY`: Stripe 개발 키 입력
- `MONGODB_URI`: MongoDB 연결 문자열

### 2단계: 의존성 설치

```bash
# 루트 디렉토리에서
npm install

# 각 마이크로서비스 설치
cd api-gateway && npm install && cd ..
cd microservices/auth-service && npm install && cd ../..
# ... 다른 서비스들도 반복

# 웹 앱 설치
cd web && npm install && cd ..
cd admin-dashboard && npm install && cd ..
```

### 3단계: 개발 서버 실행

```bash
# 터미널 1: API Gateway
cd api-gateway && npm run dev

# 터미널 2: Auth Service
cd microservices/auth-service && npm run dev

# 터미널 3: 다른 마이크로서비스들
# (각 터미널에서 필요한 서비스 실행)

# 터미널 N: 웹 앱
cd web && npm run dev
# 방문: http://localhost:3010
```

## Docker를 사용한 배포

### 1단계: Docker 이미지 빌드

```bash
# 전체 스택 빌드 및 실행
docker-compose build

# 특정 서비스만 빌드
docker-compose build api-gateway
docker-compose build course-service
```

### 2단계: 컨테이너 시작

```bash
# 전체 스택 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f api-gateway
```

### 3단계: 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 헬스 체크
curl http://localhost:3000/health

# API 문서 확인
curl http://localhost:3000/api/docs
```

### 4단계: 컨테이너 중지

```bash
# 전체 스택 중지
docker-compose down

# 볼륨 포함하여 제거 (데이터 삭제)
docker-compose down -v
```

## Kubernetes 배포

### 1단계: 클러스터 설정

```bash
# 네임스페이스 생성
kubectl create namespace education-mobile

# 환경 변수를 Secret으로 저장
kubectl create secret generic education-secrets \
  --from-file=.env \
  -n education-mobile
```

### 2단계: 배포 파일 작성

`k8s/deployment.yaml` 생성:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: education-mobile
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: api-gateway:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: education-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: education-mobile
spec:
  selector:
    app: api-gateway
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: LoadBalancer
```

### 3단계: 배포 실행

```bash
# 배포 적용
kubectl apply -f k8s/

# 상태 확인
kubectl get pods -n education-mobile
kubectl get services -n education-mobile

# 로그 확인
kubectl logs -f deployment/api-gateway -n education-mobile
```

## CI/CD 파이프라인

### GitHub Actions 설정

CI/CD 파이프라인은 `.github/workflows/ci-cd.yml`에 정의되어 있습니다.

**자동으로 실행되는 단계:**
1. **코드 품질 검사** - ESLint, Prettier, 타입 체크
2. **테스트 실행** - 단위 테스트, 통합 테스트
3. **Docker 이미지 빌드** - 모든 서비스의 이미지 생성
4. **보안 스캔** - 취약점 검사
5. **배포** (main 브랜치만) - 프로덕션 배포

### Secrets 설정

GitHub Secrets에서 다음 값 설정:
- `DEPLOY_HOST`: 배포 서버 IP/도메인
- `DEPLOY_USER`: SSH 사용자명
- `DEPLOY_KEY`: SSH 개인 키
- `SLACK_WEBHOOK`: Slack 알림 (선택사항)

### 배포 트리거

```bash
# 자동으로 main에 merge되면 배포됨
# 또는 수동으로 GitHub Actions에서 실행 가능
```

## 모니터링 및 로깅

### Prometheus & Grafana

```bash
# Prometheus 접근
http://localhost:9090

# Grafana 접근
http://localhost:3012
# 기본 계정: admin / admin
```

### 대시보드 설정

1. Prometheus를 데이터 소스로 추가
2. 기본 대시보드 import
3. 커스텀 알림 규칙 설정

### ELK 스택 (로깅)

```bash
# Elasticsearch 설정 (docker-compose에 추가 권장)
docker run -d \
  --name elasticsearch \
  -e discovery.type=single-node \
  docker.elastic.co/elasticsearch/elasticsearch:8.0.0

# Kibana 접근
http://localhost:5601
```

## 보안 설정

### 1. SSL/TLS 인증서

```bash
# Let's Encrypt 인증서 생성
certbot certonly --standalone -d your-domain.com

# Nginx에 SSL 설정
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

### 2. 방화벽 규칙

```bash
# UFW 설정 (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. 환경 변수 보안

```bash
# 프로덕션 환경에서 .env 파일 보호
chmod 600 .env
sudo chown root:root .env

# AWS Secrets Manager 사용 (권장)
aws secretsmanager create-secret \
  --name education-mobile/config \
  --secret-string file://config.json
```

### 4. 데이터베이스 보안

```bash
# MongoDB 인증 활성화
mongod --auth

# 관리자 계정 생성
db.createUser({
  user: "admin",
  pwd: "strong_password",
  roles: ["root"]
})
```

## 트러블슈팅

### 문제: 포트가 이미 사용 중

```bash
# 포트 사용 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# 또는 docker-compose에서 포트 변경
ports:
  - "3001:3000"  # 3000 대신 3001 사용
```

### 문제: MongoDB 연결 실패

```bash
# MongoDB 상태 확인
docker-compose logs mongodb

# 데이터베이스 재초기화
docker-compose down -v
docker-compose up -d mongodb
```

### 문제: API 게이트웨이 에러

```bash
# 게이트웨이 로그 확인
docker-compose logs api-gateway

# 마이크로서비스 상태 확인
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Course Service
```

### 문제: 메모리 부족

```bash
# Docker 메모리 할당 증가
# Docker Desktop → Preferences → Resources
# 또는 docker-compose에서 제한 설정:
services:
  mongodb:
    deploy:
      resources:
        limits:
          memory: 1G
```

## 성능 최적화

### 1. 데이터베이스 인덱싱

```javascript
// MongoDB 인덱스 생성
db.courses.createIndex({ "title": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
db.enrollments.createIndex({ "userId": 1, "courseId": 1 })
```

### 2. 캐싱 전략

```javascript
// Redis 캐시 설정
// 1시간 TTL과 함께 코스 캐시
redis.setex("courses:all", 3600, JSON.stringify(courses))
```

### 3. CDN 설정

```nginx
# Nginx를 리버스 프록시로 사용
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 1h;
    proxy_pass http://api-gateway:3000;
}
```

## 추가 리소스

- [Docker 공식 문서](https://docs.docker.com/)
- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Node.js 베스트 프랙티스](https://nodejs.org/en/docs/guides/)
- [MongoDB 가이드](https://docs.mongodb.com/)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)

## 지원

문제가 발생하면:
1. 로그를 확인합니다: `docker-compose logs`
2. GitHub Issues에 보고합니다
3. 커뮤니티 포럼에서 도움을 요청합니다

---

**마지막 업데이트**: 2024년 11월
**버전**: 1.0.0
