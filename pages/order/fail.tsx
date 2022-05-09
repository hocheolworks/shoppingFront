import React, { FC, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

type OrderFailProps = {
  query: ParsedUrlQuery;
};

const OrderFail: FC<OrderFailProps> = ({ query }) => {
  useEffect(() => {
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
