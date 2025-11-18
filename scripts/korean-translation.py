#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한글화 스크립트 - 모든 예제 파일의 타이틀과 주석을 한글로 번역
"""

import json
import os
from pathlib import Path

# 영어를 한글로 번역하는 매핑
TRANSLATION_MAP = {
    # Testing examples
    "Jest Unit Test - Component Rendering": "Jest 단위 테스트 - 컴포넌트 렌더링",
    "Jest Test - User Interactions": "Jest 테스트 - 사용자 상호작용",
    "Jest Test - Async API Call": "Jest 테스트 - 비동기 API 호출",
    "Jest Test - Form Validation": "Jest 테스트 - 폼 유효성 검사",
    "Jest Test - Snapshot Testing": "Jest 테스트 - 스냅샷 테스팅",
    "Vitest - Unit Test with Hooks": "Vitest - 훅을 사용한 단위 테스트",
    "Vitest - Mocking Module": "Vitest - 모듈 모킹",
    "Vitest - Parameterized Tests": "Vitest - 매개변수화된 테스트",
    "Playwright - E2E Test - Login Flow": "Playwright - E2E 테스트 - 로그인 흐름",
    "Playwright - E2E Test - Course Enrollment": "Playwright - E2E 테스트 - 코스 등록",
    "Playwright - E2E Test - Network Interception": "Playwright - E2E 테스트 - 네트워크 인터셉션",
    "Playwright - Visual Regression Test": "Playwright - 시각 회귀 테스트",
    "Integration Test - Payment Flow": "통합 테스트 - 결제 흐름",
    "Integration Test - Database Queries": "통합 테스트 - 데이터베이스 쿼리",
    "Unit Test - Reducer Function": "단위 테스트 - 리듀서 함수",
    "Unit Test - Utility Function": "단위 테스트 - 유틸리티 함수",
    "Custom Test Utilities": "커스텀 테스트 유틸리티",
    "Mock API Server Setup": "모의 API 서버 설정",
    "Performance Test - Component Rendering": "성능 테스트 - 컴포넌트 렌더링",
    "Accessibility Test": "접근성 테스트",
    "Error Boundary Test": "에러 바운더리 테스트",
    "Setup Test Environment": "테스트 환경 설정",
    "Cypress Integration Test Setup": "Cypress 통합 테스트 설정",
    "Cypress E2E Test - Course Search": "Cypress E2E 테스트 - 코스 검색",

    # Security examples
    "JWT Token Generation and Verification": "JWT 토큰 생성 및 검증",
    "Password Hashing with bcrypt": "bcrypt를 사용한 비밀번호 해싱",
    "SQL Injection Prevention - Parameterized Queries": "SQL 인젝션 방지 - 매개변수화된 쿼리",
    "XSS Prevention - Sanitize User Input": "XSS 방지 - 사용자 입력 새니타이제이션",
    "CSRF Token Protection": "CSRF 토큰 보호",
    "CORS Configuration": "CORS 구성",
    "Rate Limiting": "속도 제한",
    "Environment Variables Configuration": "환경 변수 구성",
    "Input Validation with Joi": "Joi를 사용한 입력 유효성 검사",
    "Two-Factor Authentication (2FA)": "2단계 인증(2FA)",
    "Content Security Policy (CSP)": "콘텐츠 보안 정책(CSP)",
    "HTTPS and SSL/TLS": "HTTPS 및 SSL/TLS",
    "Secure Session Management": "안전한 세션 관리",
    "Data Encryption at Rest": "저장 데이터 암호화",
    "OAuth 2.0 Implementation": "OAuth 2.0 구현",
    "API Key Authentication": "API 키 인증",
    "Dependency Vulnerability Scanning": "종속성 취약점 스캔",
    "Secure File Upload": "안전한 파일 업로드",
    "Logging and Monitoring": "로깅 및 모니터링",
    "Database Connection Security": "데이터베이스 연결 보안",
    "Request/Response Validation": "요청/응답 검증",
    "Helmet Security Headers": "Helmet 보안 헤더",
    "Audit Logging for Sensitive Actions": "민감한 작업에 대한 감사 로깅",
    "Automated Security Testing": "자동화된 보안 테스팅",
    "Role-Based Access Control (RBAC)": "역할 기반 접근 제어(RBAC)",
    "Secure Password Reset Flow": "안전한 비밀번호 재설정 흐름",
    "GraphQL Security Best Practices": "GraphQL 보안 모범 사례",
    "Prevent XXE Attacks": "XXE 공격 방지",
    "Secure Cookies Configuration": "안전한 쿠키 구성",
    "Implement Security Checklist": "보안 체크리스트 구현",

    # Performance examples
    "Code Splitting with React.lazy": "React.lazy를 사용한 코드 분할",
    "Image Optimization with Next.js": "Next.js를 사용한 이미지 최적화",
    "Memoization with useMemo": "useMemo를 사용한 메모이제이션",
    "React.memo for Component Optimization": "컴포넌트 최적화를 위한 React.memo",
    "Virtual Scrolling for Large Lists": "대용량 리스트를 위한 가상 스크롤링",
    "API Response Caching": "API 응답 캐싱",
    "Database Query Optimization": "데이터베이스 쿼리 최적화",
    "CDN Configuration for Static Assets": "정적 자산을 위한 CDN 구성",
    "Webpack Bundle Analysis": "Webpack 번들 분석",
    "HTTP/2 Server Push": "HTTP/2 서버 푸시",
    "Service Worker Caching": "서비스 워커 캐싱",
    "WebAssembly for Performance-Critical Code": "성능이 중요한 코드를 위한 WebAssembly",
    "GraphQL Query Complexity Limiting": "GraphQL 쿼리 복잡도 제한",
    "Database Connection Pooling": "데이터베이스 연결 풀링",
    "Dynamic Import for Route-Based Code Splitting": "경로 기반 코드 분할을 위한 동적 임포트",
    "Reduce Main Thread Work": "주 스레드 작업 감소",
    "Critical CSS Extraction": "필수 CSS 추출",
    "Core Web Vitals Monitoring": "핵심 웹 바이탈 모니터링",
    "Optimize Images with WebP Format": "WebP 형식을 사용한 이미지 최적화",
    "Lighthouse Performance Audit": "Lighthouse 성능 감사",

    # E-commerce examples
    "Shopping Cart with Redux": "Redux를 사용한 장바구니",
    "Stripe Payment Integration": "Stripe 결제 통합",
    "PayPal Integration": "PayPal 통합",
    "Product Recommendations Engine": "상품 추천 엔진",
    "Discount and Coupon System": "할인 및 쿠폰 시스템",
    "Subscription Management": "구독 관리",
    "Invoice Generation": "송장 생성",
    "Product Reviews and Ratings": "상품 리뷰 및 평점",
    "Inventory Management": "재고 관리",
    "Wishlist/Favorites Feature": "위시리스트/즐겨찾기 기능",
    "Order Tracking": "주문 추적",
    "Multi-Currency Support": "다중 통화 지원",
    "Tax Calculation": "세금 계산",
    "Bulk Purchase and B2B Pricing": "대량 구매 및 B2B 가격",
    "Refund and Return Policy": "환불 및 반품 정책",
    "Shipping Cost Calculator": "배송 비용 계산기",

    # Advanced patterns examples
    "Observer Pattern - Event System": "옵저버 패턴 - 이벤트 시스템",
    "Singleton Pattern with Module": "모듈을 사용한 싱글톤 패턴",
    "Factory Pattern - Object Creation": "팩토리 패턴 - 객체 생성",
    "Decorator Pattern - Function Composition": "데코레이터 패턴 - 함수 구성",
    "Strategy Pattern - Algorithm Selection": "전략 패턴 - 알고리즘 선택",
    "Repository Pattern - Data Access": "리포지토리 패턴 - 데이터 접근",
    "Command Pattern - Action Queuing": "커맨드 패턴 - 액션 큐잉",
    "Middleware Pattern - Request Processing": "미들웨어 패턴 - 요청 처리",
    "Pub/Sub Pattern with Redis": "Redis를 사용한 Pub/Sub 패턴",
    "Circuit Breaker Pattern": "서킷 브레이커 패턴",
    "Dependency Injection Container": "의존성 주입 컨테이너",
    "Chain of Responsibility - Validation": "책임 연쇄 패턴 - 검증",
    "State Machine Pattern": "상태 머신 패턴",
    "Composite Pattern - Tree Structure": "컴포지트 패턴 - 트리 구조",
    "Proxy Pattern - Lazy Loading": "프록시 패턴 - 지연 로딩",

    # Utilities examples
    "Date Handling - Timezone Support": "날짜 처리 - 타임존 지원",
    "String Utilities and Formatting": "문자열 유틸리티 및 포매팅",
    "Array Operations and Utilities": "배열 작업 및 유틸리티",
    "Number Formatting and Math": "숫자 포매팅 및 수학",
    "Object Deep Clone and Merge": "객체 깊은 복제 및 병합",
    "Error Handling Utilities": "에러 처리 유틸리티",
    "Validation Utilities": "유효성 검사 유틸리티",
    "Debounce and Throttle": "디바운스 및 쓰로틀",
    "Retry Logic with Exponential Backoff": "지수 백오프를 사용한 재시도 로직",
    "Caching with TTL": "TTL을 사용한 캐싱",
    "Logger Utility": "로거 유틸리티",
    "Request/Response Interceptor": "요청/응답 인터셉터",
    "File Utilities": "파일 유틸리티",
    "Environment Variable Utility": "환경 변수 유틸리티",
    "Rate Limit Tracker": "속도 제한 추적기",
    "Queue Implementation": "큐 구현",
    "Observable Pattern": "옵저버블 패턴",
    "Pagination Helper": "페이지네이션 도우미",
    "Type Guard Utilities": "타입 가드 유틸리티",
    "Map and Filter with Type Safety": "타입 안전성을 사용한 Map 및 Filter",
}

def translate_title(title):
    """영어 제목을 한글로 번역"""
    return TRANSLATION_MAP.get(title, title)

def translate_code_comments(code):
    """코드의 주석을 한글로 번역"""
    # 간단한 주석 번역 (실제로는 더 복잡할 수 있음)
    translations = {
        "// ": "// ",
        "Vulnerable - DO NOT USE": "// 취약함 - 사용하지 마세요",
        "Secure": "// 안전함",
        "Example usage": "// 사용 예시",
        "Usage": "// 사용법",
        "Setup chain": "// 체인 설정",
        "Check cache first": "// 캐시 먼저 확인",
        "Fetch from real service": "// 실제 서비스에서 가져오기",
        "Cache result": "// 결과 캐시",
    }

    result = code
    for en, ko in translations.items():
        result = result.replace(en, ko)

    return result

def translate_json_file(file_path):
    """JSON 파일의 모든 항목을 한글로 번역"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 리스트인 경우
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                if 'title' in item:
                    item['title'] = translate_title(item['title'])
                if 'code' in item and isinstance(item['code'], str):
                    item['code'] = translate_code_comments(item['code'])

    return data

def process_examples_directory():
    """examples 디렉토리의 모든 JSON 파일을 처리"""
    examples_dir = Path('/home/user/education-mobile/examples')

    json_files = list(examples_dir.rglob('*.json'))
    print(f"발견된 JSON 파일: {len(json_files)}개")

    for json_file in json_files:
        if json_file.name == 'README.md':
            continue

        print(f"처리 중: {json_file.name}")

        try:
            translated_data = translate_json_file(json_file)

            # 한글화된 데이터를 파일에 쓰기
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(translated_data, f, ensure_ascii=False, indent=2)

            print(f"✓ {json_file.name} 완료")
        except Exception as e:
            print(f"✗ {json_file.name} 오류: {e}")

if __name__ == '__main__':
    process_examples_directory()
    print("\n한글화 작업 완료!")
