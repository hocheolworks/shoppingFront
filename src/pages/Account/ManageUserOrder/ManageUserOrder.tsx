import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Order } from '../../../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const ManageUserOrder: FC = () => {
    const location = useLocation<Order>();
    const {
        id,
        orderEmail,
        orderCustomerName,
        orderTotalPrice,
        orderPostIndex,
        orderPhoneNumber,
        createdAt,
        orderAddress,
        orderAddressDetail,
        orderItems,
    } = location.state;

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
                        <span className="personal_data_text">
                            {orderCustomerName}
                        </span>
                    </p>
                    <p className="personal_data_item">
                        이메일:
                        <span className="personal_data_text">{orderEmail}</span>
                    </p>
                    <p className="personal_data_item">
                        휴대폰 번호:
                        <span className="personal_data_text">
                            {orderPhoneNumber}
                        </span>
                    </p>
                    <p className="personal_data_item">
                        우편변호:
                        <span className="personal_data_text">
                            {orderPostIndex}
                        </span>
                    </p>
                    <p className="personal_data_item">
                        배송주소:
                        <span className="personal_data_text">
                            {orderAddress}
                        </span>
                    </p>
                    <p className="personal_data_item">
                        상세주소:
                        <span className="personal_data_text">
                            {orderAddressDetail}
                        </span>
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
                    <h4 style={{ marginBottom: '30px', marginTop: '30px' }}>
                        주문금액:
                        <span style={{ color: 'green' }}>
                            {' '}
                            {orderTotalPrice}.0 $
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
                                    <Link
                                        to={`/product/${orderItem.perfume.id}`}
                                    >
                                        {orderItem.perfume.id}
                                    </Link>
                                </th>
                                <th>{orderItem.perfume.perfumeTitle}</th>
                                <th>{orderItem.quantity}</th>
                                <th>{orderItem.perfume.price}.0 $</th>
                                <th>{orderItem.amount}.0 $</th>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default ManageUserOrder;
