import { RegistrationEmailData } from "./../../types/types";
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
  UserData,
  UserRegistration,
  UserResetPasswordData,
} from "../../types/types";
import { Dispatch } from "redux";
import RequestService from "../../utils/request-service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const login =
  (userData: UserData, history: any) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post("/auth/login", userData);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.userRole);
      localStorage.setItem("isLoggedIn", "true");
      dispatch(loginSuccess(response.data.userRole));
      history.push("/account");
    } catch (error: any) {
      dispatch(loginFailure(error.response.data));
    }
  };

export const registration =
  (userRegistrationData: UserRegistration) => async (dispatch: Dispatch) => {
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
  localStorage.removeItem("email");
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("isLoggedIn");
  dispatch(logoutSuccess());
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
  (data: UserResetPasswordData, history: any) => async (dispatch: Dispatch) => {
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
