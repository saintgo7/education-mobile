# Flutter BLoC 교육 프로젝트

Flutter BLoC 패턴과 Firebase를 사용한 완전한 모바일 애플리케이션 교육 프로젝트입니다.

## 📱 주요 기능

### BLoC 패턴 구현
- **AuthBloc** - 인증 상태 관리
- **ProductsBloc** - 상품 데이터 관리
- **Event-Driven Architecture** - 이벤트 기반 아키텍처

### Firebase 통합
- **Firebase Authentication** - 이메일/비밀번호 인증
- **Cloud Firestore** - 실시간 데이터베이스
- **Firebase Messaging** - 푸시 알림

### 화면 구성
1. 로그인 화면
2. 회원가입 화면
3. 홈 화면
4. 상품 목록
5. 프로필

## 🚀 시작하기

### 사전 요구사항
- Flutter SDK 3.0 이상
- Dart SDK
- Firebase 프로젝트
- Android Studio / Xcode

### 설치 방법

1. **의존성 설치**
```bash
cd flutter-bloc
flutter pub get
```

2. **Firebase 설정**
- Firebase Console에서 프로젝트 생성
- Android용 `google-services.json` 다운로드 후 `android/app/`에 추가
- iOS용 `GoogleService-Info.plist` 다운로드 후 `ios/Runner/`에 추가

3. **앱 실행**
```bash
flutter run
```

## 📁 프로젝트 구조

```
flutter-bloc/
├── lib/
│   ├── blocs/              # BLoC 상태 관리
│   │   ├── auth/
│   │   │   ├── auth_bloc.dart
│   │   │   ├── auth_event.dart
│   │   │   └── auth_state.dart
│   │   └── products/
│   │       ├── products_bloc.dart
│   │       ├── products_event.dart
│   │       └── products_state.dart
│   ├── models/             # 데이터 모델
│   │   ├── user.dart
│   │   └── product.dart
│   ├── repositories/       # 데이터 레이어
│   │   ├── auth_repository.dart
│   │   └── products_repository.dart
│   ├── screens/            # UI 화면
│   │   ├── auth/
│   │   ├── home/
│   │   ├── products/
│   │   └── profile/
│   └── main.dart
└── pubspec.yaml
```

## 🔧 기술 스택

- **Flutter** - UI 프레임워크
- **flutter_bloc** - BLoC 상태 관리
- **firebase_core** - Firebase 초기화
- **firebase_auth** - Firebase 인증
- **cloud_firestore** - Firestore 데이터베이스
- **equatable** - 값 비교

## 💡 BLoC 패턴

### Event
```dart
abstract class AuthEvent extends Equatable {}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;
}
```

### State
```dart
abstract class AuthState extends Equatable {}

class AuthAuthenticated extends AuthState {
  final User user;
}
```

### BLoC
```dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthInitial()) {
    on<AuthLoginRequested>(_onAuthLoginRequested);
  }
}
```

## 🔥 Firebase 설정

### Android
`android/app/build.gradle`에 추가:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### iOS
`ios/Podfile`에서 최소 버전 설정:
```ruby
platform :ios, '12.0'
```

## 📚 학습 리소스

- [Flutter BLoC 공식 문서](https://bloclibrary.dev/)
- [Firebase Flutter 가이드](https://firebase.google.com/docs/flutter/setup)
- [Equatable 패키지](https://pub.dev/packages/equatable)

## 📄 라이센스

MIT License
