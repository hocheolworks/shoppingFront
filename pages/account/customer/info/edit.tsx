import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import {
  Customer,
  CustomerEdit,
  CustomerEditErrors,
  FCinLayout,
  PostCodeObject,
} from '../../../../src/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import {
  resetForm,
  updateCustomerInfo,
} from '../../../../src/redux/thunks/customer-thunks';
import DaumPostcode from 'react-daum-postcode';
import { NextRouter, useRouter } from 'next/router';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

const EditPersonalData: FCinLayout = () => {
  const dispatch = useDispatch();
  const router: NextRouter = useRouter();
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );
  const errors: Partial<CustomerEditErrors> = useSelector(
    (state: AppStateType) => state.customer.customerEditErrors
  );

  const [customer, setCustomer] = useState<Partial<Customer>>(customersData);

  // ======= 주소 찾기 =====
  const [customerPostIndex, setCustomerPostIndex] = useState<
    string | undefined
  >(customersData.customerPostIndex);
  const [customerAddress, setCustomerAddress] = useState<string | undefined>(
    customersData.customerAddress
  );
  const [customerAddressDetail, setCustomerAddressDetail] = useState<
    string | undefined
  >(customersData.customerAddressDetail);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const onCompletePostIndex = (data: PostCodeObject): void => {
    setCustomerAddress(
      data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
    );
    setCustomerPostIndex(data.zonecode);
    setIsPopupOpen(false);
  };

  const onClickPostIndex = (): void => {
    setIsPopupOpen((prevState) => !prevState);
  };

  const postIndexRef = useRef(null);
  // ===== 주소 찾기 끝 ===

  const {
    id,
    customerEmail,
    customerName,
    // customerPassword,
    customerPhoneNumber,
    // customerRole,
  } = customer;

  const {
    emailError,
    nameError,
    phoneNumberError,
    postIndexError,
    addressError,
  } = errors;

  useEffect(() => {
    dispatch(resetForm());
  }, []);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const customerEdit: Partial<CustomerEdit> = {
      id,
      newCustomerEmail: customerEmail,
      newCustomerName: customerName,
      newCustomerPhoneNumber: customerPhoneNumber,
      newCustomerPostIndex: customerPostIndex,
      newCustomerAddress: customerAddress,
      newCustomerAddressDetail: customerAddressDetail,
    };
    dispatch(updateCustomerInfo(customerEdit, router));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <>
      <form className="edit_personal_data" onSubmit={onFormSubmit}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">이메일: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={
                emailError ? 'form-control is-invalid' : 'form-control'
              }
              name="customerEmail"
              value={customerEmail}
              onChange={handleInputChange}
              readOnly
            />
            <div className="invalid-feedback">{emailError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">이름: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={nameError ? 'form-control is-invalid' : 'form-control'}
              name="customerName"
              value={customerName}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{nameError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">휴대폰 번호: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={'form-control'}
              name="customerPhoneNumber"
              value={customerPhoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">우편번호: </label>
          <div className="col-sm-6">
            <input
              ref={postIndexRef}
              onClick={onClickPostIndex}
              readOnly
              type="text"
              className={
                postIndexError ? 'form-control is-invalid' : 'form-control'
              }
              name="customerPostIndex"
              value={customerPostIndex}
              placeholder="우편번호"
              onChange={(event) => setCustomerPostIndex(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">주소: </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={
                addressError ? 'form-control is-invalid' : 'form-control'
              }
              name="address"
              value={customerAddress}
              onChange={(event) => setCustomerAddress(event.target.value)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">상세 주소: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={
                addressError ? 'form-control is-invalid' : 'form-control'
              }
              name="address"
              value={customerAddressDetail}
              onChange={(event) => setCustomerAddressDetail(event.target.value)}
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
                  border: '1px solid black',
                  padding: 0,
                }}
                onComplete={onCompletePostIndex}
              />
            </div>
          </div>
        )}
        <button type="submit" className="btn btn-dark">
          <FontAwesomeIcon className="mr-2" icon={faCheck} />
          저장
        </button>
      </form>
    </>
  );
};

EditPersonalData.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default EditPersonalData;
