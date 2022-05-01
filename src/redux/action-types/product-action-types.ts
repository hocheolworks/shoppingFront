import { Product } from '../../types/types';

export const LOADING_PRODUCT = 'LOADING_PRODUCT';
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS';
export const FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS =
    'FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS';
export const FETCH_IS_PURCHASE_SUCCESS = 'FETCH_IS_PURCHASE_SUCCESS';

export type LoadingProductActionType = { type: typeof LOADING_PRODUCT };
export type GetProductsActionType = {
    type: typeof FETCH_PRODUCTS;
    payload: Array<Product>;
};
export type FetchProductSuccessActionType = {
    type: typeof FETCH_PRODUCT_SUCCESS;
    payload: Product;
};
export type FetchProductsByFilterParamsSuccessActionType = {
    type: typeof FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS;
    payload: Array<Product>;
};
export type fetchIsPurchaseSuccessActionType = {
    type: typeof FETCH_IS_PURCHASE_SUCCESS;
    payload: boolean;
};
export type ProductActionTypes =
    | LoadingProductActionType
    | FetchProductSuccessActionType
    | GetProductsActionType
    | FetchProductsByFilterParamsSuccessActionType
    | fetchIsPurchaseSuccessActionType;

