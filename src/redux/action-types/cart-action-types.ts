import { CartItem, CartItemNonMember, Product } from '../../types/types';

export const CALCULATE_CART_PRICE_SUCCESS = 'CALCULATE_CART_PRICE_SUCCESS';
export const CLEAR_CART_SUCCESS = 'CLEAR_CART_SUCCESS';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const LOADING_CART = 'LOADING_CART';
export const STOP_LOADING_CART = 'STOP_LOADING_CART';
export const UPDATE_CART_SUCCESS = 'UPDATE_CART_SUCCESS';
export const RETURN_TO_CART_PAGE = 'RETURN_TO_CART_PAGE';
export const RETURN_TO_CART_PAGE_DONE = 'RETURN_TO_CART_PAGE_DONE';

export type ReturnToCartPageActionType = { type: typeof RETURN_TO_CART_PAGE };
export type ReturnToCartPageDoneActionType = {
  type: typeof RETURN_TO_CART_PAGE_DONE;
};
export type LoadingCartActionType = { type: typeof LOADING_CART };
export type FetchCartSuccessActionType = {
  type: typeof FETCH_CART_SUCCESS;
  payload: Array<CartItem | CartItemNonMember>;
};
export type CalculateCartPriceSuccessActionType = {
  type: typeof CALCULATE_CART_PRICE_SUCCESS;
  payload: number;
};
export type ClearCartActionType = { type: typeof CLEAR_CART_SUCCESS };
export type StopLoadingCartActionType = { type: typeof STOP_LOADING_CART };
export type UpdateCartSuccessActionType = { type: typeof UPDATE_CART_SUCCESS };

// 비회원 장바구니 관련
export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';

export type AddCartItemActionType = {
  type: typeof ADD_CART_ITEM;
  payload: CartItemNonMember;
};
export type RemoveCartItemActionType = {
  type: typeof REMOVE_CART_ITEM;
  payload: number;
};
export type UpdateCartItemActionType = {
  type: typeof UPDATE_CART_ITEM;
  payload: { productId: number; productCount: number };
};

export type CartActionTypes =
  | ReturnToCartPageActionType
  | ReturnToCartPageDoneActionType
  | LoadingCartActionType
  | FetchCartSuccessActionType
  | CalculateCartPriceSuccessActionType
  | ClearCartActionType
  | StopLoadingCartActionType
  | UpdateCartSuccessActionType
  | AddCartItemActionType
  | RemoveCartItemActionType
  | UpdateCartItemActionType;
