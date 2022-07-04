import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  fetchUserInfo,
  fetchUserOrders,
} from "../../../../src/redux/thunks/admin-thunks";
import Link from "next/link";
import { useRouter } from "next/router";
import { AppStateType } from "../../../../src/redux/reducers/root-reducer";
import { Customer, Order } from "../../../../src/types/types";
import Spinner from "../../../../src/component/Spinner/Spinner";
import { FCinLayout } from "../../../../src/../src/types/types";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import { useCheckAdmin } from "../../../../src/hook/useCheckAdmin";

const ManageUser: FCinLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useCheckAdmin();
  const { uid } = router.query;

  const customerData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.admin.customer
  );
  const customerOrders: Array<Order> = useSelector(
    (state: AppStateType) => state.admin.customerOrders
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.admin.isLoaded
  );
  const {
    id,
    customerEmail,
    customerName,
    customerPassword,
    customerPhoneNumber,
    customerAddress,
    signupVerifyToken,
    customerRole,
    orders,
    reviews,
  } = customerData;

  useEffect(() => {
    dispatch(fetchUserInfo(uid as string));
  }, []);

  useEffect(() => {
    dispatch(fetchUserOrders(uid as string));
  }, [customerData]);

  return isAdmin ? (
    <>
      <div className="container">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h4>
              <FontAwesomeIcon className="mr-2" icon={faUserEdit} />{" "}
              {customerName}
            </h4>
            <div className="row mt-5 mb-4 border px-3 py-3">
              <div className="col-md-4">
                <p className="personal_data_item">
                  고객 번호:
                  <span className="personal_data_text">{id}</span>
                </p>
                <p className="personal_data_item">
                  이메일:
                  <span className="personal_data_text">{customerEmail}</span>
                </p>
                <p className="personal_data_item">
                  구분:
                  <span className="personal_data_text">{customerRole}</span>
                </p>
              </div>
              <div className="col-md-4">
                <p className="personal_data_item">
                  이름:
                  <span className="personal_data_text">{customerName}</span>
                </p>
              </div>
              <div className="col-md-4">
                <p className="personal_data_item">
                  휴대폰 번호:
                  <span className="personal_data_text">
                    {customerPhoneNumber}
                  </span>
                </p>
                <p className="personal_data_item">
                  주소:
                  <span className="personal_data_text">{customerAddress}</span>
                </p>
              </div>
            </div>
            {customerOrders.length === 0 ? (
              <h5 style={{ textAlign: "center" }}>주문이 없습니다.</h5>
            ) : (
              <>
                <h5 style={{ textAlign: "center" }}>주문 목록</h5>
                <table className="table border text-center">
                  <thead className="table-active">
                    <tr>
                      <th>주문 번호</th>
                      <th>날짜</th>
                      <th>주소</th>
                      <th>우편번호</th>
                      <th>금액</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => {
                      return (
                        <tr key={order.id}>
                          <th>{order.id}</th>
                          <th>{order.createdAt}</th>
                          <th>{order.orderAddress}</th>
                          <th>{order.orderPostIndex}</th>
                          <th>
                            {order.orderTotalPrice.toLocaleString("ko-kr")}원
                          </th>
                          <th>
                            <Link href={`/account/customer/orders/${order.id}`}>
                              자세히 보기
                            </Link>
                          </th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    </>
  ) : (
    <Spinner />
  );
};

ManageUser.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ManageUser;
