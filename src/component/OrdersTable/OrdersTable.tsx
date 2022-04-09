import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

import { Order } from '../../types/types';
import Spinner from '../Spinner/Spinner';

type PropsType = {
    orders: Array<Order>;
    loading: boolean;
};

const OrdersTable: FC<PropsType> = ({ loading, orders }) => {
    return (
        <div className="container">
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <h4>
                        <FontAwesomeIcon
                            className="ml-2 mr-2"
                            icon={faShoppingBag}
                        />{' '}
                        주문 목록
                    </h4>
                    <table className="table mt-4 border text-center">
                        <thead className="table-active">
                            <tr>
                                <th>주문번호</th>
                                <th>주문날짜</th>
                                <th>수령인</th>
                                <th>금액</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: Order) => {
                                return (
                                    <tr key={order.id}>
                                        <th>{order.id}</th>
                                        <th>{order.createdAt}</th>
                                        <th>{order.orderCustomerName}</th>
                                        <th>
                                            {order.orderTotalPrice.toLocaleString(
                                                'ko-KR'
                                            )}
                                            원
                                        </th>
                                        <th>
                                            <Link
                                                to={{
                                                    pathname: `/account/user/orders/${order.id}`,
                                                    state: order,
                                                }}
                                            >
                                                더보기
                                            </Link>
                                        </th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default OrdersTable;
