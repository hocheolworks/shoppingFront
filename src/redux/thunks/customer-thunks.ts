import { Dispatch } from 'redux';
import * as H from 'history';

import {
  fetchCustomerSuccess,
  loadingCustomerInfo,
  resetInputForm,
  customerUpdatedFailure,
  customerUpdatedPasswordFailure,
  customerUpdatedPasswordSuccess,
  customerUpdatedSuccess,
} from '../actions/customer-actions';
import {
  CustomerEdit,
  CustomerResetPasswordData,
  CustomerPasswordConfirmData,
} from '../../types/types';
import RequestService from '../../utils/request-service';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { NextRouter } from 'next/router';

const MySwal = withReactContent(Swal);

export const fetchCustomerInfo = () => async (dispatch: Dispatch) => {
  dispatch(loadingCustomerInfo());
  const response = await RequestService.get('/customers/info', true);
  sessionStorage.setItem('email', response.data.email);
  sessionStorage.setItem('customerRole', response.data.roles);
  sessionStorage.setItem('isLoggedIn', 'true');
  dispatch(fetchCustomerSuccess(response.data));
};

export const updateCustomerInfo =
  (customerEdit: Partial<CustomerEdit>, router: NextRouter) =>
  async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.put(
        '/account/edit',
        customerEdit,
        true
      );
      dispatch(customerUpdatedSuccess(response.data));
      router.push('/account/customer/info');
    } catch (error: any) {
      dispatch(customerUpdatedFailure(error.response.data));
    }
  };

export const updateCustomerPassword =
  (data: CustomerResetPasswordData) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.put(
        '/account/password-change',
        data,
        true
      );
      dispatch(customerUpdatedPasswordSuccess(response.data));
    } catch (error: any) {
      let errorMessage = error.response.data.message;
      await MySwal.fire({
        title: `<strong>비밀번호 변경 실패!</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: 'error',
      });
    }
  };

export const ConfirmCustomerPassword =
  (data: CustomerPasswordConfirmData, router: NextRouter) =>
  async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.put(
        '/account/password-confirm',
        data,
        true
      );
      router.push('/account/customer/password/change');
    } catch (error: any) {
      let errorMessage = error.response.data.message;
      await MySwal.fire({
        title: `<strong>비밀번호 확인 실패!</strong>`,
        html: `<i>${errorMessage}</i>`,
        icon: 'error',
      });
    }
  };

export const resetForm = () => (dispatch: Dispatch) => {
  dispatch(resetInputForm());
};
