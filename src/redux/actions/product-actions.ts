import { Product } from '../../types/types';
import {
    LOADING_PRODUCT,
    FETCH_PRODUCTS,
    FETCH_PRODUCT_SUCCESS,
    FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS,
    FetchProductsByFilterParamsSuccessActionType,
    FetchProductSuccessActionType,
    GetProductsActionType,
    LoadingProductActionType,
    fetchIsPurchaseSuccessActionType,
    FETCH_IS_PURCHASE_SUCCESS,
} from '../action-types/product-action-types';

export const loadingProduct = (): LoadingProductActionType => ({
    type: LOADING_PRODUCT,
});

export const getProducts = (
    products: Array<Product>
): GetProductsActionType => ({
    type: FETCH_PRODUCTS,
    payload: products,
});

export const fetchProductSuccess = (
    product: Product
): FetchProductSuccessActionType => ({
    type: FETCH_PRODUCT_SUCCESS,
    payload: product,
});

export const fetchProductsByFilterParamsSuccess = (
    products: Array<Product>
): FetchProductsByFilterParamsSuccessActionType => ({
    type: FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS,
    payload: products,
});

export const fetchIsPurchaseSuccess = (
    result: boolean
): fetchIsPurchaseSuccessActionType => ({
    type: FETCH_IS_PURCHASE_SUCCESS,
    payload: result,
});