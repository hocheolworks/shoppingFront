import React, { FC, FormEvent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faLock, faSign, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  AuthErrors,
  CustomerPasswordConfirmData,
  FCinLayout,
} from "../../../../src/types/types";
import { AppStateType } from "../../../../src/redux/reducers/root-reducer";
import {
  ConfirmCustomerPassword,
  resetForm,
  updateCustomerPassword,
} from "../../../../src/redux/thunks/customer-thunks";
import { Customer } from "../../../../src/types/types";
import { useRouter } from "next/router";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import { useCheckLogin } from "../../../../src/hook/useCheckLogin";
import Spinner from "../../../../src/component/Spinner/Spinner";

const ConfrimPassword: FCinLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useCheckLogin();

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
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    dispatch(resetForm());
  }, []);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data: CustomerPasswordConfirmData = {
      customerEmail: customer.customerEmail,
      customerPassword: password,
    };
    dispatch(ConfirmCustomerPassword(data, router));
  };

  return isLoggedIn ? (
    <div className="row">
      <div className="col-md-5">
        <form onSubmit={onFormSubmit}>
          <h4>
            <FontAwesomeIcon className="mr-2" icon={faLock} /> 비밀번호 확인
          </h4>
          <div className="d-flex mb-2 ml-2 row">
            <label className="password-item">기존 비밀번호 입력: </label>
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
          <button type="submit" className="btn btn-dark ml-3 mb-3">
            <FontAwesomeIcon className="mr-3" icon={faSign} />
            확인
          </button>
        </form>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

ConfrimPassword.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ConfrimPassword;
