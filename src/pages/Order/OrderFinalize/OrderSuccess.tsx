import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import { clearCart } from '../../../redux/thunks/cart-thunks';
import { AppStateType } from '../../../redux/reducers/root-reducer';
import { Order } from '../../../types/types';
import { useLocation } from 'react-router-dom';
import requestService from '../../../utils/request-service';

const OrderSuccess: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const order: Partial<Order> = useSelector(
    (state: AppStateType) => state.order.order
  );

  const customerId = useRef<number>(
    parseInt(localStorage.getItem('id') as string)
  );

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    requestService.post('/order/success', query).then((res) => {
      console.log(res.data);

      if (isNaN(customerId.current)) {
        return;
      }

      dispatch(clearCart(customerId.current));
    });
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>주문이 완료되었습니다!</h2>
      <p>
        주문번호: <span>{order.id}</span>
      </p>
    </div>
  );
};

export default OrderSuccess;
