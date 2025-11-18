# 프로젝트 개요 및 학습 가이드

## 완성된 프로젝트 (Complete Projects)

### 1. ✅ React Native Expo (완료)
**위치**: `react-native-expo/`
**상태**: 완전히 구현됨
**주요 기능**:
- 8개의 완전한 화면 (로그인, 회원가입, 홈, 상품, 프로필 등)
- Redux Toolkit 상태 관리
- React Navigation (Stack + Tabs)
- AsyncStorage 로컬 저장소
- Axios API 연동
- 인증 플로우
- 푸시 알림 설정

**실행 방법**:
```bash
cd react-native-expo
npm install
npm start
```

### 2. ✅ Flutter BLoC (완료)
**위치**: `flutter-bloc/`
**상태**: 완전히 구현됨
**주요 기능**:
- BLoC 패턴 상태 관리 (AuthBloc, ProductsBloc)
- Firebase 인증 연동
- Cloud Firestore 데이터베이스
- 5개의 화면
- Repository 패턴
- Equatable을 사용한 상태 비교

**실행 방법**:
```bash
cd flutter-bloc
flutter pub get
flutter run
```

### 3. ✅ Mobile Backend (완료)
**위치**: `mobile-backend/`
**상태**: 완전히 구현됨
**주요 기능**:
- Express.js REST API
- MongoDB + Mongoose
- JWT 인증
- 사용자 관리
- 상품 CRUD
- 푸시 알림 API
- 완전한 API 문서화

**실행 방법**:
```bash
cd mobile-backend
npm install
npm run dev
```

## 학습용 템플릿 프로젝트 (Template Projects)

다음 프로젝트들은 시작 구조와 상세한 가이드가 포함되어 있습니다:

### 4. 📱 Kotlin Android (템플릿)
**위치**: `kotlin-android/`
**학습 포인트**:
- Jetpack Compose UI
- MVVM 아키텍처
- Room 데이터베이스
- Retrofit API
- Hilt 의존성 주입

### 5. 🍎 Swift iOS (템플릿)
**위치**: `swift-ios/`
**학습 포인트**:
- SwiftUI 인터페이스
- Core Data 로컬 저장소
- Combine 프레임워크
- MVVM 패턴
- URLSession API

### 6. ⚡ Ionic Hybrid (템플릿)
**위치**: `ionic-hybrid/`
**학습 포인트**:
- Angular + Ionic
- Capacitor 네이티브 플러그인
- 크로스 플랫폼 개발

### 7. ⚛️ React Native CLI (템플릿)
**위치**: `react-native-cli/`
**학습 포인트**:
- Bare React Native
- 커스텀 네이티브 모듈
- 네이티브 코드 연동

### 8. 🎯 Flutter Riverpod (템플릿)
**위치**: `flutter-riverpod/`
**학습 포인트**:
- Riverpod 상태 관리
- 코드 생성
- 의존성 주입

### 9. 🎨 Cross-Platform UI (템플릿)
**위치**: `cross-platform-ui/`
**학습 포인트**:
- 재사용 가능한 컴포넌트
- 디자인 시스템
- Storybook

### 10. 🔔 Push Notifications (템플릿)
**위치**: `push-notifications/`
**학습 포인트**:
- FCM 설정
- APNS 설정
- 통합 푸시 서비스

## 학습 경로 추천

### 초급 (Beginner)
1. **React Native Expo** 프로젝트 실행 및 코드 분석
2. **Mobile Backend** 서버 실행 및 API 테스트
3. Expo 프로젝트와 Backend 연동 확인

### 중급 (Intermediate)
4. **Flutter BLoC** 프로젝트 실행 및 BLoC 패턴 학습
5. Firebase 설정 및 연동
6. 템플릿 프로젝트 중 하나 선택하여 구현 시작

### 고급 (Advanced)
7. Native 프로젝트 (Kotlin/Swift) 구현
8. 커스텀 네이티브 모듈 개발
9. 완전한 푸시 알림 시스템 구축

## 프로젝트별 시간 투자 예상

| 프로젝트 | 학습 시간 | 구현 시간 | 총계 |
|---------|----------|----------|------|
| React Native Expo | 2-3일 | 완료됨 | 2-3일 |
| Flutter BLoC | 2-3일 | 완료됨 | 2-3일 |
| Mobile Backend | 1-2일 | 완료됨 | 1-2일 |
| Kotlin Android | 3-4일 | 3-5일 | 6-9일 |
| Swift iOS | 3-4일 | 3-5일 | 6-9일 |
| Ionic Hybrid | 2-3일 | 2-3일 | 4-6일 |
| React Native CLI | 2-3일 | 2-3일 | 4-6일 |
| Flutter Riverpod | 2-3일 | 2-3일 | 4-6일 |
| Cross-Platform UI | 1-2일 | 2-3일 | 3-5일 |
| Push Notifications | 2-3일 | 3-4일 | 5-7일 |

## 다음 단계

1. 완성된 프로젝트 3개를 먼저 실행하고 분석하세요
2. 각 프로젝트의 README.md를 자세히 읽으세요
3. 템플릿 프로젝트 중 관심있는 것을 선택하여 구현하세요
4. `/docs/ko/SETUP.md`에서 환경 설정 가이드를 확인하세요

## 추가 리소스

- 각 프로젝트 폴더의 `README.md`
- `/docs/ko/` - 한국어 문서
- `/docs/en/` - 영어 문서
- 메인 `README.md` - 프로젝트 전체 개요
