# 모바일 개발 교육 저장소 설치 가이드

## 목차
1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트별 설치 가이드](#프로젝트별-설치-가이드)
3. [문제 해결](#문제-해결)

## 개발 환경 설정

### 공통 요구사항

#### 1. Node.js 설치
```bash
# Node.js 18 LTS 버전 권장
# https://nodejs.org/ 에서 다운로드
node --version  # v18.0.0 이상 확인
npm --version
```

#### 2. Git 설치
```bash
git --version
```

#### 3. 코드 에디터
- Visual Studio Code 권장: https://code.visualstudio.com/

### React Native 프로젝트 환경 설정

#### Android 개발 환경

1. **Java Development Kit (JDK) 설치**
```bash
# JDK 11 설치
java -version  # 버전 확인
```

2. **Android Studio 설치**
- https://developer.android.com/studio 에서 다운로드
- Android SDK, Android SDK Platform, Android Virtual Device 설치

3. **환경 변수 설정**
```bash
# Linux/Mac (~/.bashrc 또는 ~/.zshrc에 추가)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows (시스템 환경 변수)
ANDROID_HOME=C:\Users\사용자명\AppData\Local\Android\Sdk
```

#### iOS 개발 환경 (macOS만 해당)

1. **Xcode 설치**
- App Store에서 Xcode 설치 (14.0 이상)

2. **CocoaPods 설치**
```bash
sudo gem install cocoapods
pod --version
```

3. **Command Line Tools 설치**
```bash
xcode-select --install
```

### Flutter 환경 설정

1. **Flutter SDK 다운로드**
```bash
# https://flutter.dev/docs/get-started/install
# 다운로드 후 압축 해제

# 환경 변수 추가
export PATH="$PATH:`pwd`/flutter/bin"

# 설치 확인
flutter doctor
```

2. **Flutter Doctor 실행**
```bash
flutter doctor
# 체크되지 않은 항목 해결
```

### Kotlin/Android 환경 설정

1. **Android Studio 설치** (위 Android 개발 환경 참조)
2. **Kotlin 플러그인** (Android Studio에 기본 포함)

### Swift/iOS 환경 설정

1. **Xcode 설치** (위 iOS 개발 환경 참조)
2. **SwiftUI 지원 확인** (Xcode 11 이상)

### Ionic 환경 설정

```bash
# Ionic CLI 설치
npm install -g @ionic/cli

# Capacitor CLI 설치
npm install -g @capacitor/cli

# 버전 확인
ionic --version
```

## 프로젝트별 설치 가이드

### 1. React Native Expo

```bash
cd react-native-expo

# 의존성 설치
npm install

# Expo 앱 실행
npm start

# Android 에뮬레이터에서 실행
npm run android

# iOS 시뮬레이터에서 실행 (macOS만)
npm run ios
```

**주요 기능:**
- 5개 이상의 화면
- React Navigation v6
- Redux Toolkit 상태 관리
- API 연동
- 인증 플로우
- AsyncStorage 로컬 저장소

### 2. Flutter BLoC

```bash
cd flutter-bloc

# 의존성 설치
flutter pub get

# 앱 실행
flutter run

# Android에서 실행
flutter run -d android

# iOS에서 실행 (macOS만)
flutter run -d ios
```

**주요 기능:**
- BLoC 패턴 상태 관리
- Firebase 연동
- 인증 시스템
- Firestore 데이터베이스
- 푸시 알림

### 3. Kotlin Android

```bash
cd kotlin-android

# Android Studio에서 프로젝트 열기
# Gradle 동기화 자동 실행

# 명령줄에서 빌드
./gradlew build

# 앱 실행
./gradlew installDebug
```

**주요 기능:**
- Jetpack Compose UI
- MVVM 아키텍처
- Room 데이터베이스
- Retrofit API 연동
- Hilt 의존성 주입

### 4. Swift iOS

```bash
cd swift-ios

# CocoaPods 의존성 설치
pod install

# Xcode에서 .xcworkspace 파일 열기
open *.xcworkspace

# Xcode에서 실행 (Command + R)
```

**주요 기능:**
- SwiftUI 인터페이스
- Core Data 로컬 저장소
- Combine 프레임워크
- MVVM 패턴
- URLSession API 연동

### 5. Ionic Hybrid

```bash
cd ionic-hybrid

# 의존성 설치
npm install

# 웹 브라우저에서 실행
ionic serve

# Android 빌드
ionic cap build android

# iOS 빌드 (macOS만)
ionic cap build ios
```

**주요 기능:**
- Angular 프레임워크
- Capacitor 네이티브 플러그인
- Ionic UI 컴포넌트
- 크로스 플랫폼 개발

### 6. React Native CLI

```bash
cd react-native-cli

# 의존성 설치
npm install

# iOS Pods 설치 (macOS만)
cd ios && pod install && cd ..

# Metro 번들러 시작
npm start

# Android 실행
npm run android

# iOS 실행 (macOS만)
npm run ios
```

**주요 기능:**
- Bare React Native 설정
- 커스텀 네이티브 모듈
- React Navigation
- Context API

### 7. Flutter Riverpod

```bash
cd flutter-riverpod

# 의존성 설치
flutter pub get

# 코드 생성 (필요시)
flutter pub run build_runner build

# 앱 실행
flutter run
```

**주요 기능:**
- Riverpod 상태 관리
- Dio HTTP 클라이언트
- 의존성 주입
- 코드 생성

### 8. Cross-Platform UI

```bash
cd cross-platform-ui

# 의존성 설치
npm install

# Storybook 실행
npm run storybook

# 라이브러리 빌드
npm run build
```

**주요 기능:**
- 재사용 가능한 컴포넌트
- 디자인 시스템
- Storybook 문서화

### 9. Mobile Backend

```bash
cd mobile-backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# MongoDB 연결 설정
# .env에서 MONGODB_URI 설정

# 서버 실행
npm run dev

# 프로덕션 실행
npm start
```

**주요 기능:**
- Express.js REST API
- MongoDB 데이터베이스
- JWT 인증
- API 문서화

### 10. Push Notifications

```bash
cd push-notifications

# 의존성 설치
npm install

# Firebase 설정
# 1. Firebase Console에서 프로젝트 생성
# 2. google-services.json (Android) 다운로드
# 3. GoogleService-Info.plist (iOS) 다운로드

# 서버 실행
npm run dev
```

**주요 기능:**
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNS)
- 푸시 알림 서버
- 토큰 관리

## 문제 해결

### React Native 관련

**문제: Metro bundler 에러**
```bash
# 캐시 삭제
npm start -- --reset-cache
```

**문제: Android 빌드 실패**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Flutter 관련

**문제: 패키지 충돌**
```bash
flutter clean
flutter pub get
```

**문제: iOS 빌드 에러**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### 일반적인 문제

**문제: Node modules 에러**
```bash
rm -rf node_modules
npm install
```

**문제: 권한 에러 (Linux/Mac)**
```bash
sudo chown -R $USER:$USER .
```

## 추가 리소스

- [React Native 공식 문서](https://reactnative.dev/)
- [Flutter 공식 문서](https://flutter.dev/)
- [Android 개발자 가이드](https://developer.android.com/)
- [iOS 개발자 문서](https://developer.apple.com/)

## 지원

문제가 발생하면:
1. 각 프로젝트의 README.md 확인
2. GitHub Issues 검색
3. 새 Issue 생성
