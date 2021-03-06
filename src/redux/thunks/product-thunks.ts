import { Dispatch } from 'redux';

import {
    getProducts,
    fetchProductsByFilterParamsSuccess,
    fetchProductSuccess,
    loadingProduct,
    fetchIsPurchaseSuccess,
    deleteReviewSuccess,
    fetchReviewSuccess,
} from '../actions/product-actions';
import { Product, Review, ReviewData } from '../../types/types';

import RequestService from '../../utils/request-service';
import { customerAddedReviewFailure, customerAddedReviewSuccess, customerDeletedReviewSuccess } from '../actions/customer-actions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

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
      const response = await RequestService.post('/product/review', review);
      const product: Product = response.data.product;
      product.reviews = response.data.reviews;
      dispatch(fetchProductSuccess(product));
      dispatch(customerAddedReviewSuccess());
    } catch (error: any) {
      dispatch(customerAddedReviewFailure(error.response.data));
    }
  };

export const removeReviewToProduct = 
  (review: Partial<Review>, productId: number | undefined) => async (dispatch: Dispatch) => {
    review.productId = productId;
    const response = await RequestService.put('/product/review', review);
    if (response.data.result >= 1) {
        dispatch(deleteReviewSuccess(response.data.reviews));
        dispatch(customerDeletedReviewSuccess());
    } 
    else {
        MySwal.fire({
            title:`<strong>?????? ?????? ??????</strong>`,
            html:`<i>??????????????? ?????? ?????? ????????? ??????????????????.</i>`,
            icon: 'error',
          })
    }
  }

export const getReviewToProduct = 
  (productId: number) => async (dispatch: Dispatch) => {
    const response = await RequestService.get('/review/'+productId);
    
    dispatch(fetchReviewSuccess(response.data.reveiws))
  }