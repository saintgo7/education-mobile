# Ionic Hybrid - Angular + Capacitor 교육 프로젝트

Ionic Framework와 Capacitor를 사용한 하이브리드 모바일 앱 개발 프로젝트입니다.

## 📱 프로젝트 개요

Ionic을 사용하면 하나의 코드베이스로 iOS, Android, 웹 앱을 동시에 개발할 수 있습니다.

### 주요 기술

- **Ionic Framework** - UI 컴포넌트 라이브러리
- **Angular** - 웹 프레임워크
- **Capacitor** - 네이티브 런타임
- **TypeScript** - 타입 안전성
- **RxJS** - 리액티브 프로그래밍

## 🚀 시작하기

### 프로젝트 생성

```bash
# Ionic CLI 설치
npm install -g @ionic/cli

# 새 프로젝트 생성
ionic start mobile-education tabs --type=angular --capacitor

cd mobile-education

# 개발 서버 실행
ionic serve
```

### Capacitor 추가

```bash
# iOS 추가
ionic cap add ios

# Android 추가
ionic cap add android

# 네이티브 플랫폼 빌드
ionic cap build ios
ionic cap build android
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── pages/
│   │   ├── home/
│   │   ├── login/
│   │   ├── products/
│   │   └── profile/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── api.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── product.model.ts
│   └── app-routing.module.ts
├── assets/
└── theme/
```

## 💡 주요 코드 예시

### Ionic Components
```typescript
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>홈</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="let product of products">
          <ion-label>{{ product.name }}</ion-label>
          <ion-note slot="end">{{ product.price }}원</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class HomePage {
  products = [];
}
```

### Capacitor Plugin 사용
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';
import { Storage } from '@capacitor/storage';

// 카메라 사용
const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
};

// 로컬 저장소
await Storage.set({ key: 'token', value: 'abc123' });
const { value } = await Storage.get({ key: 'token' });
```

## 📚 학습 리소스

- [Ionic 공식 문서](https://ionicframework.com/docs)
- [Capacitor 가이드](https://capacitorjs.com/docs)
- [Angular 문서](https://angular.io/docs)

MIT License
