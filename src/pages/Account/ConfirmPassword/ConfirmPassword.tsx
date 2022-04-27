import React, { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faLock, faSign, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthErrors, CustomerPasswordConfirmData } from "../../../types/types";
import { AppStateType } from "../../../redux/reducers/root-reducer";
import {
  ConfirmCustomerPassword,
  resetForm,
  updateCustomerPassword,
} from "../../../redux/thunks/customer-thunks";
import { Customer } from "../../../types/types";
import { Route, useHistory } from "react-router-dom";
import ChangePassword from "../ChangePassword/ChangePassword";
import "./ConfirmPassword.css";

const ConfrimPassword: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const errors: Partial<AuthErrors> = useSelector(
    (state: AppStateType) => state.customer.customerResetPasswordErrors
  );
  const { passwordError } = errors;

  const success: string = useSelector(
    (state: AppStateType) => state.customer.successMessage
  );
  

  // 고객 정보 불러오는 부분
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
  const [password, setPassword] = useState<string>("");
  

  useEffect(() => {
    dispatch(resetForm());
  }, []);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: CustomerPasswordConfirmData = { customerEmail: customer.customerEmail, customerPassword: password };
    dispatch(ConfirmCustomerPassword(data, history));
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <form onSubmit={onFormSubmit}>
          <h4>
            <FontAwesomeIcon className="mr-2" icon={faLock} /> 비밀번호 확인
          </h4>
          <div className="form-group row">
            <label className="password-item">
              기존 비밀번호 입력:{" "}
            </label>
            <div className="password-text">
              <input
                type="password"
                name="password"
                className={
                  passwordError ? "form-control is-invalid" : "form-control"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div className="invalid-feedback">{passwordError}</div>
            </div>
          </div>
          <button type="submit" className="btn btn-dark">
            <FontAwesomeIcon className="mr-3" icon={faSign} />
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfrimPassword;
