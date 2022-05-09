import React, { ChangeEvent, FC, FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faCheck,
  faEdit,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

import { Customer, CustomerEdit, CustomerEditErrors, FCinLayout, PostCodeObject } from '../../../../src/types/types';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';
import { resetForm, updateCustomerInfo } from '../../../../src/redux/thunks/customer-thunks';
import DaumPostcode from 'react-daum-postcode';

const PersonalData: FCinLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const customersEditData: Partial<CustomerEdit> = useSelector(
    (state: AppStateType) => state.customer.customerEdit
  );

  const errors: Partial<CustomerEditErrors> = useSelector(
    (state: AppStateType) => state.customer.customerEditErrors
  );

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onEdit = () => setIsEdit(true);
  const offEdit = () => setIsEdit(false);

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

  // ======= Edit 부분 =====
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

  useEffect(() => {
    dispatch(resetForm());
  }, []);

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

  useEffect(() => {
    setIsEdit(false);
  }, [customersData])

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const customerEdit: Partial<CustomerEdit> = {
      id,
      newCustomerEmail,
      newCustomerName,
      // customerPassword,
      newCustomerPhoneNumber,
      newCustomerPostIndex,
      newCustomerAddress,
      newCustomerAddressDetail,
      // customerRole,
    };
    dispatch(updateCustomerInfo(customerEdit, router));

  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCustomerEdit({ ...customerEdit, [name]: value });
  };

  return (
    <div className="row">
      <div className="personal_data col-md-5">
        <h4 className="personal_data_title">
          <FontAwesomeIcon className="ml-2 mr-2" icon={faAddressCard} />
          개인 정보
        </h4>
        <p className="personal_data_item">
          이메일:
          <span className="personal_data_text">{customerEmail}</span>
        </p>
        <p className="personal_data_item">
          이름:
          <span className="personal_data_text">{customerName}</span>
        </p>
        <p className="personal_data_item">
          휴대폰 번호:
          <span className="personal_data_text">{customerPhoneNumber}</span>
        </p>
        <p className="personal_data_item">
          우편번호:
          <span className="personal_data_text">{customerPostIndex}</span>
        </p>
        <p className="personal_data_item">
          주소:
          <span className="personal_data_text">
            {customerAddress} {customerAddressDetail}
          </span>
        </p>
        {(!isEdit) && (
          <button
          className="btn btn-dark personal_data_btn"
          onClick={onEdit}
          >
            <FontAwesomeIcon className="mr-2" icon={faEdit} /> 변경
          </button>
        )}
        {(isEdit) && (
          <button
          className="btn btn-dark personal_data_btn"
          onClick={offEdit}
          >
            <FontAwesomeIcon className="mr-2" icon={faEdit} /> 취소
          </button>
        )}
      </div>
      {(isEdit) && (
      <div className="col-md-7">
        <form className="edit_personal_data" onSubmit={onFormSubmit}>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">이메일: </label>
            <div className="col-sm-6">
              <input
                type="text"
                className={
                  emailError ? "form-control is-invalid" : "form-control"
                }
                name="newCustomerEmail"
                value={newCustomerEmail}
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

                name="newCustomerName"
                value={newCustomerName}
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
                className={"form-control"}
                name="newCustomerPhoneNumber"
                value={newCustomerPhoneNumber}
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
                name="newCustomerPostIndex"
                value={newCustomerPostIndex}
                placeholder="우편번호"
                onChange={(event) => setNewCustomerPostIndex(event.target.value)}
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
                    name="newCustomerAddress"
                    value={newCustomerAddress}
                    onChange={(event) => setNewCustomerAddress(event.target.value)}
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
                    name="newCustomerAddressDetail"
                    value={newCustomerAddressDetail}
                    onChange={(event) =>
                      setNewCustomerAddressDetail(event.target.value)
                    }
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
      </div>
      )}
    </div>
  );
};

PersonalData.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default PersonalData;
