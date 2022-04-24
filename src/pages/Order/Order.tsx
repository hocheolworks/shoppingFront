import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faShoppingBag,
} from '@fortawesome/free-solid-svg-icons';

import { addOrder, fetchOrder } from '../../redux/thunks/order-thunks';
import { validateEmail } from '../../utils/input-validators';
import PageLoader from '../../component/PageLoader/PageLoader';
import { AppStateType } from '../../redux/reducers/root-reducer';
import { useHistory } from 'react-router-dom';
import {
  OrderError,
  OrderItem,
  Product,
  PostCodeObject,
  Customer,
  CartItem,
} from '../../types/types';

import DaumPostcode from 'react-daum-postcode';
import './Order.css';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { API_BASE_URL } from '../../utils/constants/url';
const clientKey = 'test_ck_LBa5PzR0ArnEp5zdmwvVvmYnNeDM';

const Order: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const cart: Array<CartItem> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  // totalPricee --> orderTotalPrice로 변경
  const orderTotalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );
  const errors: Partial<OrderError> = useSelector(
    (state: AppStateType) => state.order.errors
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  const [validateEmailError, setValidateEmailError] = useState<string>('');

  // hjlee define state for order--------------------------------------------
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
  const [orderItems, setOrderItems] = useState<Array<OrderItem> | undefined>(
    []
  );
  // hyeongwook add
  // const [customerId] = useState<number | undefined>(customersData.id);
  const [customerId] = [localStorage.getItem('id')];
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const postIndexRef = useRef(null);

  const onClickPostIndex = (): void => {
    setIsPopupOpen((prevState) => !prevState);
  };

  const onCompletePostIndex = (data: PostCodeObject): void => {
    setOrderAddress(
      data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
    );
    setOrderPostIndex(data.zonecode);
    setIsPopupOpen(false);
  };

  useEffect(() => {}, []);
  // -------------------------------------------------------------------------

  const { lastNameError, addressError, postIndexError, phoneNumberError } =
    errors;

  useEffect(() => {
    dispatch(fetchOrder());
  }, []);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (cart === undefined || cart === null || cart.length === 0) return;
    loadTossPayments(clientKey).then((tossPayments) => {
      tossPayments.requestPayment('카드', {
        // 결제 수단 파라미터
        // 결제 정보 파라미터
        amount: orderTotalPrice,
        orderId: '2dwadawdwadw-',
        orderName:
          cart.length === 1
            ? cart[0].product.productName
            : `${cart[0].product.productName} 외 ${cart.length - 1}건`,
        customerName: customersData.customerName,
        successUrl: 'http://localhost:3000/order/success',
        failUrl: 'http://localhost:3000/order/fail',
      });
    });

    const productsId = Object.fromEntries(
      new Map(JSON.parse(localStorage.getItem('products') as string))
    );

    console.log(productsId.arguments);
    const order = {
      customerId,
      orderCustomerName,
      orderPhoneNumber,
      orderPostIndex,
      orderAddress,
      orderAddressDetail,
      orderItems,
      productsId,
      orderTotalPrice,
    };
    dispatch(addOrder(order, history));
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
                    lastNameError ? 'form-control is-invalid' : 'form-control'
                  }
                  name="lastName"
                  value={orderCustomerName}
                  placeholder="Enter the last name"
                  onChange={(event) => setOrderCustomerName(event.target.value)}
                />
                <div className="invalid-feedback">{lastNameError}</div>
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
                    postIndexError ? 'form-control is-invalid' : 'form-control'
                  }
                  name="postIndex"
                  value={orderPostIndex}
                  placeholder="우편번호"
                  onChange={(event) => setOrderPostIndex(event.target.value)}
                />
                <div className="invalid-feedback">{postIndexError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">주소:</label>
              <div className="col-sm-8">
                <input
                  readOnly
                  type="text"
                  className={
                    addressError ? 'form-control is-invalid' : 'form-control'
                  }
                  name="address"
                  value={orderAddress}
                  onChange={(event) => setOrderAddress(event.target.value)}
                />
                <div className="invalid-feedback">{addressError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">상세주소:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className={
                    addressError ? 'form-control is-invalid' : 'form-control'
                  }
                  name="address"
                  value={orderAddressDetail}
                  onChange={(event) =>
                    setOrderAddressDetail(event.target.value)
                  }
                />
                <div className="invalid-feedback">{addressError}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">연락처:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className={
                    phoneNumberError
                      ? 'form-control is-invalid'
                      : 'form-control'
                  }
                  name="phoneNumber"
                  value={orderPhoneNumber}
                  placeholder="000-0000-0000"
                  onChange={(event) => setOrderPhoneNumber(event.target.value)}
                />
                <div className="invalid-feedback">{phoneNumberError}</div>
              </div>
            </div>
            {isPopupOpen && (
              <div className="form-group row">
                <label className="col-sm-2 col-form-label"></label>
                <div className="col-sm-8">
                  <DaumPostcode
                    className="form-control"
                    style={{
                      border: '1px solid black',
                      padding: 0,
                    }}
                    onComplete={onCompletePostIndex}
                  />
                </div>
              </div>
            )}
            <hr />
            {/* <div className="form-group row">
                            <label className="col-sm-2 col-form-label">
                                결제수단:
                            </label>
                            <div className="col-sm-8">
                                <input type="radio" />
                            </div>
                        </div> */}
          </div>
          <div className="col-lg-6">
            <div className="container-fluid">
              <div className="row">
                {cart.map((cartItem: CartItem) => {
                  return (
                    <div
                      key={cartItem.product.id}
                      className="col-lg-6 d-flex align-items-stretch"
                    >
                      <div className="card mb-5">
                        <img
                          src={`${API_BASE_URL.replace('api/v1', '')}${
                            cartItem.product.productImageFilepath
                          }`}
                          className="rounded mx-auto w-50"
                        />
                        <div className="card-body text-center">
                          <h5>{cartItem.product.productName}</h5>
                          <h6>
                            <span>
                              가격 :{' '}
                              {`${cartItem.product.productPrice.toLocaleString(
                                'ko-KR'
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
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-success px-5 float-right"
            >
              <FontAwesomeIcon icon={faCheckCircle} /> 결제하기
            </button>
            <div className="row">
              <h4>
                주문 금액 :{' '}
                <span>{`${orderTotalPrice.toLocaleString('ko-KR')} 원`}</span>
              </h4>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Order;
