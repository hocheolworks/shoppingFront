import { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useSelector } from "react-redux";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import { CartItem, CartItemNonMember, Customer, CustomerEdit, CustomerEditErrors, PostCodeObject } from "../../src/types/types";


const SheetRequest: FC = () => {

  // 파일첨부
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const [orderDesignFile, SetOrderDesignFile] = useState<string | Blob>("");
  
  const handleFileChange = (event: any): void => {
    SetOrderDesignFile(event.target.files[0]);
  };


  // 주소 및 데이터 저장
  // TODO : CustomerEdit말고 sheet전용으로 새로 만들것
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const customersEditData: Partial<CustomerEdit> = useSelector(
    (state: AppStateType) => state.customer.customerEdit
  );

  const errors: Partial<CustomerEditErrors> = useSelector(
    (state: AppStateType) => state.customer.customerEditErrors
  );

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

  const [customerEdit, setCustomerEdit] = useState<Partial<CustomerEdit>>(customersEditData);

  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>(
    customerEmail
  );

  const [newCustomerName, setNewCustomerName] = useState<string | undefined>(
    customerName
  );

  const [newCustomerPhoneNumber, setNewCustomerPhoneNumber] = useState<string | undefined>(
    customerPhoneNumber
  );

  const [newCustomerPostIndex, setNewCustomerPostIndex] = useState<string | undefined>(
    customerPostIndex
  );
  const [newCustomerAddress, setNewCustomerAddress] = useState<string | undefined>(
    customerAddress
  );
  const [newCustomerAddressDetail, setNewCustomerAddressDetail] = useState<string | undefined>(
    customerAddressDetail
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

  const { emailError, nameError, phoneNumberError, postIndexError, addressError} = errors;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCustomerEdit({ ...customerEdit, [name]: value });
  };

  useEffect(() => {
    if(customerEdit != undefined){
      const {
        newCustomerEmail,
        newCustomerName,
        newCustomerPhoneNumber,
        newCustomerPostIndex,
        newCustomerAddress,
        newCustomerAddressDetail,
      } = customerEdit;

      if (newCustomerEmail != undefined) {
        setNewCustomerEmail(newCustomerEmail);
      }
      if (newCustomerName != undefined) {
        setNewCustomerName(newCustomerName);
      }
      if (newCustomerPhoneNumber != undefined) {
        setNewCustomerPhoneNumber(newCustomerPhoneNumber);
      }
      if (newCustomerPostIndex != undefined) {
        setNewCustomerPostIndex(newCustomerPostIndex);
      }
      if (newCustomerAddress != undefined) {
        setNewCustomerAddress(newCustomerAddress);
      }
      if (newCustomerAddressDetail != undefined) {
        setNewCustomerAddressDetail(newCustomerAddressDetail);
      }
    }
  })

  // 카트에 담긴 상품목록
  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const items = (
    <>
      {cart.map((cartItem: CartItem | CartItemNonMember) => {
          return (
            <div
              key={cartItem.product.id}
              className="card mb-3 mx-auto"
              style={{ maxWidth: "940px" }}
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
          <form className="form-sheet">
            <ul className="d-flex">
              <li className="col-3 text-left">장바구니 상품 목록</li>             
            </ul>
            {items}
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
              <li className="col-3 text-left">색깔/사이즈</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 name="size"
                 type="textarea" placeholder="(인쇄 색깔 수 / 사이즈 입력해주세요)"
                />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">제작 수량</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="number"
                 name="count"
                />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">납기 희망일</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="date"
                 name='hopeDate'
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
                />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">대표자:</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
                 name="newCustomerName"
                 value={newCustomerName}
                 onChange={handleInputChange}
                />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">우편번호: </li>
              <div className="col-sm-7 form-input">
                <input
                  ref={postIndexRef}
                  onClick={onClickPostIndex}
                  readOnly
                  type="text"
                  className={
                    postIndexError ? 'form-control is-invalid' : 'form-control'
                  }
                  name="newCustomerPostIndex"
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
              <li className="col-3 text-left">주소: </li>
              <div className="col-sm-7 form-input">
                  <input
                    readOnly
                    type="text"
                    className={
                      addressError ? 'form-control is-invalid' : 'form-control'
                    }
                    name="newCustomerAddress"
                    value={newCustomerAddress}
                    onChange={(event) => setNewCustomerAddress(event.target.value)}
                  />
              </div>
            </ul>
            <ul className="d-flex">
              <li className="col-3 text-left">상세 주소: </li>
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
              <li className="col-3 text-left">업태 및 종목</li>
              <div className="col-sm-7 form-input">              
                <input
                 className="form-control"
                 type="text"
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
                 onChange={handleInputChange}
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
                 onChange={handleInputChange}
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

