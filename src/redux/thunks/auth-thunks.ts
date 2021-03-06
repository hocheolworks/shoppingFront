import { fetchCustomerSuccess } from "./../actions/customer-actions";
import { emailVerifySuccess } from "./../actions/auth-actions";
import {
  CartItem,
  CartItemNonMember,
  RegistrationEmailData,
} from "./../../types/types";
import {
  activateAccountFailure,
  activateAccountSuccess,
  forgotPasswordFailure,
  forgotPasswordSuccess,
  loginFailure,
  loginSuccess,
  logoutSuccess,
  registerFailure,
  registerSuccess,
  resetPasswordCodeFailure,
  resetPasswordCodeSuccess,
  resetPasswordFailure,
  resetPasswordSuccess,
  showLoader,
} from "../actions/auth-actions";
import { reset } from "../actions/admin-actions";
import {
  CustomerData,
  CustomerRegistration,
  CustomerResetPasswordData,
} from "../../types/types";
import { Dispatch } from "redux";
import RequestService from "../../utils/request-service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  clearCartSuccess,
  fetchCartSuccess,
  returnToCartPageDone,
} from "../actions/cart-actions";

const MySwal = withReactContent(Swal);

export const login =
  (
    customerData: CustomerData,
    router: any,
    cart: Array<CartItem | CartItemNonMember>,
    returnToCartPage: boolean
  ) =>
  async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post(
        "/customer/login",
        customerData
      );
      sessionStorage.setItem("customerName", response.data.customerName);
      sessionStorage.setItem("customerEmail", response.data.customerEmail);
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("customerRole", response.data.customerRole);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("id", response.data.id);
      dispatch(loginSuccess(response.data.customerRole));
      dispatch(fetchCustomerSuccess(response.data));

      if (cart.length > 0) {
        // 비회원으로 담은 장바구니가 있을 때
        // 이정철 CTO 날리라고 함 ㅅㅂ럼
        // await RequestService.put(
        //   `/customer/${response.data.id}/cart/all`,
        //   cart
        // );
        dispatch(clearCartSuccess());
      }

      const cartResponse = await RequestService.get(
        `/customer/${response.data.id}/cart`
      );
      dispatch(fetchCartSuccess(cartResponse.data));

      if (returnToCartPage) {
        dispatch(returnToCartPageDone());
        router.push("/cart");
      } else {
        router.push("/account");
      }
    } catch (error: any) {
      let errorMessage = error.response.data.message;

      await MySwal.fire({
        title: `<strong>로그인 실패!</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: "error",
      });
    }
  };

export const emailValidation =
  (userRegistrationData: CustomerRegistration) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      await RequestService.post("/customer/verify-phone", userRegistrationData);
      dispatch(emailVerifySuccess());
    } catch (error: any) {
      dispatch(registerFailure(error.response.data));
      let errorMessage = error.response.data.message;
      if (Array.isArray(error.response.data.message)) {
        if (/[a-zA-Z]/.test(error.response.data.message[0])) {
          errorMessage = "입력하신 정보를 확인해주세요";
        } else {
          errorMessage = error.response.data.message[0];
        }
      }
      await MySwal.fire({
        title: `<strong>휴대폰 인증 실패!</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: "error",
      });
    }
  };

export const registration =
  (userRegistrationData: CustomerRegistration) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      await RequestService.post("/customer", userRegistrationData);
      dispatch(registerSuccess());
    } catch (error: any) {
      let errorMessage = error.response.data.message;
      dispatch(registerFailure(error.response.data));

      if (Array.isArray(error.response.data.message)) {
        if (/[a-zA-Z]/.test(error.response.data.message[0])) {
          errorMessage = "입력하신 정보를 확인해주세요";
        } else {
          errorMessage = error.response.data.message[0];
        }
      }

      await MySwal.fire({
        title: `<strong>회원가입 실패</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: "error",
      });
    }
  };

export const logout = () => async (dispatch: Dispatch) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("customerRole");
  sessionStorage.removeItem("customerEmail");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("customerName");

  dispatch(logoutSuccess());
  dispatch(clearCartSuccess());
};

export const activateAccount = (code: string) => async (dispatch: Dispatch) => {
  try {
    const response = await RequestService.get("/registration/activate/" + code);
    dispatch(activateAccountSuccess(response.data));
  } catch (error: any) {
    dispatch(activateAccountFailure(error.response.data));
  }
};

export const forgotPassword =
  (email: { email: string }) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      const response = await RequestService.post("/auth/forgot", email);
      dispatch(forgotPasswordSuccess(response.data));
    } catch (error: any) {
      dispatch(forgotPasswordFailure(error.response.data));
    }
  };

export const fetchResetPasswordCode =
  (code: string) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.get("/auth/reset/" + code);
      dispatch(resetPasswordCodeSuccess(response.data));
    } catch (error: any) {
      dispatch(resetPasswordCodeFailure(error.response.data));
    }
  };

export const resetPassword =
  (data: CustomerResetPasswordData, history: any) =>
  async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post("/auth/reset", data);
      dispatch(resetPasswordSuccess(response.data));
      history.push("/login");
    } catch (error: any) {
      dispatch(resetPasswordFailure(error.response.data));
    }
  };

export const formReset = () => async (dispatch: Dispatch) => {
  dispatch(reset());
};
