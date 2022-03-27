import React, { FC, FormEvent, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { formReset, registration } from "../../redux/thunks/auth-thunks";
import PageLoader from "../../component/PageLoader/PageLoader";
import { AppStateType } from "../../redux/reducers/root-reducer";
import { AuthErrors, UserRegistration } from "../../types/types";

const Registration: FC = () => {
  const dispatch = useDispatch();
  const isRegistered: boolean = useSelector(
    (state: AppStateType) => state.auth.isRegistered
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.auth.loading
  );
  const errors: Partial<AuthErrors> = useSelector(
    (state: AppStateType) => state.auth.errors
  );
  const {
    emailError,
    nameError,
    passwordError,
    password2Error,
    phoneNumberError,
  } = errors;
  const [customerEmail, setEmail] = useState<string>("");
  const [customerName, setName] = useState<string>("");
  const [customerPhoneNumber, setPhoneNumber] = useState<string>("");
  const [customerPassword, setPassword] = useState<string>("");
  const [customerPassword2, setPassword2] = useState<string>("");
  const [captchaValue, setCaptchaValue] = useState<string | null>("");

  useEffect(() => {
    dispatch(formReset());
  }, []);

  useEffect(() => {
    setEmail("");
    setName("");
    setPhoneNumber("");
    setPassword("");
    setPassword2("");
    setCaptchaValue("");
  }, [isRegistered]);

  const onClickSignUp = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const userRegistrationData: UserRegistration = {
      customerEmail,
      customerName,
      customerPhoneNumber,
      customerPassword,
      customerPassword2,
      captcha: captchaValue,
    };
    dispatch(registration(userRegistrationData));
    // @ts-ignore
    window.grecaptcha.reset();
  };

  const onChangeRecaptcha = (token: string | null): void => {
    setCaptchaValue(token);
  };

  let pageLoading;
  if (loading) {
    pageLoading = <PageLoader />;
  }

  return (
    <div className="container mt-5">
      {pageLoading}
      <h4>
        <FontAwesomeIcon className="mr-2" icon={faUserPlus} /> 회원가입
      </h4>
      <hr />
      {isRegistered ? (
        <div className="alert alert-success col-6" role="alert">
          인증 코드가 이메일로 전송되었습니다.
        </div>
      ) : null}
      <form onSubmit={onClickSignUp}>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">이메일: </label>
          <FontAwesomeIcon
            style={{ position: "relative", top: "8px" }}
            icon={faEnvelope}
          />
          <div className="col-sm-4">
            <input
              type="email"
              name="email"
              value={customerEmail}
              className={
                emailError ? "form-control is-invalid" : "form-control"
              }
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="invalid-feedback">{emailError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">이름: </label>
          <FontAwesomeIcon
            style={{ position: "relative", top: "8px" }}
            icon={faUser}
          />
          <div className="col-sm-4">
            <input
              type="text"
              name="name"
              value={customerName}
              className={nameError ? "form-control is-invalid" : "form-control"}
              onChange={(event) => setName(event.target.value)}
            />
            <div className="invalid-feedback">{nameError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">휴대폰번호: </label>
          <FontAwesomeIcon
            style={{ position: "relative", top: "8px" }}
            icon={faPhone}
          />
          <div className="col-sm-4">
            <input
              type="text"
              name="phoneNumber"
              value={customerPhoneNumber}
              className={
                phoneNumberError ? "form-control is-invalid" : "form-control"
              }
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <div className="invalid-feedback">{phoneNumberError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">비밀번호: </label>
          <FontAwesomeIcon
            style={{ position: "relative", top: "8px" }}
            icon={faLock}
          />
          <div className="col-sm-4">
            <input
              type="password"
              name="password"
              value={customerPassword}
              className={
                passwordError ? "form-control is-invalid" : "form-control"
              }
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="invalid-feedback">{passwordError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">비밀번호 확인: </label>
          <FontAwesomeIcon
            style={{ position: "relative", top: "8px" }}
            icon={faLock}
          />
          <div className="col-sm-4">
            <input
              type="password"
              name="password2"
              value={customerPassword2}
              className={
                password2Error ? "form-control is-invalid" : "form-control"
              }
              onChange={(event) => setPassword2(event.target.value)}
            />
            <div className="invalid-feedback">{password2Error}</div>
          </div>
        </div>
        <div className="form-group row">
          <button type="submit" className="btn btn-dark mx-3">
            <FontAwesomeIcon className="mr-2" icon={faUserPlus} />
            회원가입
          </button>
        </div>
        <ReCAPTCHA
          onChange={onChangeRecaptcha}
          sitekey="6Lc5cLkZAAAAAN8mFk85HQieB9toPcWFoW0RXCNR"
        />
      </form>
    </div>
  );
};

export default Registration;
