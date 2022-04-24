import { Dispatch } from 'redux';

import {
  addProductFailure,
  addProductSuccess,
  getAllUsers,
  getAllUsersOrders,
  getUserInfo,
  getUserOrders,
  reset,
  updateProductFailure,
  updateProductSuccess,
  getAllUsersByQuery,
  getAllUsersOrdersByQuery,
  getUserInfoByQuery,
  getUserOrdersByQuery,
  loadingData,
  deleteProductFailure,
  deleteProductSuccess,
} from '../actions/admin-actions';
import { fetchProductSuccess, getProducts } from '../actions/product-actions';
import RequestService from '../../utils/request-service';
import {
  userByQuery,
  usersByQuery,
} from '../../utils/graphql-query/users-query';
import {
  ordersByEmailQuery,
  ordersByQuery,
} from '../../utils/graphql-query/orders-query';

export const addProduct = (data: FormData) => async (dispatch: Dispatch) => {
  try {
    const response = await RequestService.post(
      '/product/new',
      data,
      false,
      'multipart/form-data'
    );

    dispatch(addProductSuccess());
    dispatch(fetchProductSuccess(response.data));
  } catch (error: any) {
    if (error === undefined || error.response === undefined) {
      console.log('error is undefined, wtf');
      return;
    }
    dispatch(addProductFailure(error.response.data));
  }
};

export const updateProduct =
  (productId: number, customerId: number, data: FormData) =>
  async (dispatch: Dispatch) => {
    try {
      const url: string = data.has('file')
        ? `/product/${productId}/w/image?customerId=${customerId}`
        : `/product/${productId}/w/o/image?customerId=${customerId}`;

      const bodyData = data.has('file')
        ? data
        : {
            productName: data.get('productName'),
            productDescription: data.get('productDescription'),
            productMinimumEA: parseInt(data.get('productMinimumEA') as string),
            productPrice: parseInt(data.get('productPrice') as string),
          };

      const response = await RequestService.put(
        url,
        bodyData,
        false,
        data.has('file') ? 'multipart/form-data' : 'application/json'
      );

      dispatch(updateProductSuccess());
      dispatch(fetchProductSuccess(response.data));
    } catch (error: any) {
      if (error === undefined) {
        console.log('error is undefined, wtf');
        return;
      }
      dispatch(updateProductFailure(error.response.data));
    }
  };

export const deleteProduct =
  (productId: number, customerId: number) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.delete(
        `/product/${productId}?customerId=${customerId}`
      );
      dispatch(deleteProductSuccess());
      dispatch(getProducts(response.data));
    } catch (err: any) {
      dispatch(deleteProductFailure(err.response.data.productError));
    }
  };

export const fetchAllUsersOrders = () => async (dispatch: Dispatch) => {
  dispatch(loadingData());
  const response = await RequestService.get('/admin/orders', true);
  dispatch(getAllUsersOrders(response.data));
};

export const fetchUserOrders =
  (email: string | undefined) => async (dispatch: Dispatch) => {
    const response = await RequestService.post(
      '/admin/order',
      { email: email },
      true
    );
    dispatch(getUserOrders(response.data));
  };

export const fetchAllUsers = () => async (dispatch: Dispatch) => {
  dispatch(loadingData());
  const response = await RequestService.get('/admin/user/all', true);
  dispatch(getAllUsers(response.data));
};

export const fetchUserInfo = (id: string) => async (dispatch: Dispatch) => {
  dispatch(loadingData());
  const response = await RequestService.get('/admin/user/' + id, true);
  dispatch(getUserInfo(response.data));
};

export const formReset = () => async (dispatch: Dispatch) => {
  dispatch(reset());
};
