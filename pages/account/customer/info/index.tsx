import React, { FC, ReactElement, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faEdit,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

import { Customer, FCinLayout } from '../../../../src/types/types';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

const PersonalData: FCinLayout = () => {
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
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
  const router = useRouter();

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
        {router.pathname === '/account/customer/info' ? (
          <Link href={'/account/customer/info/edit'}>
            <a className="btn btn-dark personal_data_btn">
              <FontAwesomeIcon className="mr-2" icon={faEdit} /> 변경
            </a>
          </Link>
        ) : (
          <Link href={'/account/customer/info'}>
            <a className="btn btn-dark personal_data_btn">
              <FontAwesomeIcon className="mr-2" icon={faEyeSlash} /> 취소
            </a>
          </Link>
        )}
      </div>
      <div className="col-md-7"></div>
    </div>
  );
};

PersonalData.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default PersonalData;
