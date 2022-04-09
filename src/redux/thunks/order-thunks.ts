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
import { ordersByEmailQuery } from '../../utils/graphql-query/orders-query';

// import ConstantOrders from '../../utils/constants/orders';

export const fetchOrder = () => async (dispatch: Dispatch) => {
    dispatch(fetchOrderSuccess());
};

export const addOrder =
    (order: any, history: any) => async (dispatch: Dispatch) => {
        try {
            dispatch(showLoader());
            debugger;
            const response = await RequestService.post('/order/payment', order);
            history.push('/order/finalize');
            localStorage.removeItem('perfumes');
            dispatch(orderAddedSuccess(response.data));
        } catch (error: any) {
            dispatch(orderAddedFailure(error.response?.data));
        }
    };

export const fetchUserOrders =
    (customerId: number | undefined) => async (dispatch: Dispatch) => {
        dispatch(showLoader());
        // const response = await RequestService.get("/users/orders", true);
        // dispatch(fetchUserOrdersSuccess(response.data));

        const response = await RequestService.get(
            `/order/${customerId}`,
            false
        );
        console.log(response.data);
        dispatch(fetchUserOrdersSuccess(response.data));
    };

export const fetchUserOrdersByQuery =
    (email: string | undefined) => async (dispatch: Dispatch) => {
        dispatch(showLoader());
        const response = await RequestService.post(
            '/users/graphql/orders',
            { query: ordersByEmailQuery(email) },
            true
        );
        dispatch(
            fetchUserOrdersByQuerySuccess(response.data.data.ordersByEmail)
        );
    };
