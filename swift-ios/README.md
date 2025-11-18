# Swift iOS - SwiftUI 교육 프로젝트

Swift와 SwiftUI를 사용한 네이티브 iOS 앱 개발 프로젝트입니다.

## 📱 프로젝트 개요

이 프로젝트는 최신 iOS 개발 기술 스택을 학습하기 위한 템플릿입니다.

### 주요 기술

- **Swift** - Apple의 현대적인 프로그래밍 언어
- **SwiftUI** - 선언적 UI 프레임워크
- **Combine** - 리액티브 프로그래밍
- **Core Data** - 로컬 데이터 persistence
- **MVVM** - Model-View-ViewModel 아키텍처
- **URLSession** - 네트워크 통신
- **Async/Await** - 비동기 처리

## 🎯 구현할 기능

### 필수 화면
1. **스플래시 화면** - 앱 시작 화면
2. **로그인 화면** - 사용자 인증
3. **홈 화면** - TabView with NavigationStack
4. **상품 목록** - List & ScrollView
5. **상품 상세** - DetailView
6. **프로필** - 사용자 정보
7. **설정** - Settings

### 핵심 구현 사항

#### 1. SwiftUI Views
```swift
import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("모바일 교육 앱")
                .font(.largeTitle)
                .fontWeight(.bold)

            TextField("이메일", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .autocapitalization(.none)
                .keyboardType(.emailAddress)

            SecureField("비밀번호", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())

            Button("로그인") {
                Task {
                    await viewModel.login(email: email, password: password)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(viewModel.isLoading)

            if viewModel.isLoading {
                ProgressView()
            }
        }
        .padding()
    }
}
```

#### 2. ViewModel with Combine
```swift
import Foundation
import Combine

@MainActor
class AuthViewModel: ObservableObject {
    @Published var user: User?
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let authService = AuthService.shared
    private var cancellables = Set<AnyCancellable>()

    func login(email: String, password: String) async {
        isLoading = true
        errorMessage = nil

        do {
            let user = try await authService.login(email: email, password: password)
            self.user = user
            self.isAuthenticated = true
            UserDefaults.standard.set(user.token, forKey: "authToken")
        } catch {
            self.errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func logout() {
        user = nil
        isAuthenticated = false
        UserDefaults.standard.removeObject(forKey: "authToken")
    }
}
```

#### 3. Core Data Models
```swift
import CoreData

@objc(ProductEntity)
public class ProductEntity: NSManagedObject {
    @NSManaged public var id: String
    @NSManaged public var name: String
    @NSManaged public var price: Double
    @NSManaged public var productDescription: String
    @NSManaged public var category: String
}

extension ProductEntity {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<ProductEntity> {
        return NSFetchRequest<ProductEntity>(entityName: "ProductEntity")
    }
}

class PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentContainer

    init() {
        container = NSPersistentContainer(name: "MobileEducation")
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Unable to load persistent stores: \\(error)")
            }
        }
    }
}
```

#### 4. Networking with URLSession
```swift
import Foundation

class APIService {
    static let shared = APIService()
    private let baseURL = "http://localhost:3000/api"

    func login(email: String, password: String) async throws -> User {
        let url = URL(string: "\\(baseURL)/auth/login")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["email": email, "password": password]
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }

        let loginResponse = try JSONDecoder().decode(LoginResponse.self, from: data)
        return loginResponse.user
    }

    func fetchProducts() async throws -> [Product] {
        let url = URL(string: "\\(baseURL)/products")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(ProductsResponse.self, from: data)
        return response.data
    }
}
```

#### 5. SwiftUI Navigation
```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var authViewModel = AuthViewModel()

    var body: some View {
        Group {
            if authViewModel.isAuthenticated {
                MainTabView()
                    .environmentObject(authViewModel)
            } else {
                LoginView()
                    .environmentObject(authViewModel)
            }
        }
        .task {
            await authViewModel.checkAuthStatus()
        }
    }
}

struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("홈", systemImage: "house")
                }

            ProductsView()
                .tabItem {
                    Label("상품", systemImage: "bag")
                }

            ProfileView()
                .tabItem {
                    Label("프로필", systemImage: "person")
                }
        }
    }
}
```

## 🚀 시작하기

### 사전 요구사항

- macOS Ventura 이상
- Xcode 15+
- iOS 16+ SDK
- Swift 5.9+
- CocoaPods 또는 Swift Package Manager

### 프로젝트 생성

1. **Xcode에서 새 프로젝트 생성**
   - App 템플릿 선택
   - Interface: SwiftUI
   - Language: Swift
   - Storage: Core Data (선택)

2. **Dependencies 추가 (SPM)**

File → Add Package Dependencies:
```
https://github.com/Alamofire/Alamofire.git (선택사항)
https://github.com/onevcat/Kingfisher.git (이미지 로딩)
```

## 📁 프로젝트 구조

```
MobileEducation/
├── App/
│   ├── MobileEducationApp.swift
│   └── ContentView.swift
├── Models/
│   ├── User.swift
│   ├── Product.swift
│   └── CoreData/
│       ├── ProductEntity.swift
│       └── PersistenceController.swift
├── ViewModels/
│   ├── AuthViewModel.swift
│   ├── ProductsViewModel.swift
│   └── ProfileViewModel.swift
├── Views/
│   ├── Auth/
│   │   ├── LoginView.swift
│   │   ├── RegisterView.swift
│   │   └── ForgotPasswordView.swift
│   ├── Home/
│   │   └── HomeView.swift
│   ├── Products/
│   │   ├── ProductsView.swift
│   │   ├── ProductDetailView.swift
│   │   └── ProductRowView.swift
│   ├── Profile/
│   │   ├── ProfileView.swift
│   │   └── SettingsView.swift
│   └── Components/
│       ├── LoadingView.swift
│       └── ErrorView.swift
├── Services/
│   ├── APIService.swift
│   ├── AuthService.swift
│   └── ProductsService.swift
├── Utilities/
│   ├── Constants.swift
│   ├── Extensions.swift
│   └── Keychain.swift
├── Resources/
│   ├── Assets.xcassets
│   └── Info.plist
└── MobileEducation.xcdatamodeld
```

## 💡 학습 포인트

### 1. SwiftUI 기초
- View 프로토콜
- @State, @Binding, @StateObject, @ObservedObject
- ViewModifier
- Animations

### 2. Combine Framework
- Publishers & Subscribers
- @Published property wrapper
- Cancellables

### 3. Core Data
- NSManagedObject
- NSFetchRequest
- Persistent Container
- @FetchRequest

### 4. Modern Concurrency
- async/await
- Task
- Actor

## 🔧 개발 팁

### 1. Preview 활용
```swift
struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
```

### 2. Environment Objects
```swift
@main
struct MobileEducationApp: App {
    @StateObject private var authViewModel = AuthViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authViewModel)
        }
    }
}
```

### 3. View Modifiers
```swift
struct PrimaryButtonStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(10)
    }
}
```

## 📚 추가 리소스

- [SwiftUI 공식 튜토리얼](https://developer.apple.com/tutorials/swiftui)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Swift.org](https://swift.org/)
- [100 Days of SwiftUI](https://www.hackingwithswift.com/100/swiftui)

## 🍎 App Store 배포

1. **Code Signing 설정**
2. **App Icon 추가**
3. **Launch Screen 구성**
4. **App Store Connect에서 앱 등록**
5. **Archive & Upload**

## 📄 라이센스

MIT License

---

**Note**: 이 프로젝트는 학습용 템플릿입니다. 위의 가이드를 참고하여 직접 구현해보세요!
