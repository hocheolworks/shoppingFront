import { OrderError, Order, InsertOrder } from '../../types/types';
import { SHOW_LOADER } from '../action-types/auth-action-types';
import {
  FETCH_ORDER_SUCCESS,
  FETCH_USER_ORDERS_SUCCESS,
  ORDER_ADDED_FAILURE,
  ORDER_ADDED_SUCCESS,
  FETCH_USER_ORDERS_BY_QUERY_SUCCESS,
  OrderActionTypes,
  SAVE_INSERT_ORDER_INFORMATION,
  CLEAR_INSERT_ORDER_INFORMATION,
  HIDE_LOADER,
  FETCH_NONMEMBER_ORDERS_SUCCESS,
} from '../action-types/order-action-types';

export type InitialStateType = {
  order: Partial<Order>;
  orders: Array<Order>;
  errors: Partial<OrderError>;
  loading: boolean;
  isOrderAdded: boolean;
  insertOrder: Partial<InsertOrder>;
};

const initialState: InitialStateType = {
  order: {},
  orders: [],
  errors: {},
  loading: false,
  isOrderAdded: false,
  insertOrder: {},
};

const reducer = (
  state: InitialStateType = initialState,
  action: OrderActionTypes
): InitialStateType => {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, loading: true };

    case HIDE_LOADER:
      return { ...state, loading: false };

    case FETCH_ORDER_SUCCESS:
      return { ...state, errors: {}, loading: false };

    case ORDER_ADDED_SUCCESS:
      return {
        ...state,
        order: action.payload,
        loading: false,
        isOrderAdded: true,
      };

    case ORDER_ADDED_FAILURE:
      return {
        ...state,
        errors: action.payload,
        loading: false,
        isOrderAdded: false,
      };

    case FETCH_USER_ORDERS_SUCCESS:
      return { ...state, orders: action.payload, loading: false };

    case FETCH_USER_ORDERS_BY_QUERY_SUCCESS:
      return { ...state, orders: action.payload, loading: false };

    case SAVE_INSERT_ORDER_INFORMATION:
      return { ...state, insertOrder: action.payload };

    case CLEAR_INSERT_ORDER_INFORMATION:
      return { ...state, insertOrder: {} };

    case FETCH_NONMEMBER_ORDERS_SUCCESS:
      return { ...state, order: action.payload, loading:false};

    default:
      return state;
  }
};

export default reducer;
