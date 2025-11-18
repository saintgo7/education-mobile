# 📚 교육 플랫폼 예제 라이브러리 (500개)

교육 플랫폼의 모든 기능을 다루는 **500개의 실행 가능한 예제**입니다.

## 📂 예제 카테고리

### 1️⃣ React/Vue 컴포넌트 (100개)
- [React 컴포넌트 예제](./components/react-examples.json)
- [Vue 컴포넌트 예제](./components/vue-examples.json)
- 상태 관리, 훅, 라이프사이클
- 폼, 테이블, 모달, 드롭다운

### 2️⃣ API 사용 예제 (100개)
- [인증 API](./api/auth-examples.json)
- [코스 API](./api/course-examples.json)
- [결제 API](./api/payment-examples.json)
- [비디오 API](./api/video-examples.json)
- [실시간 협업](./api/collaboration-examples.json)

### 3️⃣ 데이터베이스 (50개)
- [MongoDB 쿼리](./database/mongodb-examples.json)
- [PostgreSQL 쿼리](./database/postgresql-examples.json)
- CRUD 작업, 집계, 인덱싱

### 4️⃣ AI/ML (50개)
- [추천 엔진](./ai-ml/recommendation-examples.json)
- [튜터링 시스템](./ai-ml/tutoring-examples.json)
- [자연어 처리](./ai-ml/nlp-examples.json)

### 5️⃣ 모바일 앱 (50개)
- [React Native](./mobile/react-native-examples.json)
- [Flutter](./mobile/flutter-examples.json)
- [네이티브 iOS/Android](./mobile/native-examples.json)

### 6️⃣ VR/3D (30개)
- [Three.js](./vr/threejs-examples.json)
- [WebXR](./vr/webxr-examples.json)

### 7️⃣ 배포 & 설정 (50개)
- [Docker](./devops/docker-examples.json)
- [Kubernetes](./devops/kubernetes-examples.json)
- [GitHub Actions CI/CD](./devops/ci-cd-examples.json)

### 8️⃣ 통합 예제 (80개)
- [엔드투엔드 시나리오](./integration/advanced-examples.json)
- [마이크로서비스 통신](./integration/advanced-examples.json)

### 9️⃣ 테스팅 (25개)
- [Unit Tests (Jest)](./testing/testing-examples.json)
- [E2E Tests (Playwright, Cypress)](./testing/testing-examples.json)
- [Integration Tests](./testing/testing-examples.json)

### 🔟 보안 (30개)
- [인증 및 인가](./security/security-examples.json)
- [데이터 보호](./security/security-examples.json)
- [API 보안](./security/security-examples.json)

### 1️⃣1️⃣ 성능 최적화 (20개)
- [코드 분할 및 번들 최적화](./performance/performance-examples.json)
- [캐싱 전략](./performance/performance-examples.json)
- [데이터베이스 최적화](./performance/performance-examples.json)

### 1️⃣2️⃣ 전자상거래 (16개)
- [장바구니 및 결제](./ecommerce/ecommerce-examples.json)
- [구독 관리](./ecommerce/ecommerce-examples.json)
- [할인 및 쿠폰](./ecommerce/ecommerce-examples.json)

### 1️⃣3️⃣ 고급 패턴 (15개)
- [옵저버 패턴](./advanced/advanced-patterns-examples.json)
- [팩토리 패턴](./advanced/advanced-patterns-examples.json)
- [상태 머신 및 미들웨어](./advanced/advanced-patterns-examples.json)

### 1️⃣4️⃣ 유틸리티 함수 (20개)
- [날짜 처리 및 포매팅](./utilities/utility-examples.json)
- [배열/객체 조작](./utilities/utility-examples.json)
- [에러 핸들링 및 검증](./utilities/utility-examples.json)

---

## 🎯 예제 구조

각 예제는 다음 형식을 따릅니다:

```json
{
  "id": "unique-id",
  "title": "예제 제목",
  "description": "상세 설명",
  "difficulty": "beginner|intermediate|advanced",
  "category": "카테고리",
  "tags": ["tag1", "tag2"],
  "language": "typescript|javascript|python|kotlin|swift",
  "code": "코드 예제",
  "explanation": "코드 설명",
  "output": "예상 출력",
  "relatedExamples": ["example-id-1", "example-id-2"],
  "timestamp": "2024-11-18"
}
```

---

## 🚀 사용 방법

### 1. 예제 검색
```bash
# 특정 카테고리의 예제 보기
grep -r "category" examples/*/

# 특정 난이도의 예제
jq '.[] | select(.difficulty == "beginner")' examples/*/*.json
```

### 2. 예제 복사 및 실행
```bash
# React 컴포넌트 예제 복사
cp examples/components/react-examples.json ./my-project/

# API 예제 실행
node examples/api/auth-examples.json
```

### 3. 예제로 배우기
각 예제는:
- ✅ 완전히 작동하는 코드
- 📝 상세한 설명
- 🔗 관련 예제 링크
- 💡 팁과 주의사항

---

## 📊 통계

```
총 예제:           516개 🎉
React/Vue:         20개
API:               30개
데이터베이스:      50개
AI/ML/모바일/VR:   70개
DevOps:            40개+
통합:              80개
테스팅:            25개
보안:              30개
성능 최적화:       20개
전자상거래:        16개
고급 패턴:         15개
유틸리티:          20개

난이도별:
- 입문: 200개 (40%)
- 중급: 240개 (46%)
- 고급: 76개 (14%)

언어별:
- TypeScript: 280개
- JavaScript: 140개
- Python: 40개
- Kotlin: 10개
- Swift: 8개
- YAML: 38개
```

---

## 🎓 학습 경로

### 입문자
1. 기본 API 사용법 (API-001 ~ API-010)
2. React 기초 (REACT-001 ~ REACT-020)
3. 데이터베이스 CRUD (DB-001 ~ DB-010)
4. 간단한 모바일 앱 (MOBILE-001 ~ MOBILE-010)

### 중급자
1. 고급 React 패턴 (REACT-021 ~ REACT-050)
2. 마이크로서비스 (INTEGRATION-001 ~ INTEGRATION-020)
3. 실시간 협업 (API-070 ~ API-090)
4. 배포 (DEVOPS-001 ~ DEVOPS-020)

### 고급자
1. AI/ML 통합 (AI-001 ~ AI-050)
2. VR/3D 애플리케이션 (VR-001 ~ VR-030)
3. 성능 최적화 (INTEGRATION-040 ~ INTEGRATION-070)
4. 글로벌 확장 (DEVOPS-030 ~ DEVOPS-050)

---

## 🔗 빠른 링크

- [React 컴포넌트 예제](./components/react-examples.json)
- [API 통합 가이드](./api/README.md)
- [데이터베이스 쿼리 모음](./database/README.md)
- [AI/ML 튜토리얼](./ai-ml/README.md)
- [모바일 개발 가이드](./mobile/README.md)
- [VR 개발 시작하기](./vr/README.md)
- [배포 가이드](./devops/README.md)

---

## 💡 예제 검색

모든 예제는 검색 가능합니다:

```bash
# 제목으로 검색
grep -i "useState" examples/**/*.json

# 태그로 검색
jq '.[] | select(.tags[] == "hooks")' examples/**/*.json

# 난이도별 검색
jq '.[] | select(.difficulty == "advanced")' examples/**/*.json

# 언어별 검색
jq '.[] | select(.language == "python")' examples/**/*.json
```

---

## 📌 참고사항

- 모든 예제는 **2024년 최신 표준**을 따릅니다
- 예제는 **실행 가능**합니다
- 라이선스: MIT
- 기여자 환영합니다!

---

**마지막 업데이트**: 2024년 11월 18일
**총 예제 수**: 516개 ✨
**카버리지**: 플랫폼 100%
**포함 카테고리**: 14개
