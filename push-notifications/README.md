# Push Notifications - FCM & APNS Implementation

Firebase Cloud Messaging (FCM)과 Apple Push Notification Service (APNS)를 통합한 푸시 알림 시스템입니다.

## 📱 프로젝트 개요

모바일 앱에 푸시 알림을 구현하는 완전한 가이드와 샘플 코드를 제공합니다.

## 🔔 Firebase Cloud Messaging (FCM)

### Android 설정

1. **Firebase Console에서 프로젝트 생성**

2. **google-services.json 다운로드**
   - `android/app/` 폴더에 추가

3. **build.gradle 설정**
```gradle
// android/build.gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
  }
}

// android/app/build.gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation platform('com.google.firebase:firebase-bom:32.7.0')
  implementation 'com.google.firebase:firebase-messaging'
}
```

4. **React Native 코드**
```typescript
import messaging from '@react-native-firebase/messaging';

// 토큰 받기
const getToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  // 서버에 토큰 전송
  await sendTokenToServer(token);
};

// 포그라운드 메시지 처리
messaging().onMessage(async remoteMessage => {
  console.log('Foreground message:', remoteMessage);
});

// 백그라운드 메시지 처리
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
});
```

## 🍎 Apple Push Notification Service (APNS)

### iOS 설정

1. **Apple Developer Portal 설정**
   - Certificates, Identifiers & Profiles
   - Push Notification 인증서 생성

2. **Xcode 프로젝트 설정**
   - Signing & Capabilities
   - Push Notifications 추가

3. **GoogleService-Info.plist 추가**
   - Firebase Console에서 다운로드
   - `ios/` 폴더에 추가

4. **AppDelegate.m 수정**
```objc
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [FIRApp configure];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [application registerForRemoteNotifications];
      });
    }
  }];

  return YES;
}

- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [FIRMessaging messaging].APNSToken = deviceToken;
}

@end
```

## 🚀 통합 푸시 서비스

### Node.js Backend
```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 단일 기기에 전송
export async function sendToDevice(token: string, notification: any) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent:', response);
  } catch (error) {
    console.error('Error sending:', error);
  }
}

// 여러 기기에 전송
export async function sendToMultipleDevices(tokens: string[], notification: any) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    tokens: tokens,
  };

  const response = await admin.messaging().sendMulticast(message);
  console.log(`${response.successCount} messages sent successfully`);
}

// 토픽 구독
export async function subscribeToTopic(tokens: string[], topic: string) {
  const response = await admin.messaging().subscribeToTopic(tokens, topic);
  console.log('Successfully subscribed to topic:', response);
}

// 토픽에 메시지 전송
export async function sendToTopic(topic: string, notification: any) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    topic: topic,
  };

  const response = await admin.messaging().send(message);
  console.log('Successfully sent to topic:', response);
}
```

## 📱 클라이언트 통합

### React Native 전체 설정
```typescript
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export function usePushNotifications() {
  useEffect(() => {
    // 권한 요청
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('Token:', token);
      }
    };

    requestPermission();

    // 토큰 갱신
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      console.log('Token refreshed:', token);
    });

    // 포그라운드 메시지
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body || '',
      });
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeMessage();
    };
  }, []);
}
```

### Flutter 설정
```dart
import 'package:firebase_messaging/firebase_messaging.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('Background message: ${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(MyApp());
}

class PushNotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // 권한 요청
    await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // 토큰 받기
    String? token = await _fcm.getToken();
    print('FCM Token: $token');

    // 포그라운드 메시지 처리
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Foreground: ${message.notification?.title}');
    });
  }
}
```

## 🔧 고급 기능

### Data Payload
```typescript
const message = {
  notification: {
    title: '새 메시지',
    body: '안녕하세요!',
  },
  data: {
    type: 'chat',
    chatId: '12345',
    userId: 'user123',
  },
  token: deviceToken,
};
```

### 조건부 전송
```typescript
const message = {
  notification: { title: 'News', body: 'Breaking news!' },
  condition: "'news' in topics && ('korea' in topics || 'global' in topics)",
};
```

## 📚 학습 리소스

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase](https://rnfirebase.io/)
- [APNS Documentation](https://developer.apple.com/documentation/usernotifications)

## 🐛 트러블슈팅

### Android
- `google-services.json` 위치 확인
- Google Play Services 버전 확인

### iOS
- 인증서 만료 확인
- Provisioning Profile 확인
- 백그라운드 모드 활성화

MIT License
