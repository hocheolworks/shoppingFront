import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import qs from 'qs';
import { clearCart } from '../../src/redux/thunks/cart-thunks';
import { useRouter } from 'next/router';
import requestService from '../../src/utils/request-service';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

const MySwal = withReactContent(Swal);

type OrderSuccessProps = {
  query: ParsedUrlQuery;
};

const OrderSuccess: FC<OrderSuccessProps> = ({ query }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const orderId = useRef<number>();

  const customerId = parseInt(localStorage.getItem('id') as string);
  useEffect(() => {
    orderId.current = parseInt(sessionStorage.getItem('orderId') as string);
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
          router.push('/');
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { query: context.query } };
};

export default OrderSuccess;
