import { CartItem, Product } from '../../types/types';
import {
  calculateCartPriceSuccess,
  clearCartSuccess,
  fetchCartSuccess,
  loadingCart,
  stopLoadingCart,
} from '../actions/cart-actions';
import { Dispatch } from 'redux';
import RequestService from '../../utils/request-service';

export const fetchCart = (customerId: number) => async (dispatch: Dispatch) => {
  dispatch(loadingCart());

  const response = await RequestService.get(`/customer/${customerId}/cart`);
  const cart: Array<CartItem> = response.data;

  let total: number = 0;
  cart.forEach((cartItem: CartItem) => {
    total += (cartItem.product?.productPrice as number) * cartItem.productCount;
  });

  dispatch(fetchCartSuccess(response.data));
  dispatch(calculateCartPriceSuccess(total));
};

export const calculateCartPrice =
  (products: Array<Product> | any) => (dispatch: Dispatch) => {
    const productsFromLocalStorage: Map<number, number> = new Map(
      JSON.parse(<string>localStorage.getItem('products'))
    );
    let total: number = 0;

    productsFromLocalStorage.forEach((value: number, key: number) => {
      const product: Product = products.find(
        (product: { id: number }) => product.id === key
      );
      total += product.productPrice * value;
    });
    dispatch(calculateCartPriceSuccess(total));
  };

export const clearCart = () => (dispatch: Dispatch) => {
  dispatch(clearCartSuccess());
};

export const loadCart = () => (dispatch: Dispatch) => {
  dispatch(stopLoadingCart());
};

export const updateCart =
  (customerId: number, productId: number, productCount: number) =>
  async (dispatch: Dispatch) => {
    const response = await RequestService.post(`/customer/${customerId}/cart`, {
      productCount: productCount,
    });
  };
