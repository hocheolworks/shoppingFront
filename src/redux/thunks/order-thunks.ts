import { Dispatch } from 'redux';

import { showLoader } from '../actions/auth-actions';
import {
  fetchOrderSuccess,
  fetchUserOrdersByQuerySuccess,
  fetchUserOrdersSuccess,
  orderAddedFailure,
  orderAddedSuccess,
} from '../actions/order-actions';
import RequestService from '../../utils/request-service';

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
