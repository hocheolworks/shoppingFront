import React, { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useDispatch } from 'react-redux';
import { clearInsertOrderInformation } from '../../src/redux/actions/order-actions';

type OrderFailProps = {
  query: ParsedUrlQuery;
};

const OrderFail: FC<OrderFailProps> = ({ query }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearInsertOrderInformation());
    console.log(query);
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>주문에 실패하였습니다.</h2>
      <p>다시 시도해주세요.</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { query: context.query } };
};

export default OrderFail;
