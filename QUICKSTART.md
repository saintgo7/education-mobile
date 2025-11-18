# 빠른 시작 가이드 (Quick Start Guide)

## 🚀 5분 안에 시작하기

### 1단계: 환경 확인

```bash
# Node.js 버전 확인
node --version  # v18+ 필요

# Git 확인
git --version

# Flutter 확인 (선택사항)
flutter --version
```

### 2단계: 첫 번째 프로젝트 실행

#### Option A: React Native Expo (가장 쉬움) ⭐ 추천

```bash
# 1. 프로젝트 폴더로 이동
cd react-native-expo

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm start

# 4. QR 코드를 Expo Go 앱으로 스캔
# - Android: Play Store에서 "Expo Go" 다운로드
# - iOS: App Store에서 "Expo Go" 다운로드
```

**결과**: 5-10분 내에 실제 기기에서 앱 실행 가능!

#### Option B: Flutter BLoC

```bash
# 1. 프로젝트 폴더로 이동
cd flutter-bloc

# 2. 의존성 설치
flutter pub get

# 3. 앱 실행
flutter run
```

**필요사항**: Android Studio 또는 Xcode 설치 필요

#### Option C: Backend 서버

```bash
# 1. MongoDB 실행 (Docker 사용)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 2. 백엔드 폴더로 이동
cd mobile-backend

# 3. 환경 변수 설정
cp .env.example .env

# 4. 의존성 설치
npm install

# 5. 서버 시작
npm run dev

# 6. 브라우저에서 테스트
# http://localhost:3000/health
```

## 📱 프로젝트 선택 가이드

### 초보자라면?
→ **React Native Expo**부터 시작하세요!
- 설정이 가장 쉬움
- 실제 기기에서 바로 테스트 가능
- 완전히 구현된 예제

### Flutter를 배우고 싶다면?
→ **Flutter BLoC** 프로젝트
- BLoC 패턴 학습
- Firebase 통합 예제
- 상태 관리 베스트 프랙티스

### 백엔드 개발자라면?
→ **Mobile Backend** 프로젝트
- REST API 구현
- JWT 인증
- MongoDB 연동

### 네이티브 개발에 관심있다면?
→ **Kotlin Android** 또는 **Swift iOS**
- 각 플랫폼의 최신 기술 스택
- 네이티브 코드 작성
- 플랫폼 특화 기능

## 🎯 다음 단계

### 완성된 프로젝트 3개 탐색 (1-2일)
1. ✅ React Native Expo - 코드 읽기 및 실행
2. ✅ Flutter BLoC - BLoC 패턴 이해
3. ✅ Mobile Backend - API 테스트

### 템플릿 프로젝트 선택 및 구현 (1-2주)
4. 관심있는 템플릿 선택
5. README 가이드 따라 구현
6. 커스터마이징

### 통합 및 배포 (1주)
7. Frontend + Backend 연동
8. Firebase/푸시 알림 설정
9. 앱 빌드 및 테스트

## 💡 유용한 명령어

### React Native Expo
```bash
npm start          # 개발 서버 시작
npm run android    # Android 에뮬레이터
npm run ios        # iOS 시뮬레이터 (macOS만)
npm start -- --reset-cache  # 캐시 초기화
```

### Flutter
```bash
flutter run        # 앱 실행
flutter clean      # 빌드 캐시 삭제
flutter pub get    # 의존성 설치
flutter doctor     # 환경 확인
```

### Mobile Backend
```bash
npm run dev        # 개발 모드
npm start          # 프로덕션 모드
npm test           # 테스트 실행
```

## 🆘 문제 해결

### "command not found" 에러
→ Node.js, Flutter SDK가 PATH에 추가되었는지 확인

### Metro bundler 에러
```bash
cd react-native-expo
npm start -- --reset-cache
```

### Flutter 빌드 에러
```bash
flutter clean
flutter pub get
flutter run
```

### MongoDB 연결 에러
```bash
# Docker로 MongoDB 실행 확인
docker ps

# 또는 로컬 MongoDB 실행
mongod
```

## 📚 추가 리소스

- 각 프로젝트의 `README.md` - 상세한 설명
- `PROJECTS_OVERVIEW.md` - 전체 프로젝트 개요
- `docs/ko/SETUP.md` - 환경 설정 가이드
- 메인 `README.md` - 프로젝트 소개

## 🤝 도움 받기

1. 각 프로젝트 폴더의 README.md 확인
2. GitHub Issues 검색
3. 공식 문서 참조:
   - [React Native](https://reactnative.dev/)
   - [Flutter](https://flutter.dev/)
   - [Expo](https://docs.expo.dev/)

---

**시작할 준비가 되셨나요? 위의 "2단계"로 돌아가서 첫 번째 프로젝트를 실행해보세요!** 🚀
