import {
  PRODUCT_ADDED_SUCCESS,
  PRODUCT_UPDATED_SUCCESS,
  PRODUCT_ADDED_FAILURE,
  PRODUCT_UPDATED_FAILURE,
  FETCH_USER_INFO_SUCCESS,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_ORDERS_SUCCESS,
  FETCH_USER_ORDERS_SUCCESS,
  FORM_RESET,
  FETCH_USER_INFO_BY_QUERY_SUCCESS,
  FETCH_ALL_USERS_BY_QUERY_SUCCESS,
  FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS,
  FETCH_USER_ORDERS_BY_QUERY_SUCCESS,
  LOADING_DATA,
  PRODUCT_DELETE_FAILURE,
} from '../action-types/admin-action-types';
import { Customer, Order, ProductErrors } from '../../types/types';
import { AdminActionTypes } from '../action-types/admin-action-types';

export type InitialStateType = {
  orders: Array<Order>;
  customerOrders: Array<Order>;
  customers: Array<Customer>;
  customer: Partial<Customer>;
  errors: Partial<ProductErrors>;
  isProductAdded: boolean;
  isProductEdited: boolean;
  isLoaded: boolean;
};

const initialState: InitialStateType = {
  orders: [],
  customerOrders: [],
  customers: [],
  customer: {},
  errors: {},
  isProductAdded: false,
  isProductEdited: false,
  isLoaded: false,
};

const reducer = (
  state: InitialStateType = initialState,
  action: AdminActionTypes
): InitialStateType => {
  switch (action.type) {
    case LOADING_DATA:
      return { ...state, isLoaded: true };

    case PRODUCT_ADDED_SUCCESS:
      return { ...state, isProductAdded: true, errors: {} };

    case PRODUCT_ADDED_FAILURE:
      return { ...state, isProductAdded: false, errors: action.payload };

    case PRODUCT_UPDATED_SUCCESS:
      return { ...state, isProductEdited: true, errors: {} };

    case PRODUCT_UPDATED_FAILURE:
      return { ...state, isProductEdited: false, errors: action.payload };

    case PRODUCT_DELETE_FAILURE:
      return {
        ...state,
        isProductAdded: false,
        isProductEdited: false,
        errors: action.payload,
      };

    case FETCH_USER_INFO_SUCCESS:
      return { ...state, customer: action.payload, isLoaded: false };

    case FETCH_ALL_USERS_SUCCESS:
      return { ...state, customers: action.payload, isLoaded: false };

    case FETCH_ALL_USERS_ORDERS_SUCCESS:
      return { ...state, orders: action.payload, isLoaded: false };

    case FETCH_USER_ORDERS_SUCCESS:
      return { ...state, customerOrders: action.payload };

    case FETCH_USER_INFO_BY_QUERY_SUCCESS:
      return { ...state, customer: action.payload, isLoaded: false };

    case FETCH_ALL_USERS_BY_QUERY_SUCCESS:
      return { ...state, customers: action.payload, isLoaded: false };

    case FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS:
      return { ...state, orders: action.payload, isLoaded: false };

    case FETCH_USER_ORDERS_BY_QUERY_SUCCESS:
      return { ...state, customerOrders: action.payload, isLoaded: false };

    case FORM_RESET:
      return {
        ...state,
        isProductAdded: false,
        isProductEdited: false,
        errors: {},
      };

    default:
      return state;
  }
};

export default reducer;
