import { ChangeEvent, FC, FormEvent, RefObject, useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import { addSheetRequest } from "../../src/redux/thunks/order-thunks";
import { CartItem, CartItemNonMember, Customer, CustomerEdit, CustomerEditErrors, PostCodeObject, SheetRequestData } from "../../src/types/types";


const SheetRequest: FC = () => {

  const dispatch = useDispatch();

  // 파일첨부
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const [orderDesignFile, SetOrderDesignFile] = useState<string | Blob>("");
  
  const handleFileChange = (event: any): void => {
    SetOrderDesignFile(event.target.files[0]);
  };

  // 주소 및 데이터 저장
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const sheetRequestData: Partial<SheetRequestData> = useSelector(
    (state: AppStateType) => state.order.sheetRequestData
  );
  
  const errors: Partial<CustomerEditErrors> = useSelector(
    (state: AppStateType) => state.customer.customerEditErrors
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

  // 카트에 담긴 상품목록
  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );
  
  // 견적 요청 버튼
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if(id != undefined) dispatch(addSheetRequest(sheetRequest, id, cart));
    else dispatch(addSheetRequest(sheetRequest, -1, cart));
  }

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
      )}
    </>
  );
  
  return (
    <div id="mid" className="w-100">
      <div id="wrapper" className="container">
        <div id="container_wr">
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
              <div className="col-sm-7 form-input" style={{height:"300px", wordBreak:"break-all"}}>
                <textarea
                 className="form-control"
                 style={{height:"100%", wordBreak:"break-all"}}
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

