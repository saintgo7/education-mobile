import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/product.dart';

class ProductsRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Product>> getProducts() async {
    final snapshot = await _firestore.collection('products').get();
    return snapshot.docs
        .map((doc) => Product.fromJson({...doc.data(), 'id': doc.id}))
        .toList();
  }

  Future<Product> getProductById(String id) async {
    final doc = await _firestore.collection('products').doc(id).get();
    return Product.fromJson({...doc.data()!, 'id': doc.id});
  }

  Stream<List<Product>> watchProducts() {
    return _firestore.collection('products').snapshots().map(
          (snapshot) => snapshot.docs
              .map((doc) => Product.fromJson({...doc.data(), 'id': doc.id}))
              .toList(),
        );
  }
}
