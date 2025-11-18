# Kotlin Android - Jetpack Compose 교육 프로젝트

Kotlin과 Jetpack Compose를 사용한 네이티브 Android 앱 개발 프로젝트입니다.

## 📱 프로젝트 개요

이 프로젝트는 최신 Android 개발 기술 스택을 학습하기 위한 템플릿입니다.

### 주요 기술

- **Kotlin** - 현대적인 프로그래밍 언어
- **Jetpack Compose** - 선언적 UI 프레임워크
- **MVVM** - Model-View-ViewModel 아키텍처
- **Room** - 로컬 데이터베이스
- **Retrofit** - REST API 클라이언트
- **Hilt** - 의존성 주입
- **Coroutines & Flow** - 비동기 처리

## 🎯 구현할 기능

### 필수 화면
1. **스플래시 화면** - 앱 시작 화면
2. **로그인 화면** - 사용자 인증
3. **홈 화면** - 대시보드
4. **상품 목록** - RecyclerView 대신 LazyColumn
5. **상품 상세** - 상세 정보 표시
6. **프로필** - 사용자 정보
7. **설정** - 앱 설정

### 핵심 구현 사항

#### 1. Jetpack Compose UI
```kotlin
@Composable
fun LoginScreen(viewModel: AuthViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("로그인", style = MaterialTheme.typography.headlineLarge)

        OutlinedTextField(
            value = uiState.email,
            onValueChange = { viewModel.updateEmail(it) },
            label = { Text("이메일") }
        )

        Button(
            onClick = { viewModel.login() },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("로그인")
        }
    }
}
```

#### 2. ViewModel with StateFlow
```kotlin
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    fun login() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            authRepository.login(
                email = uiState.value.email,
                password = uiState.value.password
            ).onSuccess { user ->
                _uiState.update {
                    it.copy(isLoading = false, user = user)
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(isLoading = false, error = error.message)
                }
            }
        }
    }
}
```

#### 3. Room Database
```kotlin
@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: String,
    val name: String,
    val price: Double,
    val description: String,
    val category: String
)

@Dao
interface ProductDao {
    @Query("SELECT * FROM products")
    fun getAllProducts(): Flow<List<ProductEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(products: List<ProductEntity>)

    @Query("DELETE FROM products")
    suspend fun deleteAll()
}
```

#### 4. Retrofit API
```kotlin
interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("products")
    suspend fun getProducts(): Response<List<Product>>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: String): Response<Product>
}
```

#### 5. Hilt 의존성 주입
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/api/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

## 🚀 시작하기

### 사전 요구사항

- Android Studio Hedgehog (2023.1.1) 이상
- JDK 17
- Android SDK 34
- Kotlin 1.9+

### 프로젝트 생성 및 설정

1. **Android Studio에서 새 프로젝트 생성**
   - Empty Compose Activity 선택
   - Minimum SDK: API 24 (Android 7.0)
   - Language: Kotlin
   - Build configuration language: Kotlin DSL

2. **build.gradle.kts (Project level)**
```kotlin
plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
    id("com.google.dagger.hilt.android") version "2.48" apply false
}
```

3. **build.gradle.kts (App level)**
```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.education.mobile"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.education.mobile"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }
}

dependencies {
    // Compose
    implementation(platform("androidx.compose:compose-bom:2024.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.6")

    // ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")

    // Hilt
    implementation("com.google.dagger:hilt-android:2.48")
    kapt("com.google.dagger:hilt-compiler:2.48")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")

    // Room
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Coil (Image loading)
    implementation("io.coil-kt:coil-compose:2.5.0")
}
```

## 📁 프로젝트 구조

```
app/src/main/java/com/education/mobile/
├── data/
│   ├── local/
│   │   ├── dao/
│   │   │   └── ProductDao.kt
│   │   ├── entity/
│   │   │   └── ProductEntity.kt
│   │   └── AppDatabase.kt
│   ├── remote/
│   │   ├── api/
│   │   │   └── ApiService.kt
│   │   └── dto/
│   │       ├── LoginRequest.kt
│   │       └── LoginResponse.kt
│   └── repository/
│       ├── AuthRepository.kt
│       └── ProductsRepository.kt
├── di/
│   ├── AppModule.kt
│   ├── DatabaseModule.kt
│   └── NetworkModule.kt
├── domain/
│   ├── model/
│   │   ├── User.kt
│   │   └── Product.kt
│   └── usecase/
│       ├── LoginUseCase.kt
│       └── GetProductsUseCase.kt
├── ui/
│   ├── auth/
│   │   ├── LoginScreen.kt
│   │   ├── RegisterScreen.kt
│   │   └── AuthViewModel.kt
│   ├── home/
│   │   ├── HomeScreen.kt
│   │   └── HomeViewModel.kt
│   ├── products/
│   │   ├── ProductsScreen.kt
│   │   ├── ProductDetailScreen.kt
│   │   └── ProductsViewModel.kt
│   ├── profile/
│   │   ├── ProfileScreen.kt
│   │   └── ProfileViewModel.kt
│   ├── navigation/
│   │   └── NavGraph.kt
│   └── theme/
│       ├── Color.kt
│       ├── Theme.kt
│       └── Type.kt
├── util/
│   └── Constants.kt
├── MainActivity.kt
└── MainApplication.kt
```

## 💡 학습 포인트

### 1. Jetpack Compose 기초
- Composable 함수
- State 관리
- Side-effects (LaunchedEffect, DisposableEffect)
- Material Design 3

### 2. 아키텍처 패턴
- MVVM (Model-View-ViewModel)
- Repository 패턴
- UseCase 패턴 (Clean Architecture)

### 3. 비동기 처리
- Kotlin Coroutines
- Flow & StateFlow
- suspend 함수

### 4. 의존성 주입
- Hilt/Dagger
- Module 구성
- Scoping

## 📚 추가 리소스

- [Jetpack Compose 공식 문서](https://developer.android.com/jetpack/compose)
- [Android Developers 가이드](https://developer.android.com/guide)
- [Kotlin 공식 문서](https://kotlinlang.org/docs/home.html)
- [Hilt 가이드](https://developer.android.com/training/dependency-injection/hilt-android)

## 🔧 개발 팁

### 1. 에뮬레이터에서 로컬 서버 접근
```kotlin
// localhost 대신 10.0.2.2 사용
const val BASE_URL = "http://10.0.2.2:3000/api/"
```

### 2. Compose Preview 활용
```kotlin
@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    MyAppTheme {
        LoginScreen()
    }
}
```

### 3. State Hoisting
```kotlin
@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange
    )
}
```

## 📄 라이센스

MIT License

---

**Note**: 이 프로젝트는 학습용 템플릿입니다. 위의 가이드를 참고하여 직접 구현해보세요!
