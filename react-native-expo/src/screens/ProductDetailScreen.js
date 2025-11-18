import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../redux/slices/productsSlice';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [productId, dispatch]);

  const handleAddToCart = () => {
    Alert.alert('장바구니', '상품이 장바구니에 추가되었습니다.', [
      { text: '확인' },
      { text: '장바구니 보기', onPress: () => {} },
    ]);
  };

  const handleBuyNow = () => {
    Alert.alert('구매', '구매 기능은 데모 버전에서 사용할 수 없습니다.');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>상품 정보를 불러오는 중...</Text>
      </View>
    );
  }

  const product = selectedProduct || {
    id: productId,
    name: '샘플 상품',
    price: '49,000',
    description: '이것은 샘플 상품입니다.',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Text style={styles.productImageLarge}>📱</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price}원</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상품 설명</Text>
            <Text style={styles.description}>
              {product.description ||
                '이 상품은 최고 품질의 재료로 만들어진 프리미엄 모바일 제품입니다. ' +
                  '뛰어난 성능과 세련된 디자인이 특징입니다.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상품 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>카테고리:</Text>
              <Text style={styles.infoValue}>
                {product.category || '전자제품'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>재고 상태:</Text>
              <Text style={styles.infoValue}>
                {product.inStock !== false ? '재고 있음' : '품절'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>배송:</Text>
              <Text style={styles.infoValue}>무료배송</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상세 스펙</Text>
            <Text style={styles.specs}>
              • 고품질 재료 사용{'\n'}
              • 최신 기술 적용{'\n'}
              • 1년 보증{'\n'}
              • A/S 센터 운영{'\n'}
              • 환불 및 교환 가능
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonTextSecondary}>장바구니</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buttonTextPrimary}>구매하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageLarge: {
    fontSize: 120,
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  specs: {
    fontSize: 16,
    color: '#666',
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
