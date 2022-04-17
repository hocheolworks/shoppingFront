import { CartItem, Product } from '../../types/types';

export const CALCULATE_CART_PRICE_SUCCESS = 'CALCULATE_CART_PRICE_SUCCESS';
export const CLEAR_CART_SUCCESS = 'CLEAR_CART_SUCCESS';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const LOADING_CART = 'LOADING_CART';
export const STOP_LOADING_CART = 'STOP_LOADING_CART';
export const UPDATE_CART_SUCCESS = 'UPDATE_CART_SUCCESS';

export type LoadingCartActionType = { type: typeof LOADING_CART };
export type FetchCartSuccessActionType = {
  type: typeof FETCH_CART_SUCCESS;
  payload: Array<CartItem>;
};
export type CalculateCartPriceSuccessActionType = {
  type: typeof CALCULATE_CART_PRICE_SUCCESS;
  payload: number;
};
export type ClearCartActionType = { type: typeof CLEAR_CART_SUCCESS };
export type StopLoadingCartActionType = { type: typeof STOP_LOADING_CART };
export type UpdateCartSuccessActionType = { type: typeof UPDATE_CART_SUCCESS };

export type CartActionTypes =
  | LoadingCartActionType
  | FetchCartSuccessActionType
  | CalculateCartPriceSuccessActionType
  | ClearCartActionType
  | StopLoadingCartActionType
  | UpdateCartSuccessActionType;
