import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/products/products_bloc.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ProductsBloc>().add(ProductsLoadRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('상품 목록')),
      body: BlocBuilder<ProductsBloc, ProductsState>(
        builder: (context, state) {
          if (state is ProductsLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ProductsLoaded) {
            if (state.products.isEmpty) {
              return const Center(child: Text('등록된 상품이 없습니다'));
            }
            return ListView.builder(
              itemCount: state.products.length,
              itemBuilder: (context, index) {
                final product = state.products[index];
                return ListTile(
                  leading: const Icon(Icons.shopping_bag, size: 40),
                  title: Text(product.name),
                  subtitle: Text(product.description),
                  trailing: Text('${product.price.toStringAsFixed(0)}원'),
                );
              },
            );
          } else if (state is ProductsError) {
            return Center(child: Text('오류: ${state.message}'));
          }
          return const Center(child: Text('상품을 불러올 수 없습니다'));
        },
      ),
    );
  }
}
