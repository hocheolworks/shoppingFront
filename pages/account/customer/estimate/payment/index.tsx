import React, {
  FC,
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

import PageLoader from "../../../../../src/component/PageLoader/PageLoader";
import Switch from "../../../../../src/component/Switch/Switch";
import { AppStateType } from "../../../../../src/redux/reducers/root-reducer";
import {
  OrderError,
  PostCodeObject,
  Customer,
  CartItem,
  CartItemNonMember,
  TaxBillInfo,
  TaxBillError,
  InsertEssentialCartItem,
} from "../../../../../src/types/types";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import DaumPostcode from "react-daum-postcode";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { fetchCart } from "../../../../../src/redux/thunks/cart-thunks";
import {
  orderAddedFailure,
  saveInsertOrderInformation,
  saveTaxBillInfoFailure,
  saveTaxBillInfoSuccess,
} from "../../../../../src/redux/actions/order-actions";
import { FRONT_BASE_URL } from "../../../../../src/utils/constants/url";
import RequestService from "../../../../../src/utils/request-service";
import { SetCartItemIsPrint } from "../../../../../src/redux/actions/cart-actions";
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string; // 진솔유통 테스트 클라이언트 키

const MySwal = withReactContent(Swal);

type PaymentMethodType = "카드" | "가상계좌";

const OrderPage: FC = () => {
  const dispatch = useDispatch();

  const customerId = useRef<number>(-1);
  const paymentMethodList = ["카드", "가상계좌"];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("카드");

  useEffect(() => {
    if (sessionStorage.getItem("id") !== null) {
      // 로그인 상태 : 회원 주문
      customerId.current = parseInt(sessionStorage.getItem("id") as string);
    }
  }, []);

  const estimatePaymentInfo = useSelector(
    (state: AppStateType) => state.order.estimatePayment
  );
  const { estimate, estimateItems, estimateResponse } = estimatePaymentInfo;

  const [designFiles, setDesignFiles] = useState<string[]>([]);
  useEffect(() => {
    if (estimate && estimate.id) {
      RequestService.get(`/order/estimate/design/${estimate.id}`).then((res) =>
        setDesignFiles(res.data)
      );
    }
  }, [estimate]);

  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  const [isTaxBill, setIsTaxBill] = useState<boolean>(false);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      estimate !== undefined &&
      estimateItems !== undefined &&
      estimateResponse !== undefined
    ) {
      const insertCartItems: Array<InsertEssentialCartItem> | undefined =
        estimateItems?.map(
          (val): InsertEssentialCartItem => ({
            productId: val.productId as number,
            productCount: val.estimateItemEA as number,
            productPrice: val.productPrice as number,
            isPrint: val.isPrint as boolean,
          })
        );

      if (insertCartItems === undefined) return;

      const insertOrder = {
        customerId: customerId.current,
        orderCustomerName: estimate?.estimateName,
        orderPostIndex: estimate?.estimatePostIndex,
        orderAddress: estimate?.estimateAddress,
        orderAddressDetail: estimate?.estimateAddressDetail,
        orderPhoneNumber: estimate?.estimatePhoneNumber,
        orderMemo: estimate?.estimateRequestMemo,
        orderTotalPrice: estimateResponse?.totalPrice,
        orderTotalProductsPrice: estimateResponse?.totalProductsPrice,
        orderTax: estimateResponse?.tax,
        orderPrintFee: estimateResponse?.printFee,
        orderDeliveryFee: estimateResponse?.deliveryFee,
        orderDesignFile: designFiles,
        isTaxBill: isTaxBill,
        cart: insertCartItems,
        estimateId: estimate?.id,
      };

      dispatch(saveInsertOrderInformation(insertOrder));

      const productName = estimateItems[0].productName as string;

      // 결제창 요청
      loadTossPayments(clientKey).then((tossPayments) => {
        tossPayments.requestPayment(paymentMethod, {
          amount: estimateResponse?.totalPrice as number,
          orderId: `order-${customerId.current}-${Date.now()}`,
          orderName:
            estimateItems?.length === 1
              ? productName
              : `${productName} 외 ${(estimateItems?.length as number) - 1}건`,
          customerName: estimate?.estimateName,
          successUrl: `${FRONT_BASE_URL}/account/customer/estimate/payment/success`,
          failUrl: `${FRONT_BASE_URL}/account/customer/estimate/payment/fail`,
        });
      });
    }
  };

  let pageLoading;
  if (loading) {
    pageLoading = <PageLoader />;
  }

  return (
    <div className="container mt-5 pb-5" id="mid">
      {pageLoading}
      <h4 className="mb-4 text-center">
        <FontAwesomeIcon className="mr-2" icon={faShoppingBag} /> 견적서 결제
      </h4>
      <br />
      <form onSubmit={onFormSubmit}>
        <div className="row">
          <div className="col-lg-7">
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">대표자:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={estimate?.estimateName}
                  placeholder=""
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">우편번호:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="postIndex"
                  value={estimate?.estimatePostIndex}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">주소:</label>
              <div className="col-sm-7">
                <input
                  readOnly
                  type="text"
                  className="form-control"
                  name="address"
                  value={estimate?.estimateAddress}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">상세주소:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={estimate?.estimateAddressDetail}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">연락처:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="phoneNumber"
                  value={estimate?.estimatePhoneNumber}
                  maxLength={11}
                  readOnly
                />
              </div>
            </div>
            {/* 견적 결제 전용 시작 */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">이메일:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  value={estimate?.estimateEmail}
                  readOnly
                />
              </div>
            </div>
            <hr
              style={{
                margin: "0 0 10px 0",
                maxWidth: "82.5%",
              }}
            />
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">업체 상호:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  value={estimate?.estimateBusinessName}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">업태 및 종목:</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  value={estimate?.estimateBusinessType}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">
                사업자 등록번호:
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  value={estimate?.estimateBusinessNumber}
                  readOnly
                />
              </div>
            </div>
            <hr
              style={{
                margin: "0 0 10px 0",
                maxWidth: "82.5%",
              }}
            />
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">납기 희망일:</label>
              <div className="col-sm-7">
                <input
                  className="form-control"
                  type="date"
                  name="desiredDate"
                  value={estimate?.estimateDesiredDate}
                  readOnly
                />
              </div>
            </div>
            {/* 견적 결제 전용 끝 */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">요청사항:</label>
              <div className="col-sm-7">
                <textarea
                  style={{
                    minHeight: "200px",
                  }}
                  className="form-control"
                  name="orderMemo"
                  value={estimate?.estimateRequestMemo}
                  rows={3}
                  maxLength={200}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">파일첨부:</label>
              <div className="col-sm-7">
                {designFiles.map((val, idx) => (
                  <div key={`download#${idx}`}>
                    <a
                      id={"design_file_download#" + idx}
                      style={{ color: "blue" }}
                      className="form-control border-0"
                      href={val}
                    >
                      다운로드#{idx + 1}
                    </a>
                    <br />
                  </div>
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">세금계산서:</label>
              <div className="col-sm-7 d-flex align-items-center">
                <Switch
                  name="isTaxBillSwitch"
                  isChecked={isTaxBill}
                  handleToggle={() => {
                    setIsTaxBill(!isTaxBill);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="container-fluid">
              <div className="row">
                {estimateItems?.map((item) => {
                  return (
                    <div
                      key={item.productId}
                      className="col-lg-6 d-flex align-items-stretch"
                    >
                      <div className="card mb-5">
                        <img
                          src={`${item.productImageFilepath}`}
                          className="rounded mx-auto w-50"
                        />
                        <div className="card-body text-center">
                          <h5>{item.productName}</h5>
                          <h6>
                            <span>
                              가격 :{" "}
                              {`${item.productPrice?.toLocaleString(
                                "ko-KR"
                              )} 원`}
                            </span>
                          </h6>
                          <h6>
                            <span>수량 : {item.estimateItemEA}</span>
                          </h6>
                        </div>
                        {item.productName?.includes("가방") && (
                          <div className="card-footer">
                            <h6 className="d-flex justify-content-between align-items-end mt-0 mb-0">
                              <span>인쇄</span>
                              <Switch
                                key={`toggle-switch-cart-${item.productId}`}
                                name={`cartIsPrintSwitch#${item.productId}`}
                                isChecked={item.isPrint as boolean}
                                handleToggle={
                                  () => {}
                                  //   switchHandleToggleForCart(
                                  //   item.productId as number,
                                  //   !item.isPrint
                                  // )
                                }
                              />
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <hr
              style={{
                margin: "0 0 5px 0",
              }}
            />
            <div className="row mt-2">
              <label className="col-sm-10 personal_data_item col-form-label">
                판매자 안내사항
              </label>
              <div className="col-sm-12">
                <textarea
                  name="memo"
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "7px",
                  }}
                  value={estimate?.response?.memo}
                  readOnly
                />
              </div>
            </div>
            <hr
              style={{
                margin: "0 0 5px 0",
              }}
            />
            <div className="row mb-3 mb-0">
              <label className="col-sm-3 col-form-label">결제수단:</label>
              <div className="col-sm-7 d-flex align-items-center justify-content-between">
                {paymentMethodList.map((value, i) => (
                  <div key={`payment-method-radio-${i}`}>
                    <input
                      id={value}
                      value={value}
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === value}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value as PaymentMethodType);
                      }}
                    />{" "}
                    <label className="d-inline" htmlFor={value}>
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <hr
              style={{
                margin: "0 0 10px 0",
              }}
            />

            <div className="row">
              <div className="container">
                <div className="d-flex justify-content-between">
                  <p className="mb-0">상품 금액</p>
                  <p className="mb-0">{`${estimateResponse?.totalProductsPrice.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">부가세</p>
                  <p className="mb-0">{`+${estimateResponse?.tax.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">인쇄비</p>
                  <p className="mb-0">{`+${estimateResponse?.printFee.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-1">배송비</p>
                  <p className="mb-1">{`+${estimateResponse?.deliveryFee.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
              </div>
              <div className="container d-flex justify-content-between">
                <h5 className="ml-0 pl-0">총 결제 금액</h5>
                <h5>{`${estimateResponse?.totalPrice.toLocaleString(
                  "ko-KR"
                )} 원`}</h5>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-success px-5 float-right mt-2"
            >
              <FontAwesomeIcon icon={faCheckCircle} /> 결제하기
            </button>
            <div className="row">
              <h4>
                결제 금액 :{" "}
                <span>{`${estimateResponse?.totalPrice.toLocaleString(
                  "ko-KR"
                )} 원`}</span>
              </h4>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderPage;
