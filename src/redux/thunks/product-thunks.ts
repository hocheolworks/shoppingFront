import { Dispatch } from 'redux';

import {
    getProducts,
    fetchProductsByFilterParamsSuccess,
    fetchProductSuccess,
    loadingProduct,
    fetchIsPurchaseSuccess,
} from '../actions/product-actions';
import { Product, ReviewData } from '../../types/types';

import RequestService from '../../utils/request-service';
import { customerAddedReviewFailure, customerAddedReviewSuccess } from '../actions/customer-actions';

export const fetchProducts = () => async (dispatch: Dispatch) => {
    dispatch(loadingProduct());
    const response = await RequestService.get('/product/all');
    dispatch(getProducts(response.data));
};

export const fetchProduct = (id: number) => async (dispatch: Dispatch) => {
    dispatch(loadingProduct());
    const response = await RequestService.get(`/product/${id}`);
    dispatch(fetchProductSuccess(response.data));
};

export const fetchProductsByIds =
    (ids: Array<number>) => async (dispatch: Dispatch) => {
        dispatch(loadingProduct());
        const response = await RequestService.post('/product/ids', ids);
        dispatch(getProducts(response.data));
    };

export const fetchIsPurchased = 
(productId: number, customerId: number | undefined ) => async (dispatch: Dispatch) => {
    let result = false;
    if (customerId != undefined) {
        const response = await RequestService.post(
            '/order/is-purchase',
            {
                'productId' : productId,
                'customerId' : customerId
            }
        );
        result = response.data;    
    }

    dispatch(fetchIsPurchaseSuccess(result));
};

export const addReviewToProduct =
  (review: ReviewData) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.post('/product/review/add', review);
      console.log(response.data);
      debugger;
      dispatch(fetchProductSuccess(response.data));
      dispatch(customerAddedReviewSuccess());
    } catch (error: any) {
      dispatch(customerAddedReviewFailure(error.response.data));
    }
  };