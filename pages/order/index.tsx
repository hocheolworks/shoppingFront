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

import PageLoader from "../../src/component/PageLoader/PageLoader";
import Switch from "../../src/component/Switch/Switch";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import {
  OrderError,
  PostCodeObject,
  Customer,
  CartItem,
  CartItemNonMember,
  TaxBillInfo,
  TaxBillError,
} from "../../src/types/types";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import DaumPostcode from "react-daum-postcode";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { fetchCart } from "../../src/redux/thunks/cart-thunks";
import {
  orderAddedFailure,
  saveInsertOrderInformation,
  saveTaxBillInfoFailure,
  saveTaxBillInfoSuccess,
} from "../../src/redux/actions/order-actions";
import { FRONT_BASE_URL } from "../../src/utils/constants/url";
import RequestService from "../../src/utils/request-service";
import { SetCartItemIsPrint } from "../../src/redux/actions/cart-actions";
import requestService from "../../src/utils/request-service";
import { useRouter } from "next/router";
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string; // 진솔유통 테스트 클라이언트 키

const MySwal = withReactContent(Swal);

type PaymentMethodType =
  | "카드"
  | "가상계좌(무통장 입금)"
  | "계좌이체"
  | "가상계좌";

const OrderPage: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const customerId = useRef<number>(-1);
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const paymentMethodList = ["카드", "가상계좌(무통장 입금)", "계좌이체"];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("카드");

  useEffect(() => {
    if (sessionStorage.getItem("id") !== null) {
      // 로그인 상태 : 회원 주문
      customerId.current = parseInt(sessionStorage.getItem("id") as string);
      dispatch(fetchCart(parseInt(sessionStorage.getItem("id") as string)));
    }

    dispatch(orderAddedFailure({}));
    dispatch(saveTaxBillInfoFailure({}));
  }, []);

  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const cartTotalCount = useRef<number>(0);
  const maxDesignFileCount = useRef<number>(1);
  useEffect(() => {
    let tempPrintFee = 0;
    cartTotalCount.current = 0;
    cart.forEach((val) => {
      val.isPrint = val.isPrint ? val.isPrint : false;
      if (val.isPrint) {
        cartTotalCount.current += val.productCount;
        if (val.productCount < 100) {
          tempPrintFee += val.productCount * 100;
        }
      }
    });
    setPrintFee(tempPrintFee);
    setOrderTotalPrice(cartTotalPrice + tax + tempPrintFee + deliveryFee);
    maxDesignFileCount.current = Math.floor(cartTotalCount.current / 100);
    if (maxDesignFileCount.current === 0) maxDesignFileCount.current = 1;

    if (orderDesignFile.length > maxDesignFileCount.current) {
      MySwal.fire({
        title: `<strong>파일 첨부</strong>`,
        html: `<i>인쇄 시안은 주문수량 합계 100개당 1개씩 가능합니다.<br/>첨부가능 시안 : ${maxDesignFileCount.current}</i>`,
        icon: "warning",
      });
      SetOrderDesignFile([]);
      if (fileInput.current !== null) fileInput.current.value = "";
    }
  }, [cart]);

  const cartTotalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );

  const [tax, SetTax] = useState<number>(
    cartTotalPrice ? cartTotalPrice * 0.1 : 0
  );
  const [deliveryFee, SetDeliveryFee] = useState<number>(
    cartTotalPrice ? (cartTotalPrice < 100_000 ? 5000 : 0) : 0
  );

  const [orderTotalPrice, setOrderTotalPrice] = useState<number>(
    cartTotalPrice ? cartTotalPrice + tax + deliveryFee : 0
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

  const [orderMemo, setOrderMemo] = useState<string | undefined>(
    `- 인쇄 요청시 우측 상품 이미지 아래 인쇄 버튼 클릭
- 인쇄 시안은 아래 파일첨부 이용
- 총 주문수량 100개당 1개 시안 업로드 가능`
  );

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isPopupOpenTaxBill, setIsPopupOpenTaxBill] = useState<boolean>(false);

  const [orderDesignFile, SetOrderDesignFile] = useState<Array<string | Blob>>(
    []
  );

  const postIndexRef = useRef(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 세금계산서 state
  const [isTaxBill, setIsTaxBill] = useState<boolean>(false);

  const [representativeName, setRepresentativeName] = useState<string>("");
  const [companyRegistrationNumber, setCompanyRegistrationNumber] =
    useState<string>("");
  const [companyLocation, setCompanyLocation] = useState<string>("");
  const [companyLocationDetail, setCompanyLocationDetail] =
    useState<string>("");
  const [businessCategory, setBusinessCategory] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const taxBillError: Partial<TaxBillError> = useSelector(
    (state: AppStateType) => state.order.taxBillError
  );

  // 인쇄비 state
  const [printFee, setPrintFee] = useState<number>(0);

  const handleResizeHeight = useCallback(() => {
    if (textAreaRef === null || textAreaRef.current === null) return;
    textAreaRef.current.style.height = "37px";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  }, []);

  const onClickPostIndex = (): void => {
    setIsPopupOpen((prevState) => !prevState);
  };
  const onClickPostIndexTaxBill = (): void => {
    setIsPopupOpenTaxBill((prevState) => !prevState);
  };

  const onCompletePostIndex = (data: PostCodeObject): void => {
    setOrderAddress(
      data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress
    );
    setOrderPostIndex(data.zonecode);
    setIsPopupOpen(false);
  };
  const onCompletePostIndexTaxBill = (data: PostCodeObject): void => {
    setCompanyLocation(
      data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress
    );
    setIsPopupOpenTaxBill(false);
  };

  const switchHandleToggleForCart =
    (productId: number, isPrint: boolean) => () => {
      dispatch(SetCartItemIsPrint(productId, isPrint));
    };

  const {
    orderCustomerNameError,
    orderPostIndexError,
    orderAddressError,
    orderAddressDetailError,
    orderPhoneNumberError,
  } = errors;

  const handleFileChange = (event: any): void => {
    // let maxDesignFileCount: number = Math.floor(cartTotalCount.current / 100);
    // if (maxDesignFileCount === 0) maxDesignFileCount = 1; //100개 미만이라도 1개까지는 업로드 가능
    if (Array.from(event.target.files).length > maxDesignFileCount.current) {
      event.preventDefault();
      MySwal.fire({
        title: `<strong>파일 첨부</strong>`,
        html: `<i>인쇄 시안은 주문수량 합계 100개당 1개씩 가능합니다.<br/>첨부가능 시안 : ${maxDesignFileCount.current}</i>`,
        icon: "warning",
      });
      if (fileInput.current !== null) fileInput.current.value = "";
    } else {
      SetOrderDesignFile([...event.target.files]);
    }
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(cartTotalCount.current);
    console.log(printFee);

    // return;
    if (
      !Boolean(orderCustomerName) ||
      !Boolean(orderPostIndex) ||
      !Boolean(orderAddress) ||
      !Boolean(orderAddressDetail) ||
      !Boolean(orderPhoneNumber) ||
      (isTaxBill &&
        (!Boolean(representativeName) ||
          !Boolean(companyRegistrationNumber) ||
          !Boolean(companyLocation) ||
          !Boolean(companyLocationDetail) ||
          !Boolean(businessCategory) ||
          !Boolean(businessType)))
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

      const taxBillError: TaxBillError = {
        representativeNameError: "",
        companyRegistrationNumberError: "",
        companyLocationError: "",
        companyLocationDetailError: "",
        businessCategoryError: "",
        businessTypeError: "",
      };

      if (!Boolean(representativeName)) {
        taxBillError.representativeNameError = "수령인은 필수 입니다.";
      }
      if (!Boolean(companyRegistrationNumber)) {
        taxBillError.companyRegistrationNumberError = "우편번호는 필수 입니다.";
      }
      if (!Boolean(companyLocation)) {
        taxBillError.companyLocationError = "주소는 필수 입니다.";
      }
      if (!Boolean(companyLocationDetail)) {
        taxBillError.companyLocationDetailError = "상세주소는 필수 입니다.";
      }
      if (!Boolean(businessCategory)) {
        taxBillError.businessCategoryError = "연락처는 필수 입니다.";
      }
      if (!Boolean(businessType)) {
        taxBillError.businessTypeError = "연락처는 필수 입니다.";
      }

      dispatch(saveTaxBillInfoFailure(taxBillError));
      return;
    } else {
      dispatch(orderAddedFailure({}));
      dispatch(saveTaxBillInfoFailure({}));
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
      orderTotalProductsPrice: cartTotalPrice,
      orderTax: tax,
      orderPrintFee: printFee,
      orderDeliveryFee: deliveryFee,
      orderDesignFile: [],
      isTaxBill,
      cart,
    };

    if (orderDesignFile) {
      const formData: FormData = new FormData();
      orderDesignFile.forEach((val) => formData.append("files", val));

      // formData.append("file", orderDesignFile);
      const response = await RequestService.post(
        "/order/design",
        formData
        // false,
        // "multipart/form-data"
      );

      insertOrder.orderDesignFile = response.data;
    }

    dispatch(saveInsertOrderInformation(insertOrder));

    // 세금 계산서 정보 저장
    if (isTaxBill) {
      const taxBillInfo: TaxBillInfo = {
        representativeName,
        companyRegistrationNumber,
        companyLocation,
        companyLocationDetail,
        businessCategory,
        businessType,
        email,
      };

      dispatch(saveTaxBillInfoSuccess(taxBillInfo));
    }

    // 결제창 요청
    if (paymentMethod === "계좌이체") {
      MySwal.fire({
        title: `<strong>계좌이체 정보</strong>`,
        html: `<span><b>결제 금액</b> : ${orderTotalPrice.toLocaleString(
          "ko-KR"
        )}원</span></br>
        <span><b>은행</b> : 국민은행</span></br><span><b>계좌번호</b> : 001501-04-176307</span></br><span><b>예금주</b> : 김진솔</span></br>`,
        icon: "info",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "다른 방법으로 결제하기",
      }).then((result) => {
        if (result.isConfirmed) {
          const body = {
            phoneNumber: orderPhoneNumber,
            totalPrice: orderTotalPrice,
          };
          const orderId = `order-${
            customerId.current === -1
              ? `NM${orderPostIndex?.slice(0, 2)}${orderPhoneNumber?.slice(-4)}`
              : customerId.current
          }-${Date.now()}`;
          requestService.post("/customer/alarm/account", body);
          router.push(
            `/order/success?paymentKey=notSendRequest&orderId=${orderId}&amount=${orderTotalPrice}`
          );
        } else if (result.isDenied) {
          // dispatch(returnToCartPage());
          // router.push("/login");
        }
      });
    } else {
      loadTossPayments(clientKey).then((tossPayments) => {
        tossPayments.requestPayment(
          paymentMethod === "가상계좌(무통장 입금)"
            ? "가상계좌"
            : paymentMethod,
          {
            amount: orderTotalPrice,
            orderId: `order-${
              customerId.current === -1
                ? `NM${orderPostIndex?.slice(0, 2)}${orderPhoneNumber?.slice(
                    -4
                  )}`
                : customerId.current
            }-${Date.now()}`,
            orderName:
              cart.length === 1
                ? cart[0].product.productName
                : `${cart[0].product.productName} 외 ${cart.length - 1}건`,
            customerName:
              customerId.current === -1
                ? orderCustomerName
                : customersData.customerName,
            successUrl: `${FRONT_BASE_URL}/order/success`,
            failUrl: `${FRONT_BASE_URL}/order/fail`,
          }
        );
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
        <FontAwesomeIcon className="mr-2" icon={faShoppingBag} /> 주문하기
      </h4>
      <br />
      <form onSubmit={onFormSubmit}>
        <div className="row">
          <div className="col-lg-7">
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">수령인:</label>
              <div className="col-sm-7">
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
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">우편번호:</label>
              <div className="col-sm-7">
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
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">주소:</label>
              <div className="col-sm-7">
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
            {isPopupOpen && (
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label"></label>
                <div className="col-sm-7">
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
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">상세주소:</label>
              <div className="col-sm-7">
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
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">연락처:</label>
              <div className="col-sm-7">
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
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">요청사항:</label>
              <div className="col-sm-7">
                <textarea
                  ref={textAreaRef}
                  style={{
                    minHeight: "200px",
                  }}
                  className="form-control"
                  name="orderMemo"
                  value={orderMemo}
                  rows={3}
                  maxLength={200}
                  onChange={(event) => {
                    handleResizeHeight();
                    setOrderMemo(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">파일첨부:</label>
              <div className="col-sm-7">
                <input
                  type="file"
                  className={"form-control"}
                  style={{ height: "44px" }}
                  name="file"
                  ref={fileInput}
                  onChange={handleFileChange}
                  multiple
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
            {isTaxBill && (
              <>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">
                    대표자 이름:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className={
                        taxBillError.representativeNameError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="CompanyRegistrationNumber"
                      value={representativeName}
                      placeholder=""
                      onChange={(event) =>
                        setRepresentativeName(event.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {taxBillError.representativeNameError}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">
                    사업자 등록번호:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className={
                        taxBillError.companyRegistrationNumberError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="CompanyRegistrationNumber"
                      value={companyRegistrationNumber}
                      placeholder="숫자만 입력해주세요."
                      onChange={(event) =>
                        setCompanyRegistrationNumber(event.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {taxBillError.companyRegistrationNumberError}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">
                    사업장 소재지:
                  </label>
                  <div className="col-sm-7">
                    <input
                      readOnly
                      type="text"
                      onClick={onClickPostIndexTaxBill}
                      className={
                        taxBillError.companyLocationError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="address"
                      value={companyLocation}
                      onChange={(event) =>
                        setCompanyLocation(event.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {taxBillError.companyLocationError}
                    </div>
                  </div>
                </div>
                {isPopupOpenTaxBill && (
                  <div className="row mb-3">
                    <label className="col-sm-3 col-form-label"></label>
                    <div className="col-sm-7">
                      <DaumPostcode
                        className="form-control"
                        style={{
                          border: "1px solid black",
                          padding: 0,
                        }}
                        onComplete={onCompletePostIndexTaxBill}
                      />
                    </div>
                  </div>
                )}
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">
                    사업장 상세주소:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className={
                        taxBillError.companyLocationDetailError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="address"
                      value={companyLocationDetail}
                      onChange={(event) =>
                        setCompanyLocationDetail(event.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {taxBillError.companyLocationDetailError}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">업태:</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className={
                        taxBillError.businessCategoryError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="CompanyRegistrationNumber"
                      value={businessCategory}
                      placeholder=""
                      onChange={(event) =>
                        setBusinessCategory(event.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {taxBillError.businessCategoryError}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">종목:</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className={
                        taxBillError.businessTypeError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="CompanyRegistrationNumber"
                      value={businessType}
                      placeholder=""
                      onChange={(event) => setBusinessType(event.target.value)}
                    />
                    <div className="invalid-feedback">
                      {taxBillError.businessTypeError}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">이메일:</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className={"form-control"}
                      name="CompanyRegistrationNumber"
                      value={email}
                      placeholder=""
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="col-lg-5">
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
                              {`${cartItem.productPrice.toLocaleString(
                                "ko-KR"
                              )} 원`}
                            </span>
                          </h6>
                          <h6>
                            <span>수량 : {cartItem.productCount}</span>
                          </h6>
                        </div>
                        {cartItem.product.productName.includes("가방") && (
                          <div className="card-footer">
                            <h6 className="d-flex justify-content-between align-items-end mt-0 mb-0">
                              <span>인쇄</span>
                              <Switch
                                key={`toggle-switch-cart-${cartItem.productId}`}
                                name={`cartIsPrintSwitch#${cartItem.productId}`}
                                isChecked={cartItem.isPrint}
                                handleToggle={switchHandleToggleForCart(
                                  cartItem.productId,
                                  !cartItem.isPrint
                                )}
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
            <div className="row mb-3 mb-0">
              <label className="col-sm-3 col-form-label">결제수단:</label>
              <div className="col-sm-9 d-flex align-items-center justify-content-between">
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
                  <p className="mb-0">{`${cartTotalPrice.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">부가세</p>
                  <p className="mb-0">{`+${tax.toLocaleString("ko-KR")} 원`}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">인쇄비</p>
                  <p className="mb-0">{`+${printFee.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-1">배송비</p>
                  <p className="mb-1">{`+${deliveryFee.toLocaleString(
                    "ko-KR"
                  )} 원`}</p>
                </div>
              </div>
              <div className="container d-flex justify-content-between">
                <h5 className="ml-0 pl-0">총 주문 금액</h5>
                <h5>{`${orderTotalPrice.toLocaleString("ko-KR")} 원`}</h5>
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
