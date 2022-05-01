import { Product, Review } from '../../types/types';
import {
    LOADING_PRODUCT,
    FETCH_PRODUCTS,
    FETCH_PRODUCT_SUCCESS,
    FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS,
    ProductActionTypes,
    FETCH_IS_PURCHASE_SUCCESS,
} from '../action-types/product-action-types';

export type InitialStateType = {
    products: Array<Product>;
    product: Partial<Product>;
    reviews: Array<Review>;
    isProductLoading: boolean;
    isPurchased: boolean;
};

const initialState: InitialStateType = {
    products: [],
    product: {},
    reviews: [],
    isProductLoading: false,
    isPurchased: false,
};

const reducer = (
    state: InitialStateType = initialState,
    action: ProductActionTypes
): InitialStateType => {
    switch (action.type) {
        case LOADING_PRODUCT:
            return { ...state, isProductLoading: true };

        case FETCH_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                isProductLoading: false,
            };

        case FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                product: action.payload,
                reviews: action.payload.reviews,
                isProductLoading: false,
            };

        case FETCH_PRODUCTS_BY_FILTER_PARAMS_SUCCESS:
            return {
                ...state,
                products: action.payload,
                isProductLoading: false,
            };

        case FETCH_IS_PURCHASE_SUCCESS:
            return {
                ...state,
                isPurchased: action.payload,
            };

        default:
            return state;
    }
};

export default reducer;
