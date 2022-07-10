import { useRouter } from "next/router";
import { ChangeEvent, FC, FormEvent, RefObject, useCallback, useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Switch from "../../src/component/Switch/Switch";
import { SetCartItemIsPrint } from "../../src/redux/actions/cart-actions";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import { addSheetRequest } from "../../src/redux/thunks/order-thunks";
import { CartItem, CartItemNonMember, Customer, CustomerEdit, CustomerEditErrors, PostCodeObject, SheetRequestData } from "../../src/types/types";
import requestService from "../../src/utils/request-service";


const SheetRequest: FC = () => {

  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  // ===== 파일첨부 =====
  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const cartTotalCount = useRef<number>(0);
  const maxDesignFileCount = useRef<number>(1);
  const [orderDesignFile, SetOrderDesignFile] = useState<Array<string | Blob>>([]);

  useEffect(() => {
    cartTotalCount.current = 0;
    cart.forEach((val) => {
      val.isPrint = val.isPrint ? val.isPrint : false;
      if (val.isPrint) {
        cartTotalCount.current += val.productCount;
      }
    });
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

  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: any): void => {
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

  // ===== 주소 및 데이터 저장 =====
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const sheetRequestData: Partial<SheetRequestData> = useSelector(
    (state: AppStateType) => state.order.sheetRequestData
  );
  
  const errors: Partial<CustomerEditErrors> = useSelector(
    (state: AppStateType) => state.customer.customerEditErrors
  );

  const isEstimateAdded: boolean = useSelector(
    (state: AppStateType) => state.order.isEstimateAdded
  );
  
  const { emailError, nameError, phoneNumberError, postIndexError, addressError} = errors;

  const {
    id,
    customerEmail,
    customerName,
    customerPhoneNumber,
    customerPostIndex,
    customerAddress,
    customerAddressDetail,
    customerRole,
  } = customersData;

  const [sheetRequest, setSheetRequest] = useState<Partial<SheetRequestData>>(sheetRequestData);

  const switchHandleToggleForCart =
  (productId: number, isPrint: boolean) => () => {
    dispatch(SetCartItemIsPrint(productId, isPrint));
  };

  const [newCustomerName, setNewCustomerName] = useState<string>(
    customerName || ""
  );
  const [newCustomerEmail, setNewCustomerEmail] = useState<string>(
    customerEmail || ""
  );
  const [newCustomerPhoneNumber, setNewCustomerPhoneNumber] = useState<string>(
    customerPhoneNumber || ""
  );
  const [businessName, setBusineesName] = useState<string>("");
  const [businessType, setBusineesType] = useState<string>("");
  const [businessNumber, setBusineesNumber] = useState<string>("");
  const [newCustomerPostIndex, setNewCustomerPostIndex] = useState<string>(
    customerPostIndex || ""
  );
  const [newCustomerAddress, setNewCustomerAddress] = useState<string>(
    customerAddress || ""
  );
  const [newCustomerAddressDetail, setNewCustomerAddressDetail] = useState<string>(
    customerAddressDetail || ""
  );
  const [printingDraft, setPrintingDraft] = useState<string>("");
  const [desiredDate, setDesiredDate] = useState<string>("");
  const [requestMemo, setRequestMemo] = useState<string>(
    
`가방의 경우, 아래 양식에 맞게 정확한 내용을 입력해주시면 빠른 상담이 가능합니다.
- 인쇄 시안은 파일첨부 이용
- 총 주문수량 100개당 1개 시안 업로드 가능

인쇄 사이즈     : 
인쇄 컬러수    : 
제작 수량       : 

추가 요청사항 :
`
  );
 
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const onCompletePostIndex = (data: PostCodeObject): void => {
    setNewCustomerAddress(
      data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
    );
    setNewCustomerPostIndex(data.zonecode);
    setIsPopupOpen(false);
  };

  const onClickPostIndex = (): void => {
    setIsPopupOpen((prevState) => !prevState);
  };

  const postIndexRef = useRef(null);

  // ===== 견적 요청 =====
  // 사업자번호 확인
  const isBusinessNumber = (str : string) : boolean  => {
    
    if(str == "") return true;

    /* 사업자등록번호 */
    if(str.match(/([0-9]{3})-?([0-9]{2})-?([0-9]{5})/)) return true;

    /* 법인등록번호 */
    if(str.match(/^([0-9]{6})\-([0-9]{7})$/)) return true;
    
    return false
  }

  // 휴대폰번호
  const isPhoneNumber = (str : string) : boolean  => {
    
    if(str == "") return false;

    /* 휴대폰 번호 */
    if(str.match(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/)) return true;

    /* 알반 전화번호 */
    if(str.match(/^\d{2,3}-\d{3,4}-\d{4}$/)) return true;
    
    return false
  }

  // 견적 요청 버튼
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!isPhoneNumber(newCustomerPhoneNumber)) {
      MySwal.fire({
        title: `<strong>연락처 에러</strong>`,
        html: `<i>올바른 연락처를 적어주세요.</i>`,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: '확인',
      })
      return;
    }

    if(!isBusinessNumber(businessNumber)) {
      MySwal.fire({
        title: `<strong>사업자 번호 에러</strong>`,
        html: `<i>사업자 번호 형식에 맞지 않습니다.</i>`,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: '확인',
      })
      return;
    }

    if(desiredDate == "") {
      MySwal.fire({
        title: `<strong>납기 희망일 에러</strong>`,
        html: `<i>납기 희망일을 선택해주세요.</i>`,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: '확인',
      })
      return;
    }
    
    if (orderDesignFile) {
      const formData: FormData = new FormData();
      orderDesignFile.forEach((val) => formData.append("files", val));

      // formData.append("file", orderDesignFile);
      const response = await requestService.post(
        "/order/design",
        formData
        // false,
        // "multipart/form-data"
      );

      sheetRequest.printingDraft = response.data;
    }

    if(id != undefined) dispatch(addSheetRequest(sheetRequest, id, cart));
    else dispatch(addSheetRequest(sheetRequest, -1, cart));

  }

  useEffect(() => {
    if(isEstimateAdded) {
      router.push("/account/customer/estimate");
    }
  },[isEstimateAdded])


  useEffect(() => {

    setSheetRequest({
      newCustomerName,
      newCustomerEmail,
      newCustomerPhoneNumber,
      businessName,
      businessType,
      businessNumber,
      newCustomerPostIndex,
      newCustomerAddress,
      newCustomerAddressDetail,
      printingDraft,
      desiredDate,
      requestMemo
    });
  },[      
    newCustomerName,
    newCustomerEmail,
    newCustomerPhoneNumber,
    businessName,
    businessType,
    businessNumber,
    newCustomerPostIndex,
    newCustomerAddress,
    newCustomerAddressDetail,
    printingDraft,
    desiredDate,
    requestMemo])

  const items = (
    <>
      {cart.map((cartItem: CartItem | CartItemNonMember) => {
          if(cartItem.product.productName.includes("가방")) {
            return (
              <div
                key={cartItem.product.id}
                className="card mb-3 col-10"
              >
                <div className="row no-gutters">
                  <div className="col-3 mx-3 my-3">
                    <img
                      src={`${cartItem.product.productImageFilepath}`}
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-5 text-left">
                    <div className="card-body">
                      <h4 className="card-title">
                        {cartItem.product.productName}
                      </h4>
                      <p className="card-text">
                        {cartItem.productPrice.toLocaleString("ko-KR")} 원
                      </p>
                      <p className="card-text">
                        {cartItem.productCount} 개
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row card-footer d-flex justify-content-between">
                  <h6 className="mt-0 mb-0">
                    <span>인쇄</span>
                  </h6>
                  <div>
                    <Switch
                      key={`toggle-switch-cart-${cartItem.productId}`}
                      name={`cartIsPrintSwitch#${cartItem.productId}`}
                      isChecked={cartItem.isPrint}
                      handleToggle={switchHandleToggleForCart(
                        cartItem.productId,
                        !cartItem.isPrint
                      )}
                    />
                  </div>
                </div>        
              </div>
            )
          }
          else {
            return (
              <div
                key={cartItem.product.id}
                className="card mb-3 col-10"
              >
                <div className="row no-gutters">
                  <div className="col-3 mx-3 my-3">
                    <img
                      src={`${cartItem.product.productImageFilepath}`}
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-5 text-left">
                    <div className="card-body">
                      <h4 className="card-title">
                        {cartItem.product.productName}
                      </h4>
                      <p className="card-text">
                        {cartItem.productPrice.toLocaleString("ko-KR")} 원
                      </p>
                      <p className="card-text">
                        {cartItem.productCount} 개
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }        
        }
      )}
    </>
  );
  
  return (
    <div id="mid" className="w-100">
      <div id="wrapper" className="container">
        <div id="container_wr">
          <h2 className="d-flex jc-center mb-5 mt-5"> 견적 요청서</h2>
          <form className="form-sheet" onSubmit={handleSubmit}>
            <ul className="d-flex">
              <li className="col-3 text-left">장바구니 상품 목록</li>             
            </ul>
            {items}
            <ul className="d-flex">
              <li className="col-3 text-left">대표자</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name="newCustomerName"
                 value={newCustomerName}
                 onChange={(event) => {setNewCustomerName(event.target.value);}}
                />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">이메일</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name="newCustomerEmail"
                 value={newCustomerEmail}
                 onChange={(event) => {setNewCustomerEmail(event.target.value);}}
                />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">연락처</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name="newCustomerPhoneNumber"
                 value={newCustomerPhoneNumber}
                 onChange={(event) => {setNewCustomerPhoneNumber(event.target.value);}}
                 />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">업체 상호</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name='businessName'
                 value={businessName}
                 onChange={(event) => {setBusineesName(event.target.value);}}                 
                 />              
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">업태 및 종목</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name="businessType"
                 value={businessType}
                 onChange={(event) => {setBusineesType(event.target.value);}}                 
                 />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">사업자등록번호</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name="businessNumber"
                 value={businessNumber}
                 placeholder="'-'을 포함하여 입력해주세요"
                 onChange={(event) => {setBusineesNumber(event.target.value);}}                 
                 />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">배송주소</li>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left" style={{listStyle:"none"}}>우편번호</li>
              <div className="col-sm-7 form-input">
                <input
                  ref={postIndexRef}
                  onClick={onClickPostIndex}
                  readOnly
                  type="text"
                  name="newCustomerPostIndex"
                  className={
                    postIndexError ? 'form-control is-invalid' : 'form-control'
                  }
                  value={newCustomerPostIndex}
                  placeholder="우편번호"
                  onChange={(event) => setNewCustomerPostIndex(event.target.value)}
                />
              </div>
            </ul>
            {isPopupOpen && (
              <ul>
                  <div className="d-flex mb-2 row">
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
                </ul>
              )}
            <ul className="d-flex">
              <li className="col-3 text-left" style={{listStyle:"none"}}>주소</li>
              <div className="col-sm-7 form-input">
                  <input
                    readOnly
                    type="text"
                    name="newCustomerAddress"
                    className={
                      addressError ? 'form-control is-invalid' : 'form-control'
                    }
                    value={newCustomerAddress}
                    onChange={(event) => setNewCustomerAddress(event.target.value)}
                  />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left" style={{listStyle:"none"}}>상세 주소</li>
              <div className="col-sm-7 form-input">
                <input
                  type="text"
                  className={
                    addressError ? 'form-control is-invalid' : 'form-control'
                  }
                  name="newCustomerAddressDetail"
                  value={newCustomerAddressDetail}
                  onChange={(event) =>
                    setNewCustomerAddressDetail(event.target.value)
                  }
                  />  
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">인쇄 시안</li>
              <div className="col-sm-7 form-input">
                <input
                  type="file"
                  className={"form-control"}
                  style={{ height: "44px" }}
                  name="printingDraft"
                  ref={fileInput}
                  onChange={handleFileChange}
                  multiple
                  accept="image/gif, image/jpeg, image/png"
                />
              </div>              
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">납기 희망일</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="date"
                 name='desiredDate'
                 value={desiredDate}
                 onChange={(event) => {setDesiredDate(event.target.value);}}                 
                 />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">요청사항</li>
              <div id="div-textarea" className="col-sm-7 form-input">
                <textarea
                  id="sheet-textarea"
                  className="form-control"
                  name="requestMemo"
                  value={requestMemo}
                  onChange={(event) => {setRequestMemo(event.target.value);}}
                />
              </div>
            </ul>
            <ul className="d-flex">
              <div className="btn-div">
                <button type="submit" className="btn btn-warning btn-sheet">견적요청</button>
              </div>
            </ul>
          </form>
        </div>    
      </div>
    </div>
  );
};

export default SheetRequest;

