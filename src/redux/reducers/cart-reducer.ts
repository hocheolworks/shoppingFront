import { StaticRouter } from 'react-router-dom';
import { CartItem, CartItemNonMember, Product } from '../../types/types';
import {
  CALCULATE_CART_PRICE_SUCCESS,
  CLEAR_CART_SUCCESS,
  FETCH_CART_SUCCESS,
  LOADING_CART,
  STOP_LOADING_CART,
  CartActionTypes,
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM,
  RETURN_TO_CART_PAGE,
  RETURN_TO_CART_PAGE_DONE,
} from '../action-types/cart-action-types';

export type InitialStateType = {
  cartItems: Array<CartItem | CartItemNonMember>;
  loading: boolean;
  totalPrice: number;
  returnToCartPage: boolean;
};

const initialState: InitialStateType = {
  cartItems: [],
  loading: false,
  totalPrice: 0,
  returnToCartPage: false,
};

const reducer = (
  state: InitialStateType = initialState,
  action: CartActionTypes
): InitialStateType => {
  switch (action.type) {
    case RETURN_TO_CART_PAGE:
      return { ...state, returnToCartPage: true };

    case RETURN_TO_CART_PAGE_DONE:
      return { ...state, returnToCartPage: false };

    case LOADING_CART:
      return { ...state, loading: true };

    case FETCH_CART_SUCCESS:
      return { ...state, cartItems: action.payload, loading: false };

    case CALCULATE_CART_PRICE_SUCCESS:
      return { ...state, totalPrice: action.payload, loading: false };

    case STOP_LOADING_CART:
      return { ...state, loading: false, cartItems: [] };

    case CLEAR_CART_SUCCESS:
      return { ...state, cartItems: [] };

    // 비회원 장바구니 관련

    case ADD_CART_ITEM:
      return { ...state, cartItems: [...state.cartItems, action.payload] };

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (value: CartItem | CartItemNonMember) => {
            if (value.productId === action.payload) {
              return false;
            } else {
              return true;
            }
          }
        ),
      };

    case UPDATE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.map((value) => {
          if (value.productId === action.payload.productId) {
            value.productCount = action.payload.productCount;
          }
          return value;
        }),
      };

    default:
      return state;
  }
};

export default reducer;
