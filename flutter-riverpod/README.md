# Flutter Riverpod - Advanced State Management

Riverpod를 사용한 고급 Flutter 상태 관리 프로젝트입니다.

## 📱 프로젝트 개요

Riverpod는 Provider의 재설계 버전으로, 더 안전하고 강력한 상태 관리를 제공합니다.

### 주요 기술

- **Riverpod** - 상태 관리
- **Freezed** - 불변 모델
- **Dio** - HTTP 클라이언트
- **Go Router** - 라우팅
- **Riverpod Generator** - 코드 생성

## 🚀 시작하기

### pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.4.9
  riverpod_annotation: ^2.3.3
  freezed_annotation: ^2.4.1
  dio: ^5.4.0
  go_router: ^13.0.0

dev_dependencies:
  riverpod_generator: ^2.3.9
  build_runner: ^2.4.7
  freezed: ^2.4.6
```

## 💡 주요 코드 예시

### Provider 정의

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_provider.g.dart';

@riverpod
class Auth extends _$Auth {
  @override
  Future<User?> build() async {
    // 초기 상태 로드
    return await _loadSavedUser();
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final user = await ref.read(authRepositoryProvider).login(email, password);
      return user;
    });
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    state = const AsyncValue.data(null);
  }
}
```

### Freezed 모델

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String name,
    required String email,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

### UI에서 사용

```dart
class LoginPage extends ConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return authState.when(
      data: (user) => user != null ? const HomePage() : const LoginForm(),
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

### StateNotifierProvider

```dart
@riverpod
class ProductsList extends _$ProductsList {
  @override
  Future<List<Product>> build() async {
    return ref.read(productsRepositoryProvider).getProducts();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(productsRepositoryProvider).getProducts(),
    );
  }
}
```

## 🔧 코드 생성

```bash
# watch 모드로 실행
flutter pub run build_runner watch

# 한 번만 실행
flutter pub run build_runner build

# 기존 파일 삭제 후 재생성
flutter pub run build_runner build --delete-conflicting-outputs
```

## 📚 학습 리소스

- [Riverpod 공식 문서](https://riverpod.dev/)
- [Freezed 가이드](https://pub.dev/packages/freezed)
- [Riverpod Generator](https://pub.dev/packages/riverpod_generator)

MIT License
