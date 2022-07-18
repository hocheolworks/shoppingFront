import {
  Estimate,
  EstimatePayment,
  InsertOrder,
  Order,
  OrderError,
  TaxBillError,
  TaxBillInfo,
} from "../../types/types";
import { ShowLoaderActionType } from "./auth-action-types";

export const HIDE_LOADER = "HIDE_LOADER";
export const FETCH_ORDER_SUCCESS = "FETCH_ORDER_SUCCESS";
export const ORDER_ADDED_SUCCESS = "ORDER_ADDED_SUCCESS";
export const ORDER_ADDED_FAILURE = "ORDER_ADDED_FAILURE";
export const FETCH_USER_ORDERS_SUCCESS = "FETCH_ALL_ORDERS_SUCCESS";
export const FETCH_USER_ORDERS_BY_QUERY_SUCCESS =
  "FETCH_USER_ORDERS_BY_QUERY_SUCCESS";
export const SAVE_INSERT_ORDER_INFORMATION = "SAVE_INSERT_ORDER_INFORMATION";
export const SAVE_INSERT_ORDER_DESIGN_FILE = "SAVE_INSERT_ORDER_DESIGN_FILE";
export const CLEAR_INSERT_ORDER_INFORMATION = "CLEAR_INSERT_ORDER_INFORMATION";
export const FETCH_NONMEMBER_ORDERS_SUCCESS = "FETCH_NONMEMBER_ORDERS_SUCCESS";
export const SAVE_TAX_BILL_INFO_FAILURE = "SAVE_TAX_BILL_INFO_FAILURE";
export const SAVE_TAX_BILL_INFO_SUCCESS = "SAVE_TAX_BILL_INFO_SUCCESS";
export const FETCH_USER_ESTIMATES_SUCCESS = "FETCH_USER_ESTIMATES_SUCCESS";
export const FETCH_ALL_ESTIMATES_SUCCESS = "FETCH_ALL_ESTIMATES_SUCCESS";
export const ESTIMATE_SHEET_ADDED_SUCCESS = "ESTIMATE_SHEET_ADDED_SUCCESS";
export const SAVE_ESTIMATE_PAYMENT_INFO = "SAVE_ESTIMATE_PAYMENT_INFO";
export const CLEAR_ESTIMATE_PAYMENT_INFO = "CLEAR_ESTIMATE_PAYMENT_INFO";

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

export type SaveInsertOrderDesignFileActionType = {
  type: typeof SAVE_INSERT_ORDER_DESIGN_FILE;
  payload: string | Blob;
};
export type ClearInsertOrderInformationActionType = {
  type: typeof CLEAR_INSERT_ORDER_INFORMATION;
};
export type FetchNonMemberOrdersSuccessActionType = {
  type: typeof FETCH_NONMEMBER_ORDERS_SUCCESS;
  payload: Order;
};

export type SaveTaxBillInfoFailureActionType = {
  type: typeof SAVE_TAX_BILL_INFO_FAILURE;
  payload: Partial<TaxBillError>;
};

export type SaveTaxBillInfoSuccessActionType = {
  type: typeof SAVE_TAX_BILL_INFO_SUCCESS;
  payload: TaxBillInfo;
};

export type FetchUserEstimatesActionType = {
  type: typeof FETCH_USER_ESTIMATES_SUCCESS;
  payload: Array<Estimate>;
};

export type FetchAllEstimatesActionType = {
  type: typeof FETCH_ALL_ESTIMATES_SUCCESS;
  payload: Array<Estimate>;
};

export type EstimateSheetAddedSuccessActionType = {
  type: typeof ESTIMATE_SHEET_ADDED_SUCCESS;
};

export type SaveEstimatePaymentInfoActionType = {
  type: typeof SAVE_ESTIMATE_PAYMENT_INFO;
  payload: Partial<EstimatePayment>;
};

export type ClearEstimatePaymentInfoActionType = {
  type: typeof CLEAR_ESTIMATE_PAYMENT_INFO;
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
  | SaveInsertOrderDesignFileActionType
  | ClearInsertOrderInformationActionType
  | FetchNonMemberOrdersSuccessActionType
  | SaveTaxBillInfoFailureActionType
  | SaveTaxBillInfoSuccessActionType
  | FetchUserEstimatesActionType
  | FetchAllEstimatesActionType
  | EstimateSheetAddedSuccessActionType
  | SaveEstimatePaymentInfoActionType
  | ClearEstimatePaymentInfoActionType;
