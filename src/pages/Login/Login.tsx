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
import { UserData } from "../../types/types";
import googleLogo from "../../img/google.png";
import facebookLogo from "../../img/facebook.png";
import "./Login.css";

const Login: FC<RouteComponentProps<{ code: string }>> = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const error: string = useSelector((state: AppStateType) => state.auth.error);
  const success: string = useSelector(
    (state: AppStateType) => state.auth.success
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    dispatch(formReset());

    if (match.params.code) {
      dispatch(activateAccount(match.params.code));
    }
  }, []);

  const onClickSignIn = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const userData: UserData = { email, password };
    dispatch(login(userData, history));
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
                  value={email}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <button type="submit" className="btn btn-dark mx-3">
                <FontAwesomeIcon className="mr-3" icon={faSignInAlt} />
                회원 가입
              </button>
              <Link to={"/forgot"} style={{ position: "relative", top: "8px" }}>
                비밀번호 찾기
              </Link>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <div className="mt-5">
            <a
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
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
