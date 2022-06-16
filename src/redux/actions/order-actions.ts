import { InsertOrder, Order, OrderError } from "../../types/types";
import {
  ShowLoaderActionType,
  SHOW_LOADER,
} from "../action-types/auth-action-types";
import {
  FETCH_ORDER_SUCCESS,
  FETCH_USER_ORDERS_SUCCESS,
  ORDER_ADDED_FAILURE,
  ORDER_ADDED_SUCCESS,
  FETCH_USER_ORDERS_BY_QUERY_SUCCESS,
  FetchOrderSuccessActionType,
  FetchUserOrdersActionType,
  OrderAddedFailureActionType,
  OrderAddedSuccessActionType,
  FetchUserOrdersByQueryActionType,
  SaveInsertOrderInformationActionType,
  SAVE_INSERT_ORDER_INFORMATION,
  ClearInsertOrderInformationActionType,
  CLEAR_INSERT_ORDER_INFORMATION,
  HIDE_LOADER,
  HideLoaderActionType,
  FetchNonMemberOrdersSuccessActionType,
  FETCH_NONMEMBER_ORDERS_SUCCESS,
  SAVE_INSERT_ORDER_DESIGN_FILE,
  SaveInsertOrderDesignFileActionType,
} from "../action-types/order-action-types";

export const showLoader = (): ShowLoaderActionType => ({
  type: SHOW_LOADER,
});

export const hideLoader = (): HideLoaderActionType => ({
  type: HIDE_LOADER,
});

export const fetchOrderSuccess = (): FetchOrderSuccessActionType => ({
  type: FETCH_ORDER_SUCCESS,
});

export const orderAddedSuccess = (
  order: Order
): OrderAddedSuccessActionType => ({
  type: ORDER_ADDED_SUCCESS,
  payload: order,
});

export const orderAddedFailure = (
  errors: Partial<OrderError>
): OrderAddedFailureActionType => ({
  type: ORDER_ADDED_FAILURE,
  payload: errors,
});

export const fetchUserOrdersSuccess = (
  orders: Array<Order>
): FetchUserOrdersActionType => ({
  type: FETCH_USER_ORDERS_SUCCESS,
  payload: orders,
});

export const fetchUserOrdersByQuerySuccess = (
  orders: Array<Order>
): FetchUserOrdersByQueryActionType => ({
  type: FETCH_USER_ORDERS_BY_QUERY_SUCCESS,
  payload: orders,
});

export const saveInsertOrderInformation = (
  insertOrder: Partial<InsertOrder>
): SaveInsertOrderInformationActionType => ({
  type: SAVE_INSERT_ORDER_INFORMATION,
  payload: insertOrder,
});

export const saveInsertOrderDesignFile = (
  file: string | Blob
): SaveInsertOrderDesignFileActionType => ({
  type: SAVE_INSERT_ORDER_DESIGN_FILE,
  payload: file,
});

export const clearInsertOrderInformation =
  (): ClearInsertOrderInformationActionType => ({
    type: CLEAR_INSERT_ORDER_INFORMATION,
  });

export const fetchNonMemberOrdersSuccess = (
  order: Order
): FetchNonMemberOrdersSuccessActionType => ({
  type: FETCH_NONMEMBER_ORDERS_SUCCESS,
  payload: order,
});
