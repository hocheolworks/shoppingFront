import { InsertOrder, Order, OrderError } from '../../types/types';
import { ShowLoaderActionType } from './auth-action-types';

export const HIDE_LOADER = 'HIDE_LOADER';
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
export const ORDER_ADDED_SUCCESS = 'ORDER_ADDED_SUCCESS';
export const ORDER_ADDED_FAILURE = 'ORDER_ADDED_FAILURE';
export const FETCH_USER_ORDERS_SUCCESS = 'FETCH_ALL_ORDERS_SUCCESS';
export const FETCH_USER_ORDERS_BY_QUERY_SUCCESS =
  'FETCH_USER_ORDERS_BY_QUERY_SUCCESS';
export const SAVE_INSERT_ORDER_INFORMATION = 'SAVE_INSERT_ORDER_INFORMATION';
export const CLEAR_INSERT_ORDER_INFORMATION = 'CLEAR_INSERT_ORDER_INFORMATION';
export const FETCH_NONMEMBER_ORDERS_SUCCESS = 'FETCH_NONMEMBER_ORDERS_SUCCESS';

export type HideLoaderActionType = { type: typeof HIDE_LOADER };
export type FetchOrderSuccessActionType = { type: typeof FETCH_ORDER_SUCCESS };
export type OrderAddedSuccessActionType = {
  type: typeof ORDER_ADDED_SUCCESS;
  payload: Order;
};
export type OrderAddedFailureActionType = {
  type: typeof ORDER_ADDED_FAILURE;
  payload: Partial<OrderError>;
};
export type FetchUserOrdersActionType = {
  type: typeof FETCH_USER_ORDERS_SUCCESS;
  payload: Array<Order>;
};
export type FetchUserOrdersByQueryActionType = {
  type: typeof FETCH_USER_ORDERS_BY_QUERY_SUCCESS;
  payload: Array<Order>;
};
export type SaveInsertOrderInformationActionType = {
  type: typeof SAVE_INSERT_ORDER_INFORMATION;
  payload: Partial<InsertOrder>;
};
export type ClearInsertOrderInformationActionType = {
  type: typeof CLEAR_INSERT_ORDER_INFORMATION;
};
export type FetchNonMemberOrdersSuccessActionType = {
  type: typeof FETCH_NONMEMBER_ORDERS_SUCCESS;
  payload: Order;
};

export type OrderActionTypes =
  | HideLoaderActionType
  | FetchOrderSuccessActionType
  | OrderAddedSuccessActionType
  | OrderAddedFailureActionType
  | FetchUserOrdersActionType
  | ShowLoaderActionType
  | FetchUserOrdersByQueryActionType
  | SaveInsertOrderInformationActionType
  | ClearInsertOrderInformationActionType
  | FetchNonMemberOrdersSuccessActionType;
