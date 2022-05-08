import {
  AuthErrors,
  ReviewError,
  Customer,
  CustomerEditErrors,
  CartItem,
} from '../../types/types';
import { LogoutSuccessActionType } from './auth-action-types';

export const LOADING_CUSTOMER_INFO = 'LOADING_CUSTOMER_INFO';
export const FETCH_CUSTOMER_SUCCESS = 'FETCH_CUSTOMER_SUCCESS';
export const CUSTOMER_UPDATED_SUCCESS = 'CUSTOMER_UPDATED_SUCCESS';
export const CUSTOMER_UPDATED_FAILURE = 'CUSTOMER_UPDATED_FAILURE';
export const CUSTOMER_UPDATED_PASSWORD_SUCCESS =
  'CUSTOMER_UPDATED_PASSWORD_SUCCESS';
export const CUSTOMER_UPDATED_PASSWORD_FAILURE =
  'CUSTOMER_UPDATED_PASSWORD_FAILURE';
export const CUSTOMER_ADDED_REVIEW_SUCCESS = 'CUSTOMER_ADDED_REVIEW_SUCCESS';
export const CUSTOMER_ADDED_REVIEW_FAILURE = 'CUSTOMER_ADDED_REVIEW_FAILURE';
export const RESET_INPUT_FORM = 'RESET_INPUT_FORM';
export const FETCH_CUSTOMER_BY_QUERY_SUCCESS =
  'FETCH_CUSTOMER_BY_QUERY_SUCCESS';
export const CUSTOMER_DELETED_REVIEW_SUCCESS = 'CUSTOMER_DELETED_REVIEW_SUCCESS';

export type LoadingCustomerInfoActionType = {
  type: typeof LOADING_CUSTOMER_INFO;
};
export type FetchCustomerSuccessActionType = {
  type: typeof FETCH_CUSTOMER_SUCCESS;
  payload: Customer;
};
export type CustomerUpdatedSuccessActionType = {
  type: typeof CUSTOMER_UPDATED_SUCCESS;
  payload: Customer;
};
export type CustomerUpdatedFailureActionType = {
  type: typeof CUSTOMER_UPDATED_FAILURE;
  payload: CustomerEditErrors;
};
export type CustomerUpdatedPasswordSuccessActionType = {
  type: typeof CUSTOMER_UPDATED_PASSWORD_SUCCESS;
  payload: string;
};
export type CustomerUpdatedPasswordFailureActionType = {
  type: typeof CUSTOMER_UPDATED_PASSWORD_FAILURE;
  payload: AuthErrors;
};
export type CustomerAddedReviewSuccessActionType = {
  type: typeof CUSTOMER_ADDED_REVIEW_SUCCESS;
};
export type CustomerAddedReviewFailureActionType = {
  type: typeof CUSTOMER_ADDED_REVIEW_FAILURE;
  payload: ReviewError;
};
export type ResetInputFormActionType = { type: typeof RESET_INPUT_FORM };
export type FetchCustomerByQuerySuccessActionType = {
  type: typeof FETCH_CUSTOMER_BY_QUERY_SUCCESS;
  payload: Customer;
};

export type CustomerDeletedReviewSuccessActionType = {
  type: typeof CUSTOMER_DELETED_REVIEW_SUCCESS;
};

export type CustomerActionsTypes =
  | LoadingCustomerInfoActionType
  | CustomerUpdatedSuccessActionType
  | FetchCustomerSuccessActionType
  | CustomerUpdatedFailureActionType
  | CustomerUpdatedPasswordSuccessActionType
  | CustomerUpdatedPasswordFailureActionType
  | CustomerAddedReviewSuccessActionType
  | CustomerAddedReviewFailureActionType
  | ResetInputFormActionType
  | LogoutSuccessActionType
  | FetchCustomerByQuerySuccessActionType
  | CustomerDeletedReviewSuccessActionType;