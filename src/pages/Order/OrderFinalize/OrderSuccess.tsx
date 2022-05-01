import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import qs from 'qs';
import { clearCart } from '../../../redux/thunks/cart-thunks';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import requestService from '../../../utils/request-service';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

const OrderSuccess: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const orderId = sessionStorage.getItem('orderId');

  const customerId = parseInt(sessionStorage.getItem('id') as string);
  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    requestService
      .post('/order/success', query)
      .then((res) => {
        if (isNaN(customerId)) {
          return;
        }

        dispatch(clearCart(customerId));
      })
      .catch((err) => {
        console.log(err.response);
        MySwal.fire({
          title: `<strong>결제 실패</strong>`,
          html: `<i>${err.response.data.message}</i>
                <br/>
                <br/>
                <i>오류 코드 : ${err.response.data.response.code}</i>`,
          icon: 'error',
        }).then(() => {
          history.push('/');
        });
      });
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>주문이 완료되었습니다!</h2>
      <p>
        주문번호: <span>{orderId}</span>
      </p>
    </div>
  );
};

export default OrderSuccess;
