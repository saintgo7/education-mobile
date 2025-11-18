# React Native Expo 교육 프로젝트

React Native와 Expo를 사용한 완전한 모바일 애플리케이션 교육 프로젝트입니다.

## 📱 주요 기능

### 화면 구성 (8개 화면)
1. **로그인 화면** - 이메일/비밀번호 로그인
2. **회원가입 화면** - 새 계정 생성
3. **비밀번호 찾기** - 비밀번호 재설정
4. **홈 화면** - 대시보드 및 추천 상품
5. **상품 목록** - 검색 및 필터링
6. **상품 상세** - 제품 정보 및 구매
7. **프로필** - 사용자 정보 및 활동 내역
8. **설정** - 앱 설정 및 환경설정

### 구현된 기능
- ✅ **React Navigation** - 스택 및 탭 네비게이션
- ✅ **Redux Toolkit** - 전역 상태 관리
- ✅ **AsyncStorage** - 로컬 데이터 저장
- ✅ **Axios** - HTTP API 통신
- ✅ **인증 시스템** - 로그인/로그아웃/회원가입
- ✅ **푸시 알림** - Expo Notifications 연동
- ✅ **Splash Screen** - 앱 시작 화면
- ✅ **App Icon** - 커스텀 아이콘 설정

## 🚀 시작하기

### 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn
- Expo CLI (선택사항)
- Android Studio (Android 개발) 또는 Xcode (iOS 개발, macOS만)

### 설치 방법

1. **의존성 설치**
```bash
cd react-native-expo
npm install
```

2. **개발 서버 시작**
```bash
npm start
```

3. **Android에서 실행**
```bash
npm run android
```

4. **iOS에서 실행** (macOS만)
```bash
npm run ios
```

5. **웹에서 실행**
```bash
npm run web
```

### Expo Go 앱 사용
1. 스마트폰에 Expo Go 앱 설치
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

2. `npm start` 실행 후 QR 코드 스캔

## 📁 프로젝트 구조

```
react-native-expo/
├── App.js                      # 앱 진입점
├── app.json                    # Expo 설정
├── package.json                # 의존성 관리
│
├── src/
│   ├── navigation/             # 네비게이션 설정
│   │   ├── RootNavigator.js    # 루트 네비게이터
│   │   ├── AuthNavigator.js    # 인증 스택
│   │   └── MainNavigator.js    # 메인 탭 네비게이터
│   │
│   ├── redux/                  # Redux 상태 관리
│   │   ├── store.js            # Redux store
│   │   └── slices/             # Redux slices
│   │       ├── authSlice.js    # 인증 상태
│   │       ├── userSlice.js    # 사용자 상태
│   │       └── productsSlice.js # 상품 상태
│   │
│   ├── screens/                # 화면 컴포넌트
│   │   ├── LoadingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ProductsScreen.js
│   │   ├── ProductDetailScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   │
│   ├── services/               # API 서비스
│   │   └── api.js              # Axios 설정 및 API 호출
│   │
│   ├── components/             # 재사용 가능한 컴포넌트
│   ├── utils/                  # 유틸리티 함수
│   └── assets/                 # 이미지, 폰트 등
│
└── assets/                     # Expo 에셋
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

## 🔧 기술 스택

### 핵심 라이브러리
- **React Native** 0.72.6 - 모바일 프레임워크
- **Expo** ~49.0.15 - 개발 플랫폼
- **React Navigation** 6.x - 네비게이션
- **Redux Toolkit** 1.9.7 - 상태 관리
- **React Redux** 8.1.3 - React-Redux 바인딩
- **Axios** 1.6.2 - HTTP 클라이언트
- **AsyncStorage** 1.19.5 - 로컬 저장소

### UI 컴포넌트
- **React Native Components** - 기본 UI 컴포넌트
- **Ionicons** - 아이콘 (Expo 내장)

## 💡 주요 학습 포인트

### 1. Redux Toolkit 상태 관리
```javascript
// authSlice.js 예시
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await authAPI.login(email, password);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
  },
});
```

### 2. React Navigation 사용
```javascript
// Navigation 예시
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
```

### 3. AsyncStorage 사용
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 저장
await AsyncStorage.setItem('token', token);

// 읽기
const token = await AsyncStorage.getItem('token');

// 삭제
await AsyncStorage.removeItem('token');
```

### 4. Axios API 호출
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor로 토큰 자동 추가
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🔐 인증 플로우

1. **로그인**
   - 이메일/비밀번호 입력
   - API 호출 → JWT 토큰 받기
   - AsyncStorage에 토큰 저장
   - Redux 상태 업데이트
   - 메인 화면으로 이동

2. **자동 로그인**
   - 앱 시작 시 AsyncStorage에서 토큰 확인
   - 토큰이 있으면 자동 로그인
   - 없으면 로그인 화면 표시

3. **로그아웃**
   - AsyncStorage에서 토큰 삭제
   - Redux 상태 초기화
   - 로그인 화면으로 이동

## 🎨 커스터마이징

### 앱 아이콘 및 스플래시 변경
1. `assets/icon.png` - 앱 아이콘 (1024x1024)
2. `assets/splash.png` - 스플래시 화면 (1242x2436)
3. `assets/adaptive-icon.png` - Android 적응형 아이콘 (1024x1024)

### 테마 색상 변경
주요 색상은 각 화면의 StyleSheet에서 수정 가능:
- 기본 색상: `#007AFF` (iOS 블루)
- 배경색: `#f5f5f5`
- 텍스트: `#333`

### API 엔드포인트 변경
`src/services/api.js` 파일에서 `API_BASE_URL` 수정:
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## 📱 빌드 및 배포

### Android APK 빌드
```bash
expo build:android
```

### iOS IPA 빌드 (macOS + Apple Developer Account 필요)
```bash
expo build:ios
```

### EAS Build 사용 (권장)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🐛 문제 해결

### Metro bundler 캐시 문제
```bash
npm start -- --reset-cache
```

### Android 빌드 실패
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS 빌드 실패 (macOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### 패키지 충돌
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 추가 학습 자료

- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [React Navigation 가이드](https://reactnavigation.org/)
- [Redux Toolkit 문서](https://redux-toolkit.js.org/)

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 개선 사항이나 버그를 발견하시면 이슈를 등록해주세요.

## 📄 라이센스

MIT License

---

## 한국어 상세 가이드

### API 연동 가이드

백엔드 서버가 필요합니다. `mobile-backend` 프로젝트를 먼저 실행하세요:

```bash
cd ../mobile-backend
npm install
npm run dev
```

그 다음 이 앱에서 API 엔드포인트를 설정하세요.

### 푸시 알림 설정

1. Firebase 프로젝트 생성
2. `google-services.json` (Android) 다운로드
3. `GoogleService-Info.plist` (iOS) 다운로드
4. 파일들을 프로젝트에 추가

자세한 내용은 `/docs/ko/SETUP.md`를 참조하세요.
