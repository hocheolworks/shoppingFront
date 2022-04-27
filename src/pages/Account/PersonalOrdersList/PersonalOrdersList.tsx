import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Order, Customer } from '../../../types/types';
import { AppStateType } from '../../../redux/reducers/root-reducer';
import { fetchUserOrders } from '../../../redux/thunks/order-thunks';
import OrdersTable from '../../../component/OrdersTable/OrdersTable';
import Spinner from '../../../component/Spinner/Spinner';
import { compareOrderByCreatedAt } from '../../../utils/functions';

const PersonalOrdersList: FC = () => {
  const dispatch = useDispatch();
  const orders: Array<Order> = useSelector(
    (state: AppStateType) => state.order.orders
  ).sort(compareOrderByCreatedAt);
  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  const customer: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  useEffect(() => {
    dispatch(fetchUserOrders(customer.id));
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {orders.length === 0 ? (
            <h4
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon className="ml-2 mr-2" icon={faShoppingBag} />
              주문이 없습니다.
            </h4>
          ) : (
            <OrdersTable loading={loading} orders={orders} />
          )}
        </>
      )}
    </>
  );
};

export default PersonalOrdersList;
