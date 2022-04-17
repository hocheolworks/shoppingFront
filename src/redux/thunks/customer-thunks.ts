import { Dispatch } from "redux";

import { fetchProductSuccess } from "../actions/product-actions";
import {
  fetchCustomerSuccess,
  loadingCustomerInfo,
  resetInputForm,
  customerAddedReviewFailure,
  customerAddedReviewSuccess,
  customerUpdatedFailure,
  customerUpdatedPasswordFailure,
  customerUpdatedPasswordSuccess,
  customerUpdatedSuccess,
} from "../actions/customer-actions";
import {
  ReviewData,
  CustomerEdit,
  CustomerResetPasswordData,
} from "../../types/types";
import RequestService from "../../utils/request-service";

export const fetchCustomerInfo = () => async (dispatch: Dispatch) => {
  dispatch(loadingCustomerInfo());
  const response = await RequestService.get("/customers/info", true);
  localStorage.setItem("email", response.data.email);
  localStorage.setItem("customerRole", response.data.roles);
  localStorage.setItem("isLoggedIn", "true");
  dispatch(fetchCustomerSuccess(response.data));
};

export const updateCustomerInfo =
  (customerEdit: CustomerEdit) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.put(
        "/account/edit",
        customerEdit,
        true
      );
      dispatch(customerUpdatedSuccess(response.data));
    } catch (error: any) {
      dispatch(customerUpdatedFailure(error.response.data));
    }
  };

export const updateCustomerPassword =
  (data: CustomerResetPasswordData) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.put(
        "/auth/edit/password",
        data,
        true
      );
      dispatch(customerUpdatedPasswordSuccess(response.data));
    } catch (error: any) {
      dispatch(customerUpdatedPasswordFailure(error.response.data));
    }
  };

export const addReviewToProduct =
  (review: ReviewData) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post("/customers/review", review);
      dispatch(fetchProductSuccess(response.data));
      dispatch(customerAddedReviewSuccess());
    } catch (error: any) {
      dispatch(customerAddedReviewFailure(error.response.data));
    }
  };

export const resetForm = () => (dispatch: Dispatch) => {
  dispatch(resetInputForm());
};
