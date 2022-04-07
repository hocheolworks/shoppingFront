import { Product } from '../../types/types';
import {
    calculateCartPriceSuccess,
    clearCartSuccess,
    fetchCartSuccess,
    loadingCart,
    stopLoadingCart,
} from '../actions/cart-actions';
import { Dispatch } from 'redux';
import RequestService from '../../utils/request-service';

export const fetchCart =
    (data: Array<number>) => async (dispatch: Dispatch) => {
        dispatch(loadingCart());
        const response = await RequestService.post('/product/list', data);
        const products: Map<number, number> = new Map(
            JSON.parse(<string>localStorage.getItem('products'))
        );
        let total: number = 0;

        console.log(response.data);
        products.forEach((value: number, key: number) => {
            const product: Product = response.data.find(
                (product: { id: number }) => product.id === key
            );
            total += product.productPrice * value;
        });
        dispatch(fetchCartSuccess(response.data));
        dispatch(calculateCartPriceSuccess(total));
    };

export const calculateCartPrice =
    (products: Array<Product> | any) => (dispatch: Dispatch) => {
        const productsFromLocalStorage: Map<number, number> = new Map(
            JSON.parse(<string>localStorage.getItem('products'))
        );
        let total: number = 0;

        productsFromLocalStorage.forEach((value: number, key: number) => {
            const product: Product = products.find(
                (product: { id: number }) => product.id === key
            );
            total += product.productPrice * value;
        });
        dispatch(calculateCartPriceSuccess(total));
    };

export const clearCart = () => (dispatch: Dispatch) => {
    dispatch(clearCartSuccess());
};

export const loadCart = () => (dispatch: Dispatch) => {
    dispatch(stopLoadingCart());
};
