import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.products);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  }, [dispatch]);

  const featuredProducts = items.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>안녕하세요,</Text>
        <Text style={styles.userName}>{user?.name || '사용자'}님!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추천 상품</Text>
        {loading ? (
          <Text style={styles.loadingText}>로딩 중...</Text>
        ) : (
          featuredProducts.map((product, index) => (
            <TouchableOpacity
              key={product.id || index}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate('Products', {
                  screen: 'ProductDetail',
                  params: { productId: product.id },
                })
              }
            >
              <View style={styles.productImage}>
                <Text style={styles.productImageText}>📱</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {product.name || `상품 ${index + 1}`}
                </Text>
                <Text style={styles.productPrice}>
                  {product.price || '49,000'}원
                </Text>
                <Text style={styles.productDescription}>
                  {product.description || '고품질 모바일 제품'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>빠른 메뉴</Text>
        <View style={styles.quickMenu}>
          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.quickMenuIcon}>📦</Text>
            <Text style={styles.quickMenuText}>전체 상품</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.quickMenuIcon}>👤</Text>
            <Text style={styles.quickMenuText}>프로필</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.quickMenuIcon}>⚙️</Text>
            <Text style={styles.quickMenuText}>설정</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>학습 가이드</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>React Native Expo</Text>
          <Text style={styles.infoText}>
            이 앱은 Expo를 사용한 React Native 교육용 프로젝트입니다.
          </Text>
          <Text style={styles.infoText}>
            • Redux Toolkit을 이용한 상태 관리{'\n'}
            • React Navigation을 이용한 화면 전환{'\n'}
            • AsyncStorage를 이용한 로컬 저장소{'\n'}
            • Axios를 이용한 API 연동
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    fontSize: 40,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  quickMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickMenuItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickMenuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickMenuText: {
    fontSize: 14,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
});
