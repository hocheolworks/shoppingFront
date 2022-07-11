import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import {
  Estimate,
  EstimateItem,
  FCinLayout,
  Order,
  TaxBillInfo,
} from "../../../../src/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faInfoCircle,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import RequestService from "../../../../src/utils/request-service";
import { GetServerSideProps } from "next";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import { API_BASE_URL } from "../../../../src/utils/constants/url";
import { useCheckLogin } from "../../../../src/hook/useCheckLogin";
import { useDispatch } from "react-redux";
import {
  clearEstimatePaymentInfo,
  saveEstimatePaymentInfo,
} from "../../../../src/redux/actions/order-actions";

// type ManageUserEstimateProp = {
//   estimate: Estimate;
//   estimateItems: EstimateItem[];
//   // taxBillInfo?: TaxBillInfo;
// };

const ManageUserOrder: FCinLayout = () => {
  // TODO : 세금계산서 쓸까봐 남겨둠, 안쓰면 지워야함
  // const [designFiles, setDesignFiles] = useState<string[]>([]);
  // useEffect(() => {
  //   RequestService.get(`/order/design/${estimate.id}`).then((res) =>
  //     setDesignFiles(res.data)
  //   );
  // }, []);

  const isLogin = useCheckLogin();
  const dispatch = useDispatch();
  const router = useRouter();
  const [estimate, setEstimate] = useState<Partial<Estimate>>({});
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const isMount = useRef<boolean>(false);
  const { sid } = router.query;

  useEffect(() => {
    if (!isMount.current) {
      RequestService.get(`/order/estimate/${sid as string}`)
        .then((res) => setEstimate(res.data))
        .catch((err) => console.log(err));

      RequestService.get(`/order/estimate/items/${sid as string}`)
        .then((res) => {
          setEstimateItems(res.data);
        })
        .catch((err) => console.log(err));

      isMount.current = true;
      dispatch(clearEstimatePaymentInfo());
    }
  }, []);
  const {
    id,
    estimateName,
    estimateEmail,
    estimatePhoneNumber,
    estimateBusinessName,
    estimateBusinessType,
    estimateBusinessNumber,
    estimatePostIndex,
    estimateAddress,
    estimateAddressDetail,
    estimatePrintingDraft,
    estimateDesiredDate,
    estimateRequestMemo,
    customerId,
    requestStatus,
    createdAt,
    updatedAt,
    deletedAt,
  } = estimate;

  const onClickPayment = () => {
    if (estimate && estimate.response) {
      dispatch(
        saveEstimatePaymentInfo({
          estimate: estimate,
          estimateResponse: estimate.response,
          estimateItems: estimateItems,
        })
      );

      router.push("/account/customer/estimate/payment");
    }
  };

  return isLogin ? (
    <>
      <h4 style={{ textAlign: "center" }}>
        <FontAwesomeIcon icon={faShoppingBag} /> 주문 #{id}
      </h4>
      <div className="row border my-5 px-5 py-3">
        <div className={"col-md-6"}>
          <h5 style={{ marginBottom: "30px" }}>
            <FontAwesomeIcon icon={faInfoCircle} /> 견적서
          </h5>
          <p className="personal_data_item">
            이름:
            <span className="personal_data_text">{estimateName}</span>
          </p>
          <p className="personal_data_item">
            휴대폰 번호:
            <span className="personal_data_text">{estimatePhoneNumber}</span>
          </p>
          <p className="personal_data_item">
            우편번호:
            <span className="personal_data_text">{estimatePostIndex}</span>
          </p>
          <p className="personal_data_item">
            배송주소:
            <span className="personal_data_text">{estimateAddress}</span>
          </p>
          <p className="personal_data_item">
            상세주소:
            <span className="personal_data_text">{estimateAddressDetail}</span>
          </p>
          <p className="personal_data_item">
            배송메모:
            <br />
            <span className="personal_data_text" id="requestMemo">
              {estimateRequestMemo}
            </span>
          </p>
          {/* {designFiles.length > 0 && (
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
          )} */}
        </div>
        <div className={"col-md-6"}>
          <h5 style={{ marginBottom: "30px" }}>
            <FontAwesomeIcon icon={faInfoCircle} /> 주문 정보
          </h5>
          <p className="personal_data_item">
            주문번호:
            <span className="personal_data_text">{id}</span>
          </p>
          <p className="personal_data_item">
            주문날짜:
            <span className="personal_data_text">
              {new Date(createdAt as string).toLocaleString("ko-kr")}
            </span>
          </p>
          <p className="personal_data_item">
            주문상태:
            <span className="personal_data_text">{requestStatus}</span>
          </p>
          {/* <p className="personal_data_item">
            결제여부:
            <span className="personal_data_text">
              {orderIsPaid ? "O" : "X"}
            </span>
          </p> */}
          <hr style={{ width: "70%" }} />
          <div
            style={{
              marginBottom: "30px",
              marginTop: "15px",
              paddingRight: "30%",
            }}
          >
            {estimate.requestStatus === "답변완료" && estimate.response ? (
              <>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">상품금액:</p>
                  <span className="personal_data_text">
                    {estimate.response.totalProductsPrice.toLocaleString(
                      "ko-KR"
                    )}{" "}
                    원
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">부가세:</p>
                  <span className="personal_data_text">
                    {estimate.response.tax.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">인쇄비:</p>
                  <span className="personal_data_text">
                    {estimate.response.printFee.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">배송비:</p>
                  <span className="personal_data_text">
                    {estimate.response.deliveryFee.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <h4>주문금액:</h4>
                  <h4 style={{ color: "green" }}>
                    {" "}
                    {estimate.response.totalPrice.toLocaleString("ko-KR")} 원
                  </h4>
                </div>
                <hr style={{ width: "100%" }} />
                <div className="row mt-2">
                  <label className="col-sm-10 personal_data_item col-form-label">
                    안내사항
                  </label>
                  <div className="col-sm-12">
                    <textarea
                      name="memo"
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "7px",
                      }}
                      value={estimate.response?.memo}
                      readOnly
                    />
                  </div>
                </div>
                <button
                  onClick={onClickPayment}
                  className="btn btn-primary btn-lg btn-success float-right mt-2"
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> 결제하기
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* {isTaxBill && (
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
              <span className="personal_data_text">{taxBillInfo?.email}</span>
            </p>
          </div>
        )} */}
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
          {estimateItems.map((item) => {
            return (
              <tr key={item.id}>
                <th>
                  <Link href={`/product/${item.productId}`}>
                    <a>{item.productId}</a>
                  </Link>
                </th>
                <th>{item.productName}</th>
                <th>{item.estimateItemEA}</th>
                <th>{item.productPrice}원</th>
                <th>{item.orderItemTotalPrice}원</th>
                <th>{item.isPrint ? "O" : "X"}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  ) : (
    <></>
  );
};

ManageUserOrder.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ManageUserOrder;
