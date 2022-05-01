import { Dispatch } from 'redux';

import {
    getProducts,
    fetchProductsByFilterParamsSuccess,
    fetchProductSuccess,
    loadingProduct,
    fetchIsPurchaseSuccess,
} from '../actions/product-actions';
import { Product } from '../../types/types';

import RequestService from '../../utils/request-service';

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