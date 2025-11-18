import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';

export default function ProductsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  }, [dispatch]);

  const filteredProducts = items.filter((product) =>
    (product.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate('ProductDetail', { productId: item.id })
      }
    >
      <View style={styles.productImage}>
        <Text style={styles.productImageText}>📱</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {item.name || `상품 ${index + 1}`}
        </Text>
        <Text style={styles.productPrice}>
          {item.price || '49,000'}원
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || '고품질 모바일 제품'}
        </Text>
        <View style={styles.productTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>인기</Text>
          </View>
          {item.category && (
            <View style={[styles.tag, styles.tagSecondary]}>
              <Text style={styles.tagTextSecondary}>{item.category}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="상품 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>상품을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 15,
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
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    fontSize: 50,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productTags: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
  },
  tagSecondary: {
    backgroundColor: '#e0e0e0',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagTextSecondary: {
    color: '#666',
    fontSize: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
