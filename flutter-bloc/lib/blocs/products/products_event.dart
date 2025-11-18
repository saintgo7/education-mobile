part of 'products_bloc.dart';

abstract class ProductsEvent extends Equatable {
  const ProductsEvent();

  @override
  List<Object?> get props => [];
}

class ProductsLoadRequested extends ProductsEvent {}

class ProductDetailsLoadRequested extends ProductsEvent {
  final String productId;

  const ProductDetailsLoadRequested({required this.productId});

  @override
  List<Object?> get props => [productId];
}
