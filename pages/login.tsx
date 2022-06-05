import React, { FC, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";

import {
  activateAccount,
  formReset,
  login,
} from "../src/redux/thunks/auth-thunks";
import { AppStateType } from "../src/redux/reducers/root-reducer";
import { CustomerData } from "../src/types/types";
import googleLogo from "../src/img/google.png";
import facebookLogo from "../src/img/facebook.png";
import KakaoLogin from "../src/component/Kakao/KakaoLogin";

const Login: FC = () => {
  const dispatch = useDispatch();
  const router: NextRouter = useRouter();
  const { code } = router.query;
  const error: string = useSelector((state: AppStateType) => state.auth.error);
  const success: string = useSelector(
    (state: AppStateType) => state.auth.success
  );
  const [customerEmail, setEmail] = useState<string>("");
  const [customerPassword, setPassword] = useState<string>("");

  useEffect(() => {
    dispatch(formReset());

    if (code) {
      dispatch(activateAccount(code as string));
    }
  }, []);

  const onClickSignIn = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const customerData: CustomerData = { customerEmail, customerPassword };
    dispatch(login(customerData, router));
  };

  return (
    <div id="container" className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-6 login-container">
          <h4>
            <FontAwesomeIcon className="mr-3" icon={faSignInAlt} />
            로그인
          </h4>
          <hr />
          {error ? (
            <div className="alert alert-danger col-6" role="alert">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="alert alert-success col-6" role="alert">
              {success}
            </div>
          ) : null}
          <form onSubmit={onClickSignIn}>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">이메일: </label>
              <FontAwesomeIcon
                style={{ position: "relative" }}
                icon={faEnvelope}
              />
              <div className="col-sm-7">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={customerEmail}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">비밀번호: </label>
              <FontAwesomeIcon style={{ position: "relative" }} icon={faLock} />
              <div className="col-sm-7">
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={customerPassword}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <button type="submit" className="btn btn-dark mx-3">
                <FontAwesomeIcon className="mr-3" icon={faSignInAlt} />
                로그인
              </button>
              {/* <Link href={'/forgot'}>
                <a style={{ position: 'relative'}}>
                  비밀번호 찾기
                </a>
              </Link> */}
            </div>
          </form>
          <div className="mb-5">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mt-5">
            {/* <a
              className="btn btn-block social-btn google"
              href="http://localhost:8080/oauth2/authorize/google"
            >
              <img src={googleLogo} alt="google" />
              구글 계정으로 로그인
            </a>
            <a
              className="btn btn-block social-btn facebook"
              href="http://localhost:8080/oauth2/authorize/facebook"
            >
              <img src={facebookLogo} alt="facebook" />
              페이스북 계정으로 로그인
            </a> */}
            <KakaoLogin></KakaoLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
