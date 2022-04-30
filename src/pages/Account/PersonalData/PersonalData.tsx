import React, { FC, useState } from "react";
import { Link, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faEdit,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { Customer } from "../../../types/types";
import { AppStateType } from "../../../redux/reducers/root-reducer";
import EditPersonalData from "../EditPersonalData/EditPersonalData";
import "./PersonalData.css";

const PersonalData: FC = () => {
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const [customer, setCustomer] = useState<Partial<Customer>>(customersData);

  if(Object.keys(customer).length === 0){
    const customersInfo = sessionStorage.getItem('customerInfo');
    if (customersInfo != null){
      setCustomer(JSON.parse(String(customersInfo)));
    }
  }

  const {
    id,
    customerEmail,
    customerName,
    customerPhoneNumber,
    customerPostIndex,
    customerAddress,
    customerAddressDetail,
    customerRole,
  } = customer;


  const location = useLocation();

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
          <span className="personal_data_text">{customerAddress} {customerAddressDetail}</span>
        </p>
        {location.pathname === "/account/customer/info" ? (
          <Link
            to={"/account/customer/info/edit"}
            className="btn btn-dark personal_data_btn"
          >
            <FontAwesomeIcon className="mr-2" icon={faEdit} /> 변경
          </Link>
        ) : (
          <Link
            to={"/account/customer/info"}
            className="btn btn-dark personal_data_btn"
          >
            <FontAwesomeIcon className="mr-2" icon={faEyeSlash} /> 취소
          </Link>
        )}
      </div>
      <div className="col-md-7">
        <Route
          path="/account/customer/info/edit"
          component={() => <EditPersonalData />}
        />
      </div>
    </div>
  );
};

export default PersonalData;
