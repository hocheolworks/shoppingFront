import React, { FC, ReactElement, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Order, Customer, FCinLayout } from '../../../../src/types/types';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import { fetchUserOrders } from '../../../../src/redux/thunks/order-thunks';
import OrdersTable from '../../../../src/component/OrdersTable/OrdersTable';
import Spinner from '../../../../src/component/Spinner/Spinner';
import { compareOrderByCreatedAt } from '../../../../src/utils/functions';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

const PersonalOrdersList: FCinLayout = () => {
  const dispatch = useDispatch();
  const orders: Array<Order> = useSelector(
    (state: AppStateType) => state.order.orders
  ).sort(compareOrderByCreatedAt);
  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  const customerId = useRef<number>(0);

  useEffect(() => {
    const id = localStorage.getItem('id');
    if (id) {
      customerId.current = parseInt(id);
      dispatch(fetchUserOrders(customerId.current));
    }
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
PersonalOrdersList.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default PersonalOrdersList;
