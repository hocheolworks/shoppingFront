import {
  AuthErrors,
  ReviewError,
  Customer,
  CustomerEditErrors,
} from "../../types/types";
import { LOGOUT_SUCCESS } from "../action-types/auth-action-types";
import {
  FETCH_CUSTOMER_SUCCESS,
  CUSTOMER_ADDED_REVIEW_FAILURE,
  CUSTOMER_ADDED_REVIEW_SUCCESS,
  CUSTOMER_UPDATED_FAILURE,
  CUSTOMER_UPDATED_PASSWORD_FAILURE,
  CUSTOMER_UPDATED_PASSWORD_SUCCESS,
  CUSTOMER_UPDATED_SUCCESS,
  RESET_INPUT_FORM,
  FETCH_CUSTOMER_BY_QUERY_SUCCESS,
  LOADING_CUSTOMER_INFO,
  CustomerActionsTypes,
} from "../action-types/customer-actions-types";

export type InitialStateType = {
  customer: Partial<Customer>;
  isLoggedIn: boolean;
  isLoaded: boolean;
  successMessage: string;
  customerEditErrors: Partial<CustomerEditErrors>;
  customerResetPasswordErrors: Partial<AuthErrors>;
  reviewErrors: Partial<ReviewError>;
  isReviewAdded: boolean;
};

const initialState: InitialStateType = {
  customer: {},
  isLoggedIn: false,
  isLoaded: false,
  successMessage: "",
  customerEditErrors: {},
  customerResetPasswordErrors: {},
  reviewErrors: {},
  isReviewAdded: false,
};

const reducer = (
  state: InitialStateType = initialState,
  action: CustomerActionsTypes
): InitialStateType => {
  switch (action.type) {
    case LOADING_CUSTOMER_INFO:
      // return { ...state, isLoaded: true };
      return { ...state, isLoaded: false }; // hard coding

    case FETCH_CUSTOMER_SUCCESS:
      return {
        ...state,
        customer: action.payload,
        isLoggedIn: true,
        isLoaded: false,
      };

    case CUSTOMER_UPDATED_SUCCESS:
      return { ...state, customer: action.payload, customerEditErrors: {} };

    case CUSTOMER_UPDATED_FAILURE:
      return { ...state, customerEditErrors: action.payload };

    case CUSTOMER_UPDATED_PASSWORD_SUCCESS:
      return {
        ...state,
        successMessage: action.payload,
        customerResetPasswordErrors: {},
      };

    case CUSTOMER_UPDATED_PASSWORD_FAILURE:
      return { ...state, customerResetPasswordErrors: action.payload };

    case CUSTOMER_ADDED_REVIEW_SUCCESS:
      return { ...state, reviewErrors: {}, isReviewAdded: true };

    case CUSTOMER_ADDED_REVIEW_FAILURE:
      return {
        ...state,
        reviewErrors: action.payload,
        isReviewAdded: false,
      };

    case RESET_INPUT_FORM:
      return {
        ...state,
        customerResetPasswordErrors: {},
        successMessage: "",
        customerEditErrors: {},
        reviewErrors: {},
      };

    case LOGOUT_SUCCESS:
      return { ...state, customer: {}, isLoggedIn: false };

    case FETCH_CUSTOMER_BY_QUERY_SUCCESS:
      return {
        ...state,
        customer: action.payload,
        isLoggedIn: true,
        isLoaded: false,
      };

    default:
      return state;
  }
};

export default reducer;
