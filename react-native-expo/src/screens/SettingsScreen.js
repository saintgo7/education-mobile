import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  const toggleNotifications = async (value) => {
    setNotifications(value);
    await AsyncStorage.setItem('notifications', JSON.stringify(value));
    Alert.alert(
      '알림 설정',
      value ? '알림이 활성화되었습니다.' : '알림이 비활성화되었습니다.'
    );
  };

  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    await AsyncStorage.setItem('darkMode', JSON.stringify(value));
    Alert.alert('다크 모드', '다크 모드 기능은 데모 버전에서 사용할 수 없습니다.');
  };

  const toggleBiometrics = async (value) => {
    setBiometrics(value);
    await AsyncStorage.setItem('biometrics', JSON.stringify(value));
    Alert.alert(
      '생체 인증',
      value
        ? '생체 인증이 활성화되었습니다.'
        : '생체 인증이 비활성화되었습니다.'
    );
  };

  const clearCache = async () => {
    Alert.alert(
      '캐시 삭제',
      '캐시를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('완료', '캐시가 삭제되었습니다.');
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      '앱 정보',
      'React Native Expo 교육용 앱\n버전: 1.0.0\n\n이 앱은 모바일 개발 학습을 위한 데모 프로젝트입니다.',
      [{ text: '확인' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>일반 설정</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>푸시 알림</Text>
            <Text style={styles.settingDescription}>
              새로운 소식과 업데이트 알림 받기
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>다크 모드</Text>
            <Text style={styles.settingDescription}>
              어두운 테마 사용하기
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>생체 인증</Text>
            <Text style={styles.settingDescription}>
              지문 또는 Face ID로 로그인
            </Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={toggleBiometrics}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>데이터 관리</Text>

        <TouchableOpacity style={styles.menuItem} onPress={clearCache}>
          <Text style={styles.menuText}>캐시 삭제</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>다운로드 관리</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>비밀번호 변경</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>계정 연동</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, styles.dangerText]}>계정 삭제</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>지원</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>고객 센터</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>자주 묻는 질문</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
          <Text style={styles.menuText}>앱 정보</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>법적 고지</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>이용 약관</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>개인정보 처리방침</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>오픈소스 라이센스</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2024 Mobile Education App</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  dangerText: {
    color: '#ff3b30',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});
