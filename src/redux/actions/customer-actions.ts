import {
  AuthErrors,
  ReviewError,
  Customer,
  CustomerEditErrors,
} from "../../types/types";
import {
  LOADING_CUSTOMER_INFO,
  FETCH_CUSTOMER_SUCCESS,
  RESET_INPUT_FORM,
  CUSTOMER_ADDED_REVIEW_FAILURE,
  CUSTOMER_ADDED_REVIEW_SUCCESS,
  CUSTOMER_UPDATED_FAILURE,
  CUSTOMER_UPDATED_PASSWORD_FAILURE,
  CUSTOMER_UPDATED_PASSWORD_SUCCESS,
  CUSTOMER_UPDATED_SUCCESS,
  FETCH_CUSTOMER_BY_QUERY_SUCCESS,
  CustomerAddedReviewFailureActionType,
  CustomerAddedReviewSuccessActionType,
  CustomerUpdatedFailureActionType,
  CustomerUpdatedPasswordFailureActionType,
  CustomerUpdatedPasswordSuccessActionType,
  CustomerUpdatedSuccessActionType,
  ResetInputFormActionType,
  FetchCustomerSuccessActionType,
  FetchCustomerByQuerySuccessActionType,
  LoadingCustomerInfoActionType,
  CustomerDeletedReviewSuccessActionType,
  CUSTOMER_DELETED_REVIEW_SUCCESS,
  ReLoadSuccessActionType,
  RELOAD_SUCCESS,
} from "../action-types/customer-actions-types";

export const loadingCustomerInfo = (): LoadingCustomerInfoActionType => ({
  type: LOADING_CUSTOMER_INFO,
});

export const fetchCustomerSuccess = (
  customer: Customer
): FetchCustomerSuccessActionType => ({
  type: FETCH_CUSTOMER_SUCCESS,
  payload: customer,
});

export const customerUpdatedSuccess = (
  customer: Customer
): CustomerUpdatedSuccessActionType => ({
  type: CUSTOMER_UPDATED_SUCCESS,
  payload: customer,
});

export const customerUpdatedFailure = (
  errors: CustomerEditErrors
): CustomerUpdatedFailureActionType => ({
  type: CUSTOMER_UPDATED_FAILURE,
  payload: errors,
});

export const customerUpdatedPasswordSuccess = (
  message: string
): CustomerUpdatedPasswordSuccessActionType => ({
  type: CUSTOMER_UPDATED_PASSWORD_SUCCESS,
  payload: message,
});

export const customerUpdatedPasswordFailure = (
  errors: AuthErrors
): CustomerUpdatedPasswordFailureActionType => ({
  type: CUSTOMER_UPDATED_PASSWORD_FAILURE,
  payload: errors,
});

export const customerAddedReviewSuccess =
  (): CustomerAddedReviewSuccessActionType => ({
    type: CUSTOMER_ADDED_REVIEW_SUCCESS,
  });

export const customerAddedReviewFailure = (
  errors: ReviewError
): CustomerAddedReviewFailureActionType => ({
  type: CUSTOMER_ADDED_REVIEW_FAILURE,
  payload: errors,
});

export const resetInputForm = (): ResetInputFormActionType => ({
  type: RESET_INPUT_FORM,
});

export const fetchCustomerByQuerySuccess = (
  customer: Customer
): FetchCustomerByQuerySuccessActionType => ({
  type: FETCH_CUSTOMER_BY_QUERY_SUCCESS,
  payload: customer,
});

export const customerDeletedReviewSuccess = 
  (): CustomerDeletedReviewSuccessActionType => ({
    type: CUSTOMER_DELETED_REVIEW_SUCCESS,
  });

export const reloadSuccess =
  (): ReLoadSuccessActionType => ({
    type: RELOAD_SUCCESS,
  })