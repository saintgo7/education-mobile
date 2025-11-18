/**
 * Internationalization (i18n) Configuration
 * Multi-language and Multi-currency support for global platform
 */

export interface LocalizationConfig {
  language: string
  region: string
  currency: string
  dateFormat: string
  timeFormat: string
  numberFormat: string
  textDirection: 'ltr' | 'rtl'
}

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  region: string
  flag: string
  direction: 'ltr' | 'rtl'
  enabled: boolean
}

export interface CurrencyConfig {
  code: string
  name: string
  symbol: string
  region: string
  exchangeRate: number
  enabled: boolean
  decimalPlaces: number
}

// Supported Languages
export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  'en-US': {
    code: 'en-US',
    name: 'English (United States)',
    nativeName: 'English',
    region: 'US',
    flag: '🇺🇸',
    direction: 'ltr',
    enabled: true
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (United Kingdom)',
    nativeName: 'English (UK)',
    region: 'GB',
    flag: '🇬🇧',
    direction: 'ltr',
    enabled: true
  },
  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    region: 'KR',
    flag: '🇰🇷',
    direction: 'ltr',
    enabled: true
  },
  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'JP',
    flag: '🇯🇵',
    direction: 'ltr',
    enabled: true
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    region: 'CN',
    flag: '🇨🇳',
    direction: 'ltr',
    enabled: true
  },
  'zh-TW': {
    code: 'zh-TW',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    region: 'TW',
    flag: '🇹🇼',
    direction: 'ltr',
    enabled: true
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish (Spain)',
    nativeName: 'Español',
    region: 'ES',
    flag: '🇪🇸',
    direction: 'ltr',
    enabled: true
  },
  'es-MX': {
    code: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México)',
    region: 'MX',
    flag: '🇲🇽',
    direction: 'ltr',
    enabled: true
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    region: 'FR',
    flag: '🇫🇷',
    direction: 'ltr',
    enabled: true
  },
  'de-DE': {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'DE',
    flag: '🇩🇪',
    direction: 'ltr',
    enabled: true
  },
  'it-IT': {
    code: 'it-IT',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'IT',
    flag: '🇮🇹',
    direction: 'ltr',
    enabled: true
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    region: 'BR',
    flag: '🇧🇷',
    direction: 'ltr',
    enabled: true
  },
  'pt-PT': {
    code: 'pt-PT',
    name: 'Portuguese (Portugal)',
    nativeName: 'Português',
    region: 'PT',
    flag: '🇵🇹',
    direction: 'ltr',
    enabled: true
  },
  'ru-RU': {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'RU',
    flag: '🇷🇺',
    direction: 'ltr',
    enabled: true
  },
  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية',
    region: 'SA',
    flag: '🇸🇦',
    direction: 'rtl',
    enabled: true
  },
  'ar-AE': {
    code: 'ar-AE',
    name: 'Arabic (UAE)',
    nativeName: 'العربية',
    region: 'AE',
    flag: '🇦🇪',
    direction: 'rtl',
    enabled: true
  },
  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'IN',
    flag: '🇮🇳',
    direction: 'ltr',
    enabled: true
  },
  'th-TH': {
    code: 'th-TH',
    name: 'Thai',
    nativeName: 'ไทย',
    region: 'TH',
    flag: '🇹🇭',
    direction: 'ltr',
    enabled: true
  },
  'vi-VN': {
    code: 'vi-VN',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    region: 'VN',
    flag: '🇻🇳',
    direction: 'ltr',
    enabled: true
  },
  'id-ID': {
    code: 'id-ID',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    region: 'ID',
    flag: '🇮🇩',
    direction: 'ltr',
    enabled: true
  }
}

// Supported Currencies
export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  'USD': {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    region: 'US',
    exchangeRate: 1.0,
    enabled: true,
    decimalPlaces: 2
  },
  'EUR': {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    region: 'EU',
    exchangeRate: 0.92,
    enabled: true,
    decimalPlaces: 2
  },
  'GBP': {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    region: 'GB',
    exchangeRate: 0.79,
    enabled: true,
    decimalPlaces: 2
  },
  'JPY': {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    region: 'JP',
    exchangeRate: 110.5,
    enabled: true,
    decimalPlaces: 0
  },
  'CNY': {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    region: 'CN',
    exchangeRate: 6.45,
    enabled: true,
    decimalPlaces: 2
  },
  'KRW': {
    code: 'KRW',
    name: 'Korean Won',
    symbol: '₩',
    region: 'KR',
    exchangeRate: 1200.0,
    enabled: true,
    decimalPlaces: 0
  },
  'INR': {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    region: 'IN',
    exchangeRate: 74.5,
    enabled: true,
    decimalPlaces: 2
  },
  'BRL': {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    region: 'BR',
    exchangeRate: 5.2,
    enabled: true,
    decimalPlaces: 2
  },
  'AED': {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    region: 'AE',
    exchangeRate: 3.67,
    enabled: true,
    decimalPlaces: 2
  },
  'SAR': {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    region: 'SA',
    exchangeRate: 3.75,
    enabled: true,
    decimalPlaces: 2
  },
  'THB': {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    region: 'TH',
    exchangeRate: 33.5,
    enabled: true,
    decimalPlaces: 2
  },
  'VND': {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    region: 'VN',
    exchangeRate: 23000.0,
    enabled: true,
    decimalPlaces: 0
  },
  'IDR': {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    region: 'ID',
    exchangeRate: 14500.0,
    enabled: true,
    decimalPlaces: 0
  }
}

// Date Format Configurations
export const DATE_FORMATS: Record<string, string> = {
  'en-US': 'MM/dd/yyyy',
  'en-GB': 'dd/MM/yyyy',
  'ko-KR': 'yyyy년 MM월 dd일',
  'ja-JP': 'yyyy年M月d日',
  'zh-CN': 'yyyy年M月d日',
  'zh-TW': 'yyyy年M月d日',
  'es-ES': 'dd/MM/yyyy',
  'es-MX': 'dd/MM/yyyy',
  'fr-FR': 'dd/MM/yyyy',
  'de-DE': 'dd.MM.yyyy',
  'it-IT': 'dd/MM/yyyy',
  'pt-BR': 'dd/MM/yyyy',
  'pt-PT': 'dd/MM/yyyy',
  'ru-RU': 'dd.MM.yyyy',
  'ar-SA': 'dd/MM/yyyy',
  'ar-AE': 'dd/MM/yyyy',
  'hi-IN': 'dd/MM/yyyy',
  'th-TH': 'dd/MM/yyyy',
  'vi-VN': 'dd/MM/yyyy',
  'id-ID': 'dd/MM/yyyy'
}

// Number Format Configurations
export const NUMBER_FORMATS: Record<string, Intl.NumberFormatOptions> = {
  'en-US': { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  'en-GB': { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  'ko-KR': { minimumFractionDigits: 0, maximumFractionDigits: 0 },
  'ja-JP': { minimumFractionDigits: 0, maximumFractionDigits: 0 },
  'de-DE': { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  'fr-FR': { minimumFractionDigits: 2, maximumFractionDigits: 2 }
}

// Internationalization Utility Functions
export class I18nService {
  private currentLanguage: string = 'en-US'
  private currentCurrency: string = 'USD'
  private translations: Record<string, Record<string, string>> = {}

  constructor() {
    this.initializeTranslations()
  }

  // Set language
  setLanguage(languageCode: string): void {
    if (SUPPORTED_LANGUAGES[languageCode]) {
      this.currentLanguage = languageCode
      this.updatePageDirection()
      localStorage.setItem('preferredLanguage', languageCode)
    }
  }

  // Set currency
  setCurrency(currencyCode: string): void {
    if (SUPPORTED_CURRENCIES[currencyCode]) {
      this.currentCurrency = currencyCode
      localStorage.setItem('preferredCurrency', currencyCode)
    }
  }

  // Get localization config
  getLocalizationConfig(): LocalizationConfig {
    const langConfig = SUPPORTED_LANGUAGES[this.currentLanguage]
    const currencyConfig = SUPPORTED_CURRENCIES[this.currentCurrency]

    return {
      language: this.currentLanguage,
      region: langConfig.region,
      currency: this.currentCurrency,
      dateFormat: DATE_FORMATS[this.currentLanguage] || 'dd/MM/yyyy',
      timeFormat: 'HH:mm:ss',
      numberFormat: 'default',
      textDirection: langConfig.direction
    }
  }

  // Format currency
  formatCurrency(amount: number): string {
    const currency = SUPPORTED_CURRENCIES[this.currentCurrency]
    const formatted = amount.toLocaleString(this.currentLanguage, {
      style: 'currency',
      currency: this.currentCurrency,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    })
    return formatted
  }

  // Format date
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.currentLanguage).format(date)
  }

  // Format number
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLanguage, options).format(number)
  }

  // Format time
  formatTime(date: Date): string {
    return new Intl.DateTimeFormat(this.currentLanguage, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date: Date): string {
    const rtf = new Intl.RelativeTimeFormat(this.currentLanguage)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffSecs = Math.round(diffMs / 1000)

    const intervals: Array<[Intl.RelativeTimeFormatUnit, number]> = [
      ['year', 60 * 60 * 24 * 365],
      ['month', 60 * 60 * 24 * 30],
      ['week', 60 * 60 * 24 * 7],
      ['day', 60 * 60 * 24],
      ['hour', 60 * 60],
      ['minute', 60],
      ['second', 1]
    ]

    for (const [unit, secondsInUnit] of intervals) {
      const diff = Math.round(diffSecs / secondsInUnit)
      if (diff !== 0) {
        return rtf.format(diff, unit)
      }
    }

    return 'now'
  }

  // Get supported languages
  getSupportedLanguages(): LanguageConfig[] {
    return Object.values(SUPPORTED_LANGUAGES).filter(l => l.enabled)
  }

  // Get supported currencies
  getSupportedCurrencies(): CurrencyConfig[] {
    return Object.values(SUPPORTED_CURRENCIES).filter(c => c.enabled)
  }

  // Convert currency
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    const fromRate = SUPPORTED_CURRENCIES[fromCurrency]?.exchangeRate || 1
    const toRate = SUPPORTED_CURRENCIES[toCurrency]?.exchangeRate || 1
    return (amount / fromRate) * toRate
  }

  // Initialize translations (sample)
  private initializeTranslations(): void {
    this.translations = {
      'en-US': {
        'welcome': 'Welcome to Education Platform',
        'courses': 'Courses',
        'enroll': 'Enroll Now',
        'price': 'Price',
        'about': 'About'
      },
      'ko-KR': {
        'welcome': '교육 플랫폼에 오신 것을 환영합니다',
        'courses': '코스',
        'enroll': '지금 등록하기',
        'price': '가격',
        'about': '정보'
      },
      'ja-JP': {
        'welcome': 'ようこそ教育プラットフォームへ',
        'courses': 'コース',
        'enroll': '今すぐ登録',
        'price': '価格',
        'about': '概要'
      },
      'zh-CN': {
        'welcome': '欢迎来到教育平台',
        'courses': '课程',
        'enroll': '立即注册',
        'price': '价格',
        'about': '关于'
      },
      'es-ES': {
        'welcome': 'Bienvenido a la Plataforma Educativa',
        'courses': 'Cursos',
        'enroll': 'Inscribirse Ahora',
        'price': 'Precio',
        'about': 'Acerca de'
      }
    }
  }

  // Get translation
  translate(key: string): string {
    return this.translations[this.currentLanguage]?.[key] || key
  }

  // Update page direction for RTL languages
  private updatePageDirection(): void {
    const langConfig = SUPPORTED_LANGUAGES[this.currentLanguage]
    document.documentElement.dir = langConfig.direction
    document.documentElement.lang = this.currentLanguage
  }
}

// Export singleton instance
export const i18nService = new I18nService()
