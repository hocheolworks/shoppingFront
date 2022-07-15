import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { FCinLayout, Order, TaxBillInfo } from "../../../../src/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import RequestService from "../../../../src/utils/request-service";
import { GetServerSideProps } from "next";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import { API_BASE_URL } from "../../../../src/utils/constants/url";
import { useCheckLogin } from "../../../../src/hook/useCheckLogin";
import Spinner from "../../../../src/component/Spinner/Spinner";
import { useCheckAdmin } from "../../../../src/hook/useCheckAdmin";

type ManageUserOrderProp = {
  order: Order;
  taxBillInfo?: TaxBillInfo;
};

const ManageUserOrder: FCinLayout<ManageUserOrderProp> = ({
  order,
  taxBillInfo,
}) => {
  const isLoggedIn = useCheckLogin();
  const isAdmin = useRef<boolean>(false);

  const [designFiles, setDesignFiles] = useState<string[]>([]);
  useEffect(() => {
    RequestService.get(`/order/design/${order.id}`).then((res) =>
      setDesignFiles(res.data)
    );

    const customerRole = sessionStorage.getItem("customerRole");
    isAdmin.current = customerRole === "ADMIN";
  }, []);

  const {
    id,
    orderCustomerName,
    orderTotalProductsPrice,
    orderTotalPrice,
    orderTax,
    orderPrintFee,
    orderDeliveryFee,
    orderPostIndex,
    orderPhoneNumber,
    createdAt,
    orderAddress,
    orderAddressDetail,
    orderItems,
    orderStatus,
    orderIsPaid,
    orderMemo,
    isTaxBill,
  } = order;

  return (
    <>
      {isLoggedIn ? (
        <>
          <h4 style={{ textAlign: "center" }}>
            <FontAwesomeIcon icon={faShoppingBag} /> 주문 #{id}
          </h4>
          <div className="row border my-5 px-5 py-3">
            <div className={isTaxBill ? "col-md-4" : "col-md-6"}>
              <h5 style={{ marginBottom: "30px" }}>
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
              <p className="personal_data_item">
                배송메모:
                <br />
                <span className="personal_data_text">{orderMemo}</span>
              </p>
              {designFiles.length > 0 && (
                <p className="personal_data_item">
                  파일첨부:
                  {designFiles.map((val, idx) => (
                    <a
                      id="design_file_download"
                      className="personal_data_text"
                      href={val}
                    >
                      다운로드#{idx + 1}
                    </a>
                  ))}
                </p>
              )}
            </div>
            <div className={isTaxBill ? "col-md-4" : "col-md-6"}>
              <h5 style={{ marginBottom: "30px" }}>
                <FontAwesomeIcon icon={faInfoCircle} /> 주문 정보
              </h5>
              {order.estimateId !== -1 ? (
                <p className="personal_data_item">
                  {"견적서 :" + " "}
                  <Link
                    href={`/account/${
                      isAdmin.current ? "admin" : "customer"
                    }/estimate/${order.estimateId}`}
                  >
                    <a>{order.estimateId}</a>
                  </Link>
                </p>
              ) : (
                <></>
              )}
              <p className="personal_data_item">
                주문번호:
                <span className="personal_data_text">{id}</span>
              </p>
              <p className="personal_data_item">
                주문날짜:
                <span className="personal_data_text">
                  {new Date(createdAt).toLocaleString("ko-kr")}
                </span>
              </p>
              <p className="personal_data_item">
                주문상태:
                <span className="personal_data_text">{orderStatus}</span>
              </p>
              <p className="personal_data_item">
                결제여부:
                <span className="personal_data_text">
                  {orderIsPaid ? "O" : "X"}
                </span>
              </p>
              <hr style={{ width: "70%" }} />
              <div
                style={{
                  marginBottom: "30px",
                  marginTop: "15px",
                  paddingRight: "30%",
                }}
              >
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">상품금액:</p>
                  <span className="personal_data_text">
                    {orderTotalProductsPrice.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">부가세:</p>
                  <span className="personal_data_text">
                    {orderTax.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">인쇄비:</p>
                  <span className="personal_data_text">
                    {orderPrintFee.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">배송비:</p>
                  <span className="personal_data_text">
                    {orderDeliveryFee.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <h4>주문금액:</h4>
                  <h4 style={{ color: "green" }}>
                    {" "}
                    {orderTotalPrice.toLocaleString("ko-KR")} 원
                  </h4>
                </div>
              </div>
            </div>
            {isTaxBill && (
              <div className="col-md-4">
                <h5 style={{ marginBottom: "30px" }}>
                  <FontAwesomeIcon icon={faInfoCircle} /> 세금계산서 정보
                </h5>
                <p className="personal_data_item">
                  대표자 성명:
                  <span className="personal_data_text">
                    {taxBillInfo?.representativeName}
                  </span>
                </p>
                <p className="personal_data_item">
                  사업자 등록번호:
                  <span className="personal_data_text">
                    {taxBillInfo?.companyRegistrationNumber}
                  </span>
                </p>
                <p className="personal_data_item">
                  사업장 소재지:
                  <span className="personal_data_text">
                    {taxBillInfo?.companyLocation}
                  </span>
                </p>
                <p className="personal_data_item">
                  사업장 상세주소:
                  <span className="personal_data_text">
                    {taxBillInfo?.companyLocationDetail}
                  </span>
                </p>
                <p className="personal_data_item">
                  업태:
                  <span className="personal_data_text">
                    {taxBillInfo?.businessCategory}
                  </span>
                </p>
                <p className="personal_data_item">
                  종목:
                  <span className="personal_data_text">
                    {taxBillInfo?.businessType}
                  </span>
                </p>
                <p className="personal_data_item">
                  이메일:
                  <span className="personal_data_text">
                    {taxBillInfo?.email}
                  </span>
                </p>
              </div>
            )}
          </div>
          <table className="table border text-center">
            <thead className="table-active">
              <tr>
                <th>상품 번호</th>
                <th>상품 명</th>
                <th>수량</th>
                <th>가격</th>
                <th>합계</th>
                <th>인쇄여부</th>
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
                      {orderItem.product.productPrice.toLocaleString("ko-KR")}원
                    </th>
                    <th>
                      {orderItem.orderItemTotalPrice.toLocaleString("ko-KR")}원
                    </th>
                    <th>{orderItem.isPrint ? "O" : "X"}</th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await RequestService.get(`/order/${context.params?.oid}`);
  const order = response.data;
  if (order.isTaxBill) {
    const taxBillRes = await RequestService.get(
      `/order/${context.params?.oid}/taxBillInfo`
    );
    const taxBillInfo = taxBillRes.data;
    return { props: { order, taxBillInfo } };
  } else {
    return { props: { order } };
  }
};

ManageUserOrder.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ManageUserOrder;
