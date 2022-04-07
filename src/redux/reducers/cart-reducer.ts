import { Product } from '../../types/types';
import {
    CALCULATE_CART_PRICE_SUCCESS,
    CLEAR_CART_SUCCESS,
    FETCH_CART_SUCCESS,
    LOADING_CART,
    STOP_LOADING_CART,
    CartActionTypes,
} from '../action-types/cart-action-types';

export type InitialStateType = {
    products: Array<Product>;
    loading: boolean;
    totalPrice: number;
};

const initialState: InitialStateType = {
    products: [],
    loading: false,
    totalPrice: 0,
};

const reducer = (
    state: InitialStateType = initialState,
    action: CartActionTypes
): InitialStateType => {
    switch (action.type) {
        case LOADING_CART:
            return { ...state, loading: true };

        case FETCH_CART_SUCCESS:
            return { ...state, products: action.payload, loading: false };

        case CALCULATE_CART_PRICE_SUCCESS:
            return { ...state, totalPrice: action.payload, loading: false };

        case STOP_LOADING_CART:
            return { ...state, loading: false, products: [] };

        case CLEAR_CART_SUCCESS:
            return { ...state, products: [] };

        default:
            return state;
    }
};

export default reducer;
