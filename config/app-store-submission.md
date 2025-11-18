# 모바일 앱 출시 준비 가이드

## 📱 App Store & Google Play 제출 체크리스트

### 1. iOS App Store 제출 준비

#### 개발 환경 설정
```bash
# Xcode 최신 버전 설치
xcode-select --install

# CocoaPods 설치
sudo gem install cocoapods

# Pod 설정
cd ios
pod install
```

#### 앱 번들 ID 설정
```
Bundle ID: com.educationmobile.app
Display Name: Education Platform
Version: 1.0.0
Build: 1
```

#### 앱 아이콘 준비
```
- 1024x1024px 아이콘 (메인)
- App Icon Set (AppIcon.appiconset)
- 최소 PNG 형식
- RGB 색상 공간 (투명도 없음)
```

#### 스크린샷 준비
```
- 5.5" (iPhone 8 Plus): 1242x2208px
- 6.5" (iPhone 11 Pro Max): 1284x2778px
- iPad 12.9" (3rd gen): 2048x2732px
- 각 기기당 2-10개 스크린샷
```

#### App Store Connect 설정
```
1. App ID 생성
2. Bundle ID 등록
3. Capabilities 설정
   - Push Notifications
   - In-App Purchases
   - HealthKit (if needed)
4. Certificate 생성
5. Provisioning Profile 생성
```

#### 앱 스토어 메타데이터
```
앱 이름: Education Platform
부제목: Learn Anything, Anywhere
설명: Comprehensive online learning platform with AI-powered recommendations
키워드: education, learning, online courses, e-learning, skill development
카테고리: Education
등급: 4+ (또는 12+, 17+ 필요시)
```

#### 개인정보 보호 정책 URL
```
https://educationmobile.com/privacy
```

#### TestFlight 베타 테스팅
```bash
# Build for TestFlight
cd ios
xcodebuild -workspace Education.xcworkspace \
  -scheme Education \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/Education.xcarchive archive

# Upload to TestFlight
xcodebuild -exportArchive \
  -archivePath build/Education.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath build/
```

### 2. Google Play Store 제출 준비

#### Android 개발 환경
```bash
# Android Studio 설치
# SDK 설정:
- compileSdkVersion: 33
- targetSdkVersion: 33
- minSdkVersion: 21

# Build 생성
cd android
./gradlew bundleRelease
```

#### 앱 서명
```bash
# Keystore 생성 (처음 한번만)
keytool -genkey -v -keystore education-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias educationkey

# Build 서명
./gradlew signingConfig
```

#### 앱 아이콘 & 이미지
```
- Launcher Icon: 512x512px (PNG)
- Playstore Feature Graphic: 1024x500px
- 스크린샷: 1080x1920px (최소 2개, 최대 8개)
- 앱 미리보기 동영상 (선택사항)
```

#### Google Play Console 설정
```
1. Google Play Developer 계정 생성 ($25 일회)
2. 새 앱 생성
3. 앱 분류 및 콘텐츠 등급 설정
4. Privacy Policy 작성 및 제출
5. 가격 및 배포 설정
```

#### 앱 스토어 최적화 (ASO)
```
앱 제목: Education Platform - Learn Anything
짧은 설명: AI-powered personalized learning
전체 설명:
"Master new skills with our comprehensive platform:
✓ 1000+ expert-led courses
✓ AI-powered recommendations
✓ Real-time collaboration
✓ Offline access
✓ Global community"

카테고리: Education
콘텐츠 등급: Everyone
```

### 3. 공통 요구사항

#### 개인정보 보호 & 보안
```
- GDPR 준수
- COPPA 준수 (13세 이하 유저)
- 데이터 암호화
- 안전한 API 통신 (HTTPS)
- 개인정보 처리 정책 명시

필수 권한:
- Camera (비디오 통화용)
- Microphone (오디오용)
- Photos/Media (콘텐츠 업로드용)
- Location (선택사항)
```

#### 성능 요구사항
```
- 최소 30fps 유지
- 앱 시작: < 2초
- 스크린 전환: < 500ms
- 메모리 사용: < 150MB
- 배터리 효율성 최적화
```

#### 테스트 체크리스트
```
✓ 모든 기기에서 테스트 (iPhone SE ~ 12 Pro Max)
✓ 모든 iOS 버전 테스트 (iOS 14 이상)
✓ 모든 Android 버전 테스트 (Android 5.1 이상)
✓ 네트워크 변경 테스트 (Wi-Fi ↔ 모바일 데이터)
✓ 오프라인 모드 테스트
✓ 메모리 누수 테스트
✓ 배터리 소비 테스트
✓ 크래시 로그 분석
```

### 4. 버전 관리 & 업데이트 전략

#### 버전 번호 규칙
```
Major.Minor.Patch (e.g., 1.2.3)

1.0.0: 초기 출시
1.1.0: 새 기능 추가
1.1.1: 버그 수정
2.0.0: 주요 업데이트
```

#### 배포 전략
```
Staged Rollout:
- 1% 배포 (24시간)
- 5% 배포 (48시간)
- 25% 배포 (72시간)
- 100% 배포

이렇게 하면 문제 발생 시 빠르게 대응 가능
```

#### 크래시 모니터링
```
Firebase Crashlytics 설정:
```bash
# iOS (Podfile)
pod 'Firebase/Crashlytics'

# Android (build.gradle)
implementation 'com.google.firebase:firebase-crashlytics'
```

실시간 모니터링 대시보드:
- 크래시율 추적
- 스택 트레이스 분석
- 영향받는 사용자 수
- 버전별 분석
```

### 5. 마케팅 & 홍보

#### 출시 전 준비
```
- 소셜 미디어 계정 생성
- 앱 로고 & 브래닝 준비
- 보도 자료 작성
- 인플루언서 협력
- 미디어 요청 준비
```

#### 출시 후 마케팅
```
- App Store Optimization (ASO) 지속
- 리뷰 & 평점 관리
- 사용자 피드백 수집
- 정기적 업데이트
- 광고 캠페인
```

### 6. 배포 타임라인

```
Week 1: 개발 완성 & 베타 테스팅
Week 2: TestFlight/Beta 배포
Week 3: 피드백 수집 & 개선
Week 4: App Store/Play Store 제출
Week 5: 검수 & 승인
Week 6: 공식 출시
```

### 7. 예상 비용

```
iOS:
- Apple Developer 계정: $99/년
- 개발 도구 & 라이브러리: $0-500

Android:
- Google Play Developer 계정: $25 (일회)
- 개발 도구: $0

앱 증대:
- 광고 캠페인: $1,000-10,000+
- PR & 마케팅: $2,000-5,000
```

### 8. 출시 후 관리

#### 모니터링
```
- 일일 활성 사용자 (DAU)
- 월간 활성 사용자 (MAU)
- 크래시율
- 평균 세션 시간
- 유지율 (Retention)
```

#### 정기 업데이트 계획
```
- 월 1회: 새 기능 추가
- 주 1회: 버그 수정 & 개선
- 즉시: 심각한 버그 수정
```

#### 사용자 피드백 관리
```
- App Store 리뷰 모니터링
- Play Store 리뷰 모니터링
- 사용자 지원 이메일 대응
- 커뮤니티 포럼 관리
```

### 9. 법적 준수사항

```
✓ 이용약관 작성
✓ 개인정보 처리 정책
✓ 쿠키 정책
✓ GDPR 준수 (유럽)
✓ CCPA 준수 (캘리포니아)
✓ 각 국가 규정 확인
```

## 📋 최종 체크리스트

- [ ] 앱 개발 완료
- [ ] 모든 버그 수정
- [ ] 성능 최적화 완료
- [ ] 아이콘 & 스크린샷 준비
- [ ] 메타데이터 작성
- [ ] 개인정보 보호 정책 준비
- [ ] TestFlight/Beta 배포
- [ ] 베타 테스팅 완료
- [ ] App Store/Play Store 계정 생성
- [ ] 앱 서명 설정
- [ ] 최종 제출
- [ ] 검수 대기
- [ ] 승인 후 출시

---

**예상 출시 일정**: 4-6주
**필요 비용**: $500-3,000 (마케팅 제외)
