import {
  OrderError,
  Order,
  InsertOrder,
  TaxBillInfo,
  TaxBillError,
  SheetRequestData,
  Estimate,
} from "../../types/types";
import { SHOW_LOADER } from "../action-types/auth-action-types";
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
  SAVE_TAX_BILL_INFO_FAILURE,
  SAVE_TAX_BILL_INFO_SUCCESS,
  FETCH_USER_ESTIMATES_SUCCESS,
  ESTIMATE_SHEET_ADDED_SUCCESS,
} from "../action-types/order-action-types";

export type InitialStateType = {
  order: Partial<Order>;
  orders: Array<Order>;
  errors: Partial<OrderError>;
  loading: boolean;
  isOrderAdded: boolean;
  insertOrder: Partial<InsertOrder>;
  taxBillInfo: Partial<TaxBillInfo>;
  taxBillError: Partial<TaxBillError>;
  sheetRequestData : Partial<SheetRequestData>;
  estimates: Array<Estimate>;
  isEstimateAdded: boolean;
};

const initialState: InitialStateType = {
  order: {},
  orders: [],
  errors: {},
  loading: false,
  isOrderAdded: false,
  insertOrder: {},
  taxBillInfo: {},
  taxBillError: {},
  sheetRequestData: {},
  estimates: [],
  isEstimateAdded: false,
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

    // case SAVE_INSERT_ORDER_DESIGN_FILE:
    //   return { ...state, insertOrderDesignFile: action.payload };

    case CLEAR_INSERT_ORDER_INFORMATION:
      return { ...state, insertOrder: {} };

    case FETCH_NONMEMBER_ORDERS_SUCCESS:
      return { ...state, order: action.payload, loading: false };

    case SAVE_TAX_BILL_INFO_FAILURE:
      return { ...state, taxBillError: action.payload };

    case SAVE_TAX_BILL_INFO_SUCCESS:
      return { ...state, taxBillInfo: action.payload };
    
    case FETCH_USER_ESTIMATES_SUCCESS:
      return { ...state, estimates: action.payload, loading: false, isEstimateAdded: false };

    case ESTIMATE_SHEET_ADDED_SUCCESS:
      return { ...state, loading: false, isEstimateAdded: true };
    default:
      return state;
  }
};

export default reducer;
