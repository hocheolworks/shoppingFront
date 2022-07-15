import React, { FC } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

import { Order } from "../../types/types";
import Spinner from "../Spinner/Spinner";

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
            <FontAwesomeIcon className="ml-2 mr-2" icon={faShoppingBag} /> 주문
            목록
          </h4>
          <table className="table mt-4 border text-center">
            <thead className="table-active">
              <tr>
                <th>주문번호</th>
                <th>주문날짜</th>
                <th>수령인</th>
                <th>금액</th>
                <th>주문상태</th>
                <th>결제여부</th>
                <th>세금계산서</th>
                <th>견적서 여부</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => {
                return (
                  <tr key={order.id}>
                    <th>{order.id}</th>
                    <th>{new Date(order.createdAt).toLocaleString("ko-kr")}</th>
                    <th>{order.orderCustomerName}</th>
                    <th>{order.orderTotalPrice.toLocaleString("ko-KR")}원</th>
                    <th>{order.orderStatus}</th>
                    <th>{order.orderIsPaid ? "O" : "X"}</th>
                    <th>{order.isTaxBill ? "O" : "X"}</th>
                    <th>{order.estimateId !== -1 ? "O" : "X"}</th>
                    <th>
                      <Link href={`/account/customer/orders/${order.id}`}>
                        <a>더보기</a>
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
