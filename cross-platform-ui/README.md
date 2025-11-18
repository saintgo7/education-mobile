# Cross-Platform UI - Shared Component Library

여러 플랫폼에서 재사용 가능한 UI 컴포넌트 라이브러리입니다.

## 📱 프로젝트 개요

이 프로젝트는 React, React Native, Flutter 등에서 사용할 수 있는 디자인 시스템과 공유 컴포넌트를 제공합니다.

## 🎨 디자인 시스템

### Color Palette
```json
{
  "primary": "#007AFF",
  "secondary": "#5856D6",
  "success": "#34C759",
  "danger": "#FF3B30",
  "warning": "#FF9500",
  "info": "#5AC8FA",
  "light": "#F2F2F7",
  "dark": "#1C1C1E"
}
```

### Typography
```typescript
export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 28, fontWeight: 'bold' },
  h3: { fontSize: 24, fontWeight: 'bold' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: 'normal' },
};
```

## 🧩 컴포넌트 예시

### Button Component (React Native)
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], styles[size]]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Card Component
```typescript
export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

## 📦 Storybook 설정

```bash
# Storybook 설치
npx sb init

# Storybook 실행
npm run storybook
```

### Story 예시
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    title: '확인',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: '취소',
    variant: 'secondary',
  },
};
```

## 📚 학습 리소스

- [Storybook 공식 문서](https://storybook.js.org/)
- [Design Systems](https://www.designsystems.com/)

MIT License
