import { faInfoCircle, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoader } from "../../src/redux/actions/auth-actions";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import { fetchNonMemberOrders } from "../../src/redux/thunks/order-thunks";
import { AuthErrors, Order } from "../../src/types/types";

const Orders: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const errors: Partial<AuthErrors> = useSelector(
    (state: AppStateType) => state.auth.errors
  );

  const order: Partial<Order> = useSelector(
    (state: AppStateType) => state.order.order
  );

  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  useEffect(() => {
    dispatch(showLoader());
  }, [])
  const {
    emailError,
    nameError,
    passwordError,
    password2Error,
    phoneNumberError,
  } = errors;

  const [orderId, setOrderId] = useState<string>("");
  const [customerName, setName] = useState<string>("");
  const [customerPhoneNumber, setPhoneNumber] = useState<string>("");

  const onClickHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (orderId != undefined){
      dispatch(fetchNonMemberOrders(orderId, customerName, customerPhoneNumber, router));
    } else {
      alert('주문번호를 입력하세요.');
    }
  }

  let fetchLink;
  if(loading) {
    fetchLink = (
      <div className="container mt-5 mb-5">
        <h3>비회원 주문조회</h3>
        <hr className="mb-3"/>
        <form onSubmit={onClickHandler}>
          <div className="form-group row ml-1">
            <label className="col-form-label">주문번호:&nbsp;</label>
            <div className="form-input">
              <input 
                type="text"
                name="orderNumber"
                className="form-control"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
              ></input>
            </div>
          </div>
          <div className="form-group row ml-1">
            <label className="col-form-label">이름:&nbsp;</label>
            <div className="form-input">
              <input
                type="text"
                name="customerName"
                value={customerName}
                className={
                  nameError ? "form-control is-invalid" : "form-control"
                }
                onChange={(event) => setName(event.target.value)}
              ></input>
              <div className="invalid-feedback">{nameError}</div>
            </div>
          </div>
          <div className="form-group row ml-1">
            <label className=" col-form-label">휴대폰번호:&nbsp;</label>
            <div className="form-input">
              <input
                type="text"
                name="phoneNumber"
                className={
                  phoneNumberError ? "form-control is-invalid" : "form-control"
                }
                value={customerPhoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
              <div className="invalid-feedback">{phoneNumberError}</div>
            </div>
          </div>
          <div className="form-group row ml-1">
            <button type="submit" className="btn btn-dark mx-2 mb-5">
              확인
            </button>
          </div>
        </form>
      </div>
    )
  }
  else {
    fetchLink = (
      <div className="container mt-5 mb-5">
        <h4 style={{ textAlign: 'center' }}>
          <FontAwesomeIcon icon={faShoppingBag} /> 주문 #{order.id}
        </h4>
        <div className="row border my-5 px-5 py-3">
          <div className="col-md-6">
            <h5 style={{ marginBottom: '30px' }}>
              <FontAwesomeIcon icon={faInfoCircle} /> 주문자 정보
            </h5>
            <p className="personal_data_item">
              이름:
              <span className="personal_data_text">{order.orderCustomerName}</span>
            </p>
            <p className="personal_data_item">
              휴대폰 번호:
              <span className="personal_data_text">{order.orderPhoneNumber}</span>
            </p>
            <p className="personal_data_item">
              우편변호:
              <span className="personal_data_text">{order.orderPostIndex}</span>
            </p>
            <p className="personal_data_item">
              배송주소:
              <span className="personal_data_text">{order.orderAddress}</span>
            </p>
            <p className="personal_data_item">
              상세주소:
              <span className="personal_data_text">{order.orderAddressDetail}</span>
            </p>
            <p className="personal_data_item">
              배송메모:
              <span className="personal_data_text">{order.orderMemo}</span>
            </p>
          </div>
          <div className="col-md-6">
            <h5 style={{ marginBottom: '30px' }}>
              <FontAwesomeIcon icon={faInfoCircle} /> 주문 정보
            </h5>
            <p className="personal_data_item">
              주문번호:
              <span className="personal_data_text">{order.id}</span>
            </p>
            <p className="personal_data_item">
              주문날짜:
              <span className="personal_data_text">
                {typeof(order.createdAt) == "string" && (
                  new Date(order.createdAt).toLocaleString('ko-kr')
                )}
              </span>
            </p>
            <p className="personal_data_item">
              주문상태:
              <span className="personal_data_text">{order.orderStatus}</span>
            </p>
            <p className="personal_data_item">
              결제여부:
              <span className="personal_data_text">
                {order.orderIsPaid ? 'O' : 'X'}
              </span>
            </p>
            <h4 style={{ marginBottom: '30px', marginTop: '30px' }}>
              주문금액:
              <span style={{ color: 'green' }}>
                {' '}
                {order.orderTotalPrice?.toLocaleString()} 원
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
            { order.orderItems != undefined && (
              order.orderItems.map((orderItem) => {
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
            }))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>{fetchLink}</>
  );
};

export default Orders;
