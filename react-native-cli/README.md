# React Native CLI - Bare React Native 교육 프로젝트

React Native CLI를 사용한 네이티브 모듈 통합 프로젝트입니다.

## 📱 프로젝트 개요

Expo 없이 순수 React Native로 개발하며, 커스텀 네이티브 모듈을 작성합니다.

### 주요 차이점: Expo vs CLI

| 특징 | Expo | React Native CLI |
|------|------|------------------|
| 초기 설정 | 쉬움 | 복잡함 |
| 네이티브 코드 | 제한적 | 완전한 접근 |
| 빌드 | 클라우드 | 로컬 |
| 커스텀 모듈 | 어려움 | 자유로움 |

## 🚀 시작하기

### 프로젝트 생성

```bash
# React Native CLI 설치
npm install -g react-native-cli

# 새 프로젝트 생성
npx react-native@latest init MobileEducation

cd MobileEducation

# iOS 실행
npx react-native run-ios

# Android 실행
npx react-native run-android
```

## 🔧 네이티브 모듈 만들기

### Android 네이티브 모듈

```java
// android/app/src/main/java/com/mobileeducation/DeviceInfoModule.java
package com.mobileeducation;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class DeviceInfoModule extends ReactContextBaseJavaModule {
    DeviceInfoModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DeviceInfo";
    }

    @ReactMethod
    public void getDeviceName(Promise promise) {
        try {
            String deviceName = android.os.Build.MODEL;
            promise.resolve(deviceName);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
}
```

### iOS 네이티브 모듈

```objc
// ios/DeviceInfo.h
#import <React/RCTBridgeModule.h>

@interface DeviceInfo : NSObject <RCTBridgeModule>
@end

// ios/DeviceInfo.m
#import "DeviceInfo.h"
#import <UIKit/UIKit.h>

@implementation DeviceInfo

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getDeviceName:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *deviceName = [[UIDevice currentDevice] name];
  resolve(deviceName);
}

@end
```

### JavaScript에서 사용

```typescript
import { NativeModules } from 'react-native';

const { DeviceInfo } = NativeModules;

const getDeviceName = async () => {
  try {
    const name = await DeviceInfo.getDeviceName();
    console.log('Device:', name);
  } catch (e) {
    console.error(e);
  }
};
```

## 📁 프로젝트 구조

```
MobileEducation/
├── android/                 # Android 네이티브 코드
├── ios/                     # iOS 네이티브 코드
├── src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   └── native-modules/      # 네이티브 모듈 타입 정의
├── App.tsx
└── package.json
```

## 💡 학습 포인트

1. **네이티브 모듈 작성**
2. **네이티브 UI 컴포넌트**
3. **네이티브 이벤트**
4. **Third-party 라이브러리 링킹**

## 📚 학습 리소스

- [React Native 공식 문서](https://reactnative.dev/)
- [네이티브 모듈 가이드](https://reactnative.dev/docs/native-modules-intro)

MIT License
