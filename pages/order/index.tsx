import React, {
  FC,
  FormEvent,
  TextareaHTMLAttributes,
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

import { addOrder, fetchOrder } from "../../src/redux/thunks/order-thunks";
import PageLoader from "../../src/component/PageLoader/PageLoader";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import {
  OrderError,
  OrderItem,
  Product,
  PostCodeObject,
  Customer,
  CartItem,
  Order,
  CartItemNonMember,
} from "../../src/types/types";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import DaumPostcode from "react-daum-postcode";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { API_BASE_URL } from "../../src/utils/constants/url";
import { useRouter } from "next/router";
import { fetchCart } from "../../src/redux/thunks/cart-thunks";
import {
  orderAddedFailure,
  saveInsertOrderInformation,
} from "../../src/redux/actions/order-actions";
import { FRONT_BASE_URL } from "../../src/utils/constants/url";
const clientKey = "test_ck_LBa5PzR0ArnEp5zdmwvVvmYnNeDM";

const MySwal = withReactContent(Swal);

type PaymentMethodType = "카드" | "계좌이체" | "가상계좌";

const OrderPage: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const customerId = useRef<number>(-1);
  const paymentMethodList = ["카드", "계좌이체", "가상계좌"];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("카드");

  useEffect(() => {
    if (sessionStorage.getItem("id") !== null) {
      // 로그인 상태 : 회원 주문
      customerId.current = parseInt(sessionStorage.getItem("id") as string);
      dispatch(fetchCart(parseInt(sessionStorage.getItem("id") as string)));
    }

    dispatch(orderAddedFailure({}));
  }, []);

  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const orderTotalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );
  const errors: Partial<OrderError> = useSelector(
    (state: AppStateType) => state.order.errors
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  const [orderCustomerName, setOrderCustomerName] = useState<
    string | undefined
  >(customersData.customerName);

  const [orderPhoneNumber, setOrderPhoneNumber] = useState<string | undefined>(
    customersData.customerPhoneNumber
  );
  const [orderPostIndex, setOrderPostIndex] = useState<string | undefined>(
    customersData.customerPostIndex
  );
  const [orderAddress, setOrderAddress] = useState<string | undefined>(
    customersData.customerAddress
  );
  const [orderAddressDetail, setOrderAddressDetail] = useState<
    string | undefined
  >(customersData.customerAddressDetail);

  const [orderMemo, setOrderMemo] = useState<string | undefined>("");

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const postIndexRef = useRef(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = useCallback(() => {
    if (textAreaRef === null || textAreaRef.current === null) return;
    textAreaRef.current.style.height = "37px";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  }, []);

  const onClickPostIndex = (): void => {
    setIsPopupOpen((prevState) => !prevState);
  };

  const onCompletePostIndex = (data: PostCodeObject): void => {
    setOrderAddress(
      data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress
    );
    setOrderPostIndex(data.zonecode);
    setIsPopupOpen(false);
  };

  const {
    orderCustomerNameError,
    orderPostIndexError,
    orderAddressError,
    orderAddressDetailError,
    orderPhoneNumberError,
  } = errors;

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (
      !Boolean(orderCustomerName) ||
      !Boolean(orderPostIndex) ||
      !Boolean(orderAddress) ||
      !Boolean(orderAddressDetail) ||
      !Boolean(orderPhoneNumber)
    ) {
      const orderError: OrderError = {
        orderCustomerNameError: "",
        orderPostIndexError: "",
        orderAddressError: "",
        orderAddressDetailError: "",
        orderPhoneNumberError: "",
      };

      if (!Boolean(orderCustomerName)) {
        orderError.orderCustomerNameError = "수령인은 필수 입니다.";
      }
      if (!Boolean(orderPostIndex)) {
        orderError.orderPostIndexError = "우편번호는 필수 입니다.";
      }
      if (!Boolean(orderAddress)) {
        orderError.orderAddressError = "주소는 필수 입니다.";
      }
      if (!Boolean(orderAddressDetail)) {
        orderError.orderAddressDetailError = "상세주소는 필수 입니다.";
      }
      if (!Boolean(orderPhoneNumber)) {
        orderError.orderPhoneNumberError = "연락처는 필수 입니다.";
      }
      dispatch(orderAddedFailure(orderError));
      return;
    } else {
      dispatch(orderAddedFailure({}));
    }

    const insertOrder = {
      customerId: customerId.current,
      orderCustomerName,
      orderPostIndex,
      orderAddress,
      orderAddressDetail,
      orderPhoneNumber,
      orderMemo,
      orderTotalPrice,
      cart,
    };

    dispatch(saveInsertOrderInformation(insertOrder));

    // 결제창 요청
    loadTossPayments(clientKey).then((tossPayments) => {
      tossPayments.requestPayment(paymentMethod, {
        amount: orderTotalPrice,
        orderId: `order-${
          customerId.current === -1
            ? `NM${orderPostIndex?.slice(0, 2)}${orderPhoneNumber?.slice(-4)}`
            : customerId.current
        }-${Date.now()}`,
        orderName:
          cart.length === 1
            ? cart[0].product.productName
            : `${cart[0].product.productName} 외 ${cart.length - 1}건`,
        customerName: customersData.customerName,
        successUrl: `${FRONT_BASE_URL}/order/success`,
        failUrl: `${FRONT_BASE_URL}/order/fail`,
      });
    });
  };

  let pageLoading;
  if (loading) {
    pageLoading = <PageLoader />;
  }

  return (
    <div className="container mt-5 pb-5">
      {pageLoading}
      <h4 className="mb-4 text-center">
        <FontAwesomeIcon className="mr-2" icon={faShoppingBag} /> 주문하기
      </h4>
      <br />
      <form onSubmit={onFormSubmit}>
        <div className="row">
          <div className="col-lg-6">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">수령인:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className={
                    orderCustomerNameError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="lastName"
                  value={orderCustomerName}
                  placeholder=""
                  onChange={(event) => setOrderCustomerName(event.target.value)}
                />
                <div className="invalid-feedback">{orderCustomerNameError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">우편번호:</label>
              <div className="col-sm-8">
                <input
                  ref={postIndexRef}
                  onClick={onClickPostIndex}
                  readOnly
                  type="text"
                  className={
                    orderPostIndexError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="postIndex"
                  value={orderPostIndex}
                  placeholder="우편번호 검색"
                  onChange={(event) => setOrderPostIndex(event.target.value)}
                />
                <div className="invalid-feedback">{orderPostIndexError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">주소:</label>
              <div className="col-sm-8">
                <input
                  readOnly
                  type="text"
                  className={
                    orderAddressError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="address"
                  value={orderAddress}
                  onChange={(event) => setOrderAddress(event.target.value)}
                />
                <div className="invalid-feedback">{orderAddressError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">상세주소:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className={
                    orderAddressDetailError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="address"
                  value={orderAddressDetail}
                  onChange={(event) =>
                    setOrderAddressDetail(event.target.value)
                  }
                />
                <div className="invalid-feedback">
                  {orderAddressDetailError}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">연락처:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className={
                    orderPhoneNumberError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="phoneNumber"
                  value={orderPhoneNumber}
                  placeholder="01012341234"
                  maxLength={11}
                  onChange={(event) => setOrderPhoneNumber(event.target.value)}
                />
                <div className="invalid-feedback">{orderPhoneNumberError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">요청사항:</label>
              <div className="col-sm-8">
                <textarea
                  ref={textAreaRef}
                  style={{
                    minHeight: "37px",
                  }}
                  className="form-control"
                  name="orderMemo"
                  value={orderMemo}
                  placeholder="200자 이내"
                  rows={1}
                  maxLength={200}
                  onChange={(event) => {
                    handleResizeHeight();
                    setOrderMemo(event.target.value);
                  }}
                />
              </div>
            </div>
            {isPopupOpen && (
              <div className="form-group row">
                <label className="col-sm-2 col-form-label"></label>
                <div className="col-sm-8">
                  <DaumPostcode
                    className="form-control"
                    style={{
                      border: "1px solid black",
                      padding: 0,
                    }}
                    onComplete={onCompletePostIndex}
                  />
                </div>
              </div>
            )}
            <hr
              style={{
                margin: "0 0 10px 0",
                maxWidth: "82.5%",
              }}
            />
          </div>
          <div className="col-lg-6">
            <div className="container-fluid">
              <div className="row">
                {cart.map((cartItem) => {
                  return (
                    <div
                      key={cartItem.product.id}
                      className="col-lg-6 d-flex align-items-stretch"
                    >
                      <div className="card mb-5">
                        <img
                          src={`${cartItem.product.productImageFilepath}`}
                          className="rounded mx-auto w-50"
                        />
                        <div className="card-body text-center">
                          <h5>{cartItem.product.productName}</h5>
                          <h6>
                            <span>
                              가격 :{" "}
                              {`${cartItem.product.productPrice.toLocaleString(
                                "ko-KR"
                              )} 원`}
                            </span>
                          </h6>
                          <h6>
                            <span>수량 : {cartItem.productCount}</span>
                          </h6>
                        </div>
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
            <div className="form-group row mb-0">
              <label className="col-sm-2 col-form-label">결제수단:</label>
              <div className="col-sm-8 d-flex align-items-center justify-content-between">
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
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-success px-5 float-right"
            >
              <FontAwesomeIcon icon={faCheckCircle} /> 결제하기
            </button>
            <div className="row">
              <h4>
                주문 금액 :{" "}
                <span>{`${orderTotalPrice.toLocaleString("ko-KR")} 원`}</span>
              </h4>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderPage;
