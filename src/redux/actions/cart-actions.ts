import { CartItem, CartItemNonMember } from '../../types/types';
import {
  CALCULATE_CART_PRICE_SUCCESS,
  CLEAR_CART_SUCCESS,
  FETCH_CART_SUCCESS,
  LOADING_CART,
  STOP_LOADING_CART,
  CalculateCartPriceSuccessActionType,
  ClearCartActionType,
  FetchCartSuccessActionType,
  LoadingCartActionType,
  StopLoadingCartActionType,
  UpdateCartSuccessActionType,
  UPDATE_CART_SUCCESS,
  AddCartItemActionType,
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
  RemoveCartItemActionType,
  UpdateCartItemActionType,
  UPDATE_CART_ITEM,
} from '../action-types/cart-action-types';

export const loadingCart = (): LoadingCartActionType => ({
  type: LOADING_CART,
});

export const fetchCartSuccess = (
  cartItems: Array<CartItem | CartItemNonMember>
): FetchCartSuccessActionType => ({
  type: FETCH_CART_SUCCESS,
  payload: cartItems,
});

export const calculateCartPriceSuccess = (
  total: number
): CalculateCartPriceSuccessActionType => ({
  type: CALCULATE_CART_PRICE_SUCCESS,
  payload: total,
});

export const clearCartSuccess = (): ClearCartActionType => ({
  type: CLEAR_CART_SUCCESS,
});

export const stopLoadingCart = (): StopLoadingCartActionType => ({
  type: STOP_LOADING_CART,
});

export const updateCartSuccess = (): UpdateCartSuccessActionType => ({
  type: UPDATE_CART_SUCCESS,
});

// 비회원 장바구니 관련

export const addCartItem = (
  cartItem: CartItemNonMember
): AddCartItemActionType => ({
  type: ADD_CART_ITEM,
  payload: cartItem,
});

export const removeCartItem = (
  productId: number
): RemoveCartItemActionType => ({
  type: REMOVE_CART_ITEM,
  payload: productId,
});

export const updateCartItem = (
  productId: number,
  productCount: number
): UpdateCartItemActionType => ({
  type: UPDATE_CART_ITEM,
  payload: { productId: productId, productCount: productCount },
});
