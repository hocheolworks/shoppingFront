import { Dispatch } from 'redux';

import { showLoader } from '../actions/auth-actions';
import {
  fetchNonMemberOrdersSuccess,
  fetchOrderSuccess,
  fetchUserOrdersByQuerySuccess,
  fetchUserOrdersSuccess,
  orderAddedFailure,
  orderAddedSuccess,
} from '../actions/order-actions';
import RequestService from '../../utils/request-service';
import { NextRouter } from 'next/router';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const fetchOrder = () => async (dispatch: Dispatch) => {
  dispatch(fetchOrderSuccess());
};

export const addOrder = (order: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    const response = await RequestService.post('/order/payment', order);
    dispatch(orderAddedSuccess(response.data));
  } catch (error: any) {
    dispatch(orderAddedFailure(error.response?.data));
  }
};

export const fetchUserOrders =
  (customerId: number | undefined) => async (dispatch: Dispatch) => {
    dispatch(showLoader());
    const response = await RequestService.get(
      `/order/customer/${customerId}`,
      false
    );
    dispatch(fetchUserOrdersSuccess(response.data));
  };

export const fetchNonMemberOrders = (
  orderId: string,
  customerName: string,
  customerPhoneNumber: string,
) => async (dispatch: Dispatch) => {
  dispatch(showLoader());
  const response = await RequestService.post(
    '/order/nonMember/orderList',
    {
      orderId,
      customerName,
      customerPhoneNumber
    }
  );

  if( response.data == -1  || response.data == undefined || response.data == "") {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `<strong>주문 정보 없음</strong>`,
      html: `<i>조회하신 정보로 주문내역이 조회되지 않습니다.</i>`,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: '확인',
    })
  } else {
    dispatch(fetchNonMemberOrdersSuccess(response.data));
  }
}