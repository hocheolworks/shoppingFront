import React, { FC, FormEvent, useEffect, useState } from "react";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
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
} from "../../redux/thunks/auth-thunks";
import { AppStateType } from "../../redux/reducers/root-reducer";
import { CustomerData } from "../../types/types";
import googleLogo from "../../img/google.png";
import facebookLogo from "../../img/facebook.png";
import KakaoLogin from "../../component/Kakao/KakaoLogin";
import "./Login.css";

const Login: FC<RouteComponentProps<{ code: string }>> = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const error: string = useSelector((state: AppStateType) => state.auth.error);
  const success: string = useSelector(
    (state: AppStateType) => state.auth.success
  );
  const [customerEmail, setEmail] = useState<string>("");
  const [customerPassword, setPassword] = useState<string>("");

  useEffect(() => {
    dispatch(formReset());

    if (match.params.code) {
      dispatch(activateAccount(match.params.code));
    }
  }, []);

  const onClickSignIn = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const customerData: CustomerData = { customerEmail, customerPassword };
    dispatch(login(customerData, history));
  };

  return (
    <div id="container" className="container mt-5">
      <div className="row">
        <div className="col-md-6">
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
                style={{ position: "relative", top: "8px" }}
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
              <FontAwesomeIcon
                style={{ position: "relative", top: "8px" }}
                icon={faLock}
              />
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
            <div className="form-group row">
              <button type="submit" className="btn btn-dark mx-3">
                <FontAwesomeIcon className="mr-3" icon={faSignInAlt} />
                로그인
              </button>
              <Link to={"/forgot"} style={{ position: "relative", top: "8px" }}>
                비밀번호 찾기
              </Link>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <div className="mt-5">
            <KakaoLogin></KakaoLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
