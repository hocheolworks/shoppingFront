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

const calculateTotalPrice = (cart: Array<CartItem>): number => {
  let total = 0;
  cart.forEach((cartItem: CartItem) => {
    total += (cartItem.product?.productPrice as number) * cartItem.productCount;
  });
  return total;
};

export const fetchCart = (customerId: number) => async (dispatch: Dispatch) => {
  dispatch(loadingCart());

  const response = await RequestService.get(`/customer/${customerId}/cart`);
  const cart: Array<CartItem> = response.data;

  if (cart === undefined || cart === null) return;

  let total: number = calculateTotalPrice(cart);

  dispatch(fetchCartSuccess(response.data));
  dispatch(calculateCartPriceSuccess(total));
};

export const calculateCartPrice =
  (cart: Array<CartItem>) => (dispatch: Dispatch) => {
    if (cart === undefined || cart === null) return;

    const total: number = calculateTotalPrice(cart);

    dispatch(calculateCartPriceSuccess(total));
  };

export const clearCart = (customerId: number) => async (dispatch: Dispatch) => {
  const response = await RequestService.delete(
    `/customer/${customerId}/cart/all`
  );

  if (
    response === undefined ||
    response === null ||
    response.data === undefined ||
    response.data === null
  ) {
    return;
  }

  if (response.data.length === 0) {
    dispatch(clearCartSuccess());
  } else {
    dispatch(fetchCartSuccess(response.data));
  }
};

export const loadCart = () => (dispatch: Dispatch) => {
  dispatch(stopLoadingCart());
};

export const insertCart =
  (customerId: number, productId: number, productCount: number) =>
  async (dispatch: Dispatch) => {
    const response = await RequestService.post(`/customer/${customerId}/cart`, {
      productId: productId,
      productCount: productCount,
    });
    dispatch(fetchCartSuccess(response.data));
    dispatch(calculateCartPriceSuccess(calculateTotalPrice(response.data)));
  };

export const updateCart =
  (customerId: number, productId: number, productCount: number) =>
  async (dispatch: Dispatch) => {
    const response = await RequestService.put(`/customer/${customerId}/cart`, {
      productId: productId,
      productCount: productCount,
    });
    dispatch(fetchCartSuccess(response.data));
    dispatch(calculateCartPriceSuccess(calculateTotalPrice(response.data)));
  };

export const deleteCartItem =
  (customerId: number, productId: number) => async (dispatch: Dispatch) => {
    const response = await RequestService.delete(
      `/customer/${customerId}/cart?productId=${productId}`
    );

    dispatch(fetchCartSuccess(response.data));
    dispatch(calculateCartPriceSuccess(calculateTotalPrice(response.data)));
  };
