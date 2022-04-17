import { Order, ProductErrors, Customer } from "../../types/types";

export const LOADING_DATA = "LOADING_DATA";
export const FETCH_ALL_USERS_ORDERS_SUCCESS = "FETCH_ALL_USERS_ORDERS_SUCCESS";
export const FETCH_USER_ORDERS_SUCCESS = "FETCH_USER_ORDERS_SUCCESS";
export const FETCH_ALL_USERS_SUCCESS = "FETCH_ALL_USERS_SUCCESS";
export const FETCH_USER_INFO_SUCCESS = "FETCH_USER_INFO_SUCCESS";
export const FORM_RESET = "FORM_RESET";
export const PRODUCT_ADDED_FAILURE = "PRODUCT_ADDED_FAILURE";
export const PRODUCT_ADDED_SUCCESS = "PRODUCT_ADDED_SUCCESS";
export const PRODUCT_UPDATED_FAILURE = "PRODUCT_UPDATED_FAILURE";
export const PRODUCT_UPDATED_SUCCESS = "PRODUCT_UPDATED_SUCCESS";
export const FETCH_USER_INFO_BY_QUERY_SUCCESS =
  "FETCH_USER_INFO_BY_QUERY_SUCCESS";
export const FETCH_ALL_USERS_BY_QUERY_SUCCESS =
  "FETCH_ALL_USERS_BY_QUERY_SUCCESS";
export const FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS =
  "FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS";
export const FETCH_USER_ORDERS_BY_QUERY_SUCCESS =
  "FETCH_USER_ORDERS_BY_QUERY_SUCCESS";

export type LoadingDataActionType = { type: typeof LOADING_DATA };
export type AddProductSuccessActionType = {
  type: typeof PRODUCT_ADDED_SUCCESS;
};
export type AddProductFailureActionType = {
  type: typeof PRODUCT_ADDED_FAILURE;
  payload: ProductErrors;
};
export type UpdateProductSuccessActionType = {
  type: typeof PRODUCT_UPDATED_SUCCESS;
};
export type UpdateProductFailureActionType = {
  type: typeof PRODUCT_UPDATED_FAILURE;
  payload: ProductErrors;
};
export type GetAllUsersOrdersActionType = {
  type: typeof FETCH_ALL_USERS_ORDERS_SUCCESS;
  payload: Array<Order>;
};
export type GetUserOrdersActionType = {
  type: typeof FETCH_USER_ORDERS_SUCCESS;
  payload: Array<Order>;
};
export type GetAllUsersActionType = {
  type: typeof FETCH_ALL_USERS_SUCCESS;
  payload: Array<Customer>;
};
export type GetUserInfoActionType = {
  type: typeof FETCH_USER_INFO_SUCCESS;
  payload: Customer;
};
export type ResetActionType = { type: typeof FORM_RESET };
export type GetUserInfoByQueryActionType = {
  type: typeof FETCH_USER_INFO_BY_QUERY_SUCCESS;
  payload: Customer;
};
export type GetAllUsersByQueryActionType = {
  type: typeof FETCH_ALL_USERS_BY_QUERY_SUCCESS;
  payload: Array<Customer>;
};
export type GetAllUsersOrdersByQueryActionType = {
  type: typeof FETCH_ALL_USERS_ORDERS_BY_QUERY_SUCCESS;
  payload: Array<Order>;
};
export type GetUserOrdersByQueryActionType = {
  type: typeof FETCH_USER_ORDERS_BY_QUERY_SUCCESS;
  payload: Array<Order>;
};

export type AdminActionTypes =
  | LoadingDataActionType
  | AddProductSuccessActionType
  | AddProductFailureActionType
  | UpdateProductSuccessActionType
  | UpdateProductFailureActionType
  | GetAllUsersOrdersActionType
  | GetUserOrdersActionType
  | GetAllUsersActionType
  | GetUserInfoActionType
  | ResetActionType
  | GetUserInfoByQueryActionType
  | GetAllUsersByQueryActionType
  | GetAllUsersOrdersByQueryActionType
  | GetUserOrdersByQueryActionType;
