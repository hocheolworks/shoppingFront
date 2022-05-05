import React, { FC, ReactElement, useEffect } from 'react';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { FCinLayout, Order } from '../../../../src/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import RequestService from '../../../../src/utils/request-service';
import { GetServerSideProps } from 'next';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

type ManageUserOrderProp = {
  order: Order;
};

const ManageUserOrder: FCinLayout<ManageUserOrderProp> = ({ order }) => {
  const {
    id,
    orderCustomerName,
    orderTotalPrice,
    orderPostIndex,
    orderPhoneNumber,
    createdAt,
    orderAddress,
    orderAddressDetail,
    orderItems,
    orderStatus,
    orderIsPaid,
  } = order;

  return (
    <>
      <h4 style={{ textAlign: 'center' }}>
        <FontAwesomeIcon icon={faShoppingBag} /> 주문 #{id}
      </h4>
      <div className="row border my-5 px-5 py-3">
        <div className="col-md-6">
          <h5 style={{ marginBottom: '30px' }}>
            <FontAwesomeIcon icon={faInfoCircle} /> 주문자 정보
          </h5>
          <p className="personal_data_item">
            이름:
            <span className="personal_data_text">{orderCustomerName}</span>
          </p>
          <p className="personal_data_item">
            휴대폰 번호:
            <span className="personal_data_text">{orderPhoneNumber}</span>
          </p>
          <p className="personal_data_item">
            우편변호:
            <span className="personal_data_text">{orderPostIndex}</span>
          </p>
          <p className="personal_data_item">
            배송주소:
            <span className="personal_data_text">{orderAddress}</span>
          </p>
          <p className="personal_data_item">
            상세주소:
            <span className="personal_data_text">{orderAddressDetail}</span>
          </p>
        </div>
        <div className="col-md-6">
          <h5 style={{ marginBottom: '30px' }}>
            <FontAwesomeIcon icon={faInfoCircle} /> 주문 정보
          </h5>
          <p className="personal_data_item">
            주문번호:
            <span className="personal_data_text">{id}</span>
          </p>
          <p className="personal_data_item">
            주문날짜:
            <span className="personal_data_text">{createdAt}</span>
          </p>
          <p className="personal_data_item">
            주문상태:
            <span className="personal_data_text">{orderStatus}</span>
          </p>
          <p className="personal_data_item">
            결제여부:
            <span className="personal_data_text">
              {orderIsPaid ? 'O' : 'X'}
            </span>
          </p>
          <h4 style={{ marginBottom: '30px', marginTop: '30px' }}>
            주문금액:
            <span style={{ color: 'green' }}>
              {' '}
              {orderTotalPrice.toLocaleString('ko-KR')} 원
            </span>
          </h4>
        </div>
      </div>
      <table className="table border text-center">
        <thead className="table-active">
          <tr>
            <th>상품 번호</th>
            <th>상품 명</th>
            <th>수량</th>
            <th>가격</th>
            <th>합계</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((orderItem) => {
            return (
              <tr key={orderItem.id}>
                <th>
                  <Link href={`/product/${orderItem.product.id}`}>
                    <a>{orderItem.product.id}</a>
                  </Link>
                </th>
                <th>{orderItem.product.productName}</th>
                <th>{orderItem.orderItemEA}</th>
                <th>
                  {orderItem.product.productPrice.toLocaleString('ko-KR')}원
                </th>
                <th>
                  {orderItem.orderItemTotalPrice.toLocaleString('ko-KR')}원
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await RequestService.get(`/order/${context.params.oid}`);
  const order = response.data;
  return { props: { order } };
};

ManageUserOrder.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ManageUserOrder;
