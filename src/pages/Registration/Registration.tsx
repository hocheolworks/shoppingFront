import React, { FC, FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
  faPhone,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
  formReset,
  registration,
  emailValidation,
} from "../../redux/thunks/auth-thunks";
import PageLoader from "../../component/PageLoader/PageLoader";
import { AppStateType } from "../../redux/reducers/root-reducer";
import { AuthErrors, CustomerRegistration } from "../../types/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { fetchCustomerSuccess } from "../../redux/actions/customer-actions";

const MySwal = withReactContent(Swal);

const Registration: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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
  const [userInputVerifyNumber, setUserInputVerifyNumber] =
    useState<string>("");

  useEffect(() => {
    dispatch(formReset());
  }, []);

  function randNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const onClickVerifyEmail = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    localStorage.setItem("verifyNumber", randNumber(1000, 10000).toString());
    const verifyNumber = localStorage.getItem("verifyNumber");
    const userRegistrationData: CustomerRegistration = {
      customerEmail,
      customerName,
      customerPhoneNumber,
      customerPassword,
      customerPassword2,
      captcha: captchaValue,
      verifyNumber,
    };
    dispatch(emailValidation(userRegistrationData));
    // @ts-ignore
  };

  const onClickFinishRegistration = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const verifyNumber = localStorage.getItem("verifyNumber");
    if (verifyNumber === userInputVerifyNumber) {
      await MySwal.fire({
        title: `<strong>인증번호 일치</strong>`,
        html: `<i>회원가입이 완료되었습니다!</i>`,
        icon: "success",
      });
      history.push("/login");
      const userRegistrationData: CustomerRegistration = {
        customerEmail,
        customerName,
        customerPhoneNumber,
        customerPassword,
        customerPassword2,
        captcha: captchaValue,
        verifyNumber,
      };

      dispatch(registration(userRegistrationData));
    } else {
      await MySwal.fire({
        title: `<strong>인증번호 불일치</strong>`,
        html: `<i>인증번호를 다시 입력해주세요!</i>`,
        icon: "error",
      });
    }
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
        <div>
          <div className="alert alert-success col-6" role="alert">
            인증 코드가 이메일로 전송되었습니다. 이메일을 확인해주세요
          </div>
          <form onSubmit={onClickFinishRegistration}>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">인증번호: </label>
              <FontAwesomeIcon
                style={{ position: "relative", top: "8px" }}
                icon={faEnvelope}
              />
              <div className="col-sm-4">
                <input
                  type="userInputVerifyNumber"
                  name="userInputVerifyNumber"
                  value={userInputVerifyNumber}
                  className={
                    emailError ? "form-control is-invalid" : "form-control"
                  }
                  onChange={(event) =>
                    setUserInputVerifyNumber(event.target.value)
                  }
                />
                <div className="invalid-feedback">{emailError}</div>
              </div>
            </div>
            <div className="form-group row">
              <button type="submit" className="btn btn-dark mx-3">
                <FontAwesomeIcon className="mr-2" icon={faUserPlus} />
                회원가입 완료
              </button>
            </div>
          </form>
        </div>
      ) : (
        <form onSubmit={onClickVerifyEmail}>
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
                className={
                  nameError ? "form-control is-invalid" : "form-control"
                }
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
              <FontAwesomeIcon className="mr-2" icon={faCheck} />
              이메일 인증
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Registration;
