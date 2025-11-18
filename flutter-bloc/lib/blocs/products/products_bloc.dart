import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '../../models/product.dart';
import '../../repositories/products_repository.dart';

part 'products_event.dart';
part 'products_state.dart';

class ProductsBloc extends Bloc<ProductsEvent, ProductsState> {
  final ProductsRepository productsRepository;

  ProductsBloc({required this.productsRepository}) : super(ProductsInitial()) {
    on<ProductsLoadRequested>(_onProductsLoadRequested);
    on<ProductDetailsLoadRequested>(_onProductDetailsLoadRequested);
  }

  Future<void> _onProductsLoadRequested(
    ProductsLoadRequested event,
    Emitter<ProductsState> emit,
  ) async {
    emit(ProductsLoading());
    try {
      final products = await productsRepository.getProducts();
      emit(ProductsLoaded(products: products));
    } catch (e) {
      emit(ProductsError(message: e.toString()));
    }
  }

  Future<void> _onProductDetailsLoadRequested(
    ProductDetailsLoadRequested event,
    Emitter<ProductsState> emit,
  ) async {
    emit(ProductDetailsLoading());
    try {
      final product = await productsRepository.getProductById(event.productId);
      emit(ProductDetailsLoaded(product: product));
    } catch (e) {
      emit(ProductsError(message: e.toString()));
    }
  }
}
