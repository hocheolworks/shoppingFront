import { fetchCustomerSuccess } from './../actions/customer-actions';
import { emailVerifySuccess } from './../actions/auth-actions';
import { RegistrationEmailData } from './../../types/types';
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
} from '../actions/auth-actions';
import { reset } from '../actions/admin-actions';
import {
  CustomerData,
  CustomerRegistration,
  CustomerResetPasswordData,
} from '../../types/types';
import { Dispatch } from 'redux';
import RequestService from '../../utils/request-service';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { fetchCartSuccess } from '../actions/cart-actions';

const MySwal = withReactContent(Swal);

export const login =
  (customerData: CustomerData, router: any) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post(
        '/customer/login',
        customerData
      );

      localStorage.setItem('customerEmail', response.data.customerEmail);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('customerRole', response.data.customerRole);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('id', response.data.id);
      dispatch(loginSuccess(response.data.customerRole));
      dispatch(fetchCustomerSuccess(response.data));

      const cartResponse = await RequestService.get(
        `/customer/${response.data.id}/cart`
      );
      dispatch(fetchCartSuccess(cartResponse.data));

      router.push('/account');
    } catch (error: any) {
      let errorMessage = error.response.data.message;

      await MySwal.fire({
        title: `<strong>로그인 실패!</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: 'error',
      });
    }
  };

export const emailValidation =
  (userRegistrationData: CustomerRegistration) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      await RequestService.post('/customer/email-verify', userRegistrationData);
      dispatch(emailVerifySuccess());
    } catch (error: any) {
      dispatch(registerFailure(error.response.data));
      let errorMessage = error.response.data.message;
      if (Array.isArray(error.response.data.message)) {
        if (/[a-zA-Z]/.test(error.response.data.message[0])) {
          errorMessage = '입력하신 정보를 확인해주세요';
        } else {
          errorMessage = error.response.data.message[0];
        }
      }
      await MySwal.fire({
        title: `<strong>이메일 인증 실패</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: 'error',
      });
    }
  };

export const registration =
  (userRegistrationData: CustomerRegistration) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      await RequestService.post('/customer', userRegistrationData);
      dispatch(registerSuccess());
    } catch (error: any) {
      let errorMessage = error.response.data.message;
      dispatch(registerFailure(error.response.data));

      if (Array.isArray(error.response.data.message)) {
        if (/[a-zA-Z]/.test(error.response.data.message[0])) {
          errorMessage = '입력하신 정보를 확인해주세요';
        } else {
          errorMessage = error.response.data.message[0];
        }
      }

      await MySwal.fire({
        title: `<strong>회원가입 실패</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: 'error',
      });
    }
  };

export const logout = () => async (dispatch: Dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('customerRole');
  localStorage.removeItem('customerEmail');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('id');
  dispatch(logoutSuccess());
};

export const activateAccount = (code: string) => async (dispatch: Dispatch) => {
  try {
    const response = await RequestService.get('/registration/activate/' + code);
    dispatch(activateAccountSuccess(response.data));
  } catch (error: any) {
    dispatch(activateAccountFailure(error.response.data));
  }
};

export const forgotPassword =
  (email: { email: string }) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      const response = await RequestService.post('/auth/forgot', email);
      dispatch(forgotPasswordSuccess(response.data));
    } catch (error: any) {
      dispatch(forgotPasswordFailure(error.response.data));
    }
  };

export const fetchResetPasswordCode =
  (code: string) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.get('/auth/reset/' + code);
      dispatch(resetPasswordCodeSuccess(response.data));
    } catch (error: any) {
      dispatch(resetPasswordCodeFailure(error.response.data));
    }
  };

export const resetPassword =
  (data: CustomerResetPasswordData, history: any) =>
  async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post('/auth/reset', data);
      dispatch(resetPasswordSuccess(response.data));
      history.push('/login');
    } catch (error: any) {
      dispatch(resetPasswordFailure(error.response.data));
    }
  };

export const formReset = () => async (dispatch: Dispatch) => {
  dispatch(reset());
};
