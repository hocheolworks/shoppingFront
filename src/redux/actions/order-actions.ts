import {
  Estimate,
  EstimatePayment,
  InsertOrder,
  Order,
  OrderError,
  TaxBillError,
  TaxBillInfo,
} from "../../types/types";
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
  SaveTaxBillInfoFailureActionType,
  SAVE_TAX_BILL_INFO_FAILURE,
  SaveTaxBillInfoSuccessActionType,
  SAVE_TAX_BILL_INFO_SUCCESS,
  FetchUserEstimatesActionType,
  FETCH_USER_ESTIMATES_SUCCESS,
  EstimateSheetAddedSuccessActionType,
  ESTIMATE_SHEET_ADDED_SUCCESS,
  FetchAllEstimatesActionType,
  FETCH_ALL_ESTIMATES_SUCCESS,
  SaveEstimatePaymentInfoActionType,
  SAVE_ESTIMATE_PAYMENT_INFO,
  CLEAR_ESTIMATE_PAYMENT_INFO,
  ClearEstimatePaymentInfoActionType,
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

export const saveTaxBillInfoFailure = (
  errors: Partial<TaxBillError>
): SaveTaxBillInfoFailureActionType => ({
  type: SAVE_TAX_BILL_INFO_FAILURE,
  payload: errors,
});

export const saveTaxBillInfoSuccess = (
  taxBillInfo: TaxBillInfo
): SaveTaxBillInfoSuccessActionType => ({
  type: SAVE_TAX_BILL_INFO_SUCCESS,
  payload: taxBillInfo,
});

export const fetchUserEstimatesSuccess = (
  estimates: Array<Estimate>
): FetchUserEstimatesActionType => ({
  type: FETCH_USER_ESTIMATES_SUCCESS,
  payload: estimates,
});

export const fetchAllEstimatesSuccess = (
  estimates: Array<Estimate>
): FetchAllEstimatesActionType => ({
  type: FETCH_ALL_ESTIMATES_SUCCESS,
  payload: estimates,
});

export const estimateSheetAddedSuccess =
  (): EstimateSheetAddedSuccessActionType => ({
    type: ESTIMATE_SHEET_ADDED_SUCCESS,
  });

export const saveEstimatePaymentInfo = (
  estimatePaymentInfo: EstimatePayment
): SaveEstimatePaymentInfoActionType => ({
  type: SAVE_ESTIMATE_PAYMENT_INFO,
  payload: estimatePaymentInfo,
});

export const clearEstimatePaymentInfo =
  (): ClearEstimatePaymentInfoActionType => ({
    type: CLEAR_ESTIMATE_PAYMENT_INFO,
  });
