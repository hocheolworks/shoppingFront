import React, { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faLock, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthErrors, Customer, CustomerResetPasswordData } from "../../../types/types";
import { AppStateType } from "../../../redux/reducers/root-reducer";
import {
  resetForm,
  updateCustomerPassword,
} from "../../../redux/thunks/customer-thunks";
import "./ChangePassword.css";

const ChangePassword: FC = () => {
  
  const dispatch = useDispatch();
  const errors: Partial<AuthErrors> = useSelector(
    (state: AppStateType) => state.customer.customerResetPasswordErrors
  );
  const success: string = useSelector(
    (state: AppStateType) => state.customer.successMessage
  );


  // 고객 정보 불러오는 부분
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );
  const [customer, setCustomer] = useState<Partial<Customer>>(customersData);
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const { passwordError, password2Error } = errors;

  useEffect(() => {
    dispatch(resetForm());
  }, []);

  useEffect(() => {
    setPassword("");
    setPassword2("");
  }, [success]);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: CustomerResetPasswordData = { email: customer.customerEmail, password, password2 };
    dispatch(updateCustomerPassword(data));
  };

  return (
    <div className="">
      <h4>
        <FontAwesomeIcon className="mr-2" icon={faLock} /> 비밀번호 변경
      </h4>
      {success ? (
        <div className="alert alert-success col-6" role="alert">
          {success}
        </div>
      ) : null}
      <form className="mt-5" onSubmit={onFormSubmit}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">
            새로운 비밀번호 입력:{" "}
          </label>
          <div className="col-sm-4">
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
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">비밀번호 확인: </label>
          <div className="col-sm-4">
            <input
              type="password"
              name="password2"
              className={
                password2Error ? "form-control is-invalid" : "form-control"
              }
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
            />
            <div className="invalid-feedback">{password2Error}</div>
          </div>
        </div>
        <button type="submit" className="btn btn-dark">
          <FontAwesomeIcon className="mr-3" icon={faUndo} />
          변경
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
