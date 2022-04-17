import { Order, ProductErrors, Customer } from "../../types/types";
import {
  FETCH_ALL_USERS_ORDERS_SUCCESS,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_ORDERS_SUCCESS,
  FORM_RESET,
  PRODUCT_ADDED_FAILURE,
  PRODUCT_ADDED_SUCCESS,
  PRODUCT_UPDATED_FAILURE,
  PRODUCT_UPDATED_SUCCESS,
  FETCH_ALL_USERS_BY_QUERY_SUCCESS,
  FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS,
  FETCH_USER_INFO_BY_QUERY_SUCCESS,
  FETCH_USER_ORDERS_BY_QUERY_SUCCESS,
  LOADING_DATA,
  GetAllUsersActionType,
  GetAllUsersOrdersActionType,
  GetUserInfoActionType,
  GetUserOrdersActionType,
  ResetActionType,
  UpdateProductFailureActionType,
  UpdateProductSuccessActionType,
  AddProductFailureActionType,
  AddProductSuccessActionType,
  GetAllUsersByQueryActionType,
  GetAllUsersOrdersByQueryActionType,
  GetUserOrdersByQueryActionType,
  GetUserInfoByQueryActionType,
  LoadingDataActionType,
} from "../action-types/admin-action-types";

export const loadingData = (): LoadingDataActionType => ({
  type: LOADING_DATA,
});

export const addProductSuccess = (): AddProductSuccessActionType => ({
  type: PRODUCT_ADDED_SUCCESS,
});

export const addProductFailure = (
  error: ProductErrors
): AddProductFailureActionType => ({
  type: PRODUCT_ADDED_FAILURE,
  payload: error,
});

export const updateProductSuccess = (): UpdateProductSuccessActionType => ({
  type: PRODUCT_UPDATED_SUCCESS,
});

export const updateProductFailure = (
  error: ProductErrors
): UpdateProductFailureActionType => ({
  type: PRODUCT_UPDATED_FAILURE,
  payload: error,
});

export const getAllUsersOrders = (
  orders: Array<Order>
): GetAllUsersOrdersActionType => ({
  type: FETCH_ALL_USERS_ORDERS_SUCCESS,
  payload: orders,
});

export const getUserOrders = (
  orders: Array<Order>
): GetUserOrdersActionType => ({
  type: FETCH_USER_ORDERS_SUCCESS,
  payload: orders,
});

export const getAllUsers = (users: Array<Customer>): GetAllUsersActionType => ({
  type: FETCH_ALL_USERS_SUCCESS,
  payload: users,
});

export const getUserInfo = (user: Customer): GetUserInfoActionType => ({
  type: FETCH_USER_INFO_SUCCESS,
  payload: user,
});

export const reset = (): ResetActionType => ({
  type: FORM_RESET,
});

export const getUserInfoByQuery = (
  user: Customer
): GetUserInfoByQueryActionType => ({
  type: FETCH_USER_INFO_BY_QUERY_SUCCESS,
  payload: user,
});

export const getAllUsersByQuery = (
  users: Array<Customer>
): GetAllUsersByQueryActionType => ({
  type: FETCH_ALL_USERS_BY_QUERY_SUCCESS,
  payload: users,
});

export const getAllUsersOrdersByQuery = (
  orders: Array<Order>
): GetAllUsersOrdersByQueryActionType => ({
  type: FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS,
  payload: orders,
});

export const getUserOrdersByQuery = (
  orders: Array<Order>
): GetUserOrdersByQueryActionType => ({
  type: FETCH_USER_ORDERS_BY_QUERY_SUCCESS,
  payload: orders,
});
