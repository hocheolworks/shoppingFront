import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../component/PageLoader/PageLoader";
import { AppStateType } from "../../redux/reducers/root-reducer";
import requestService from "../request-service";
import { API_BASE_URL } from "../constants/url";
import { useHistory } from "react-router-dom";

const OAuth2RedirectHandler = (props: any) => {
  const history = useHistory();
  let loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  let code = new URL(window.location.href).searchParams.get("code");
  console.log(code);

  let pageLoading;
  loading = true;
  if (loading) {
    pageLoading = <PageLoader />;
  }

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/customer/kakao/login?code = ${code}`)
      .then((res) => {
        console.log(res); // 토큰이 넘어올 것임
        const ACCESS_TOKEN = res.data.accessToken;

        localStorage.setItem("token", ACCESS_TOKEN); //예시로 로컬에 저장함
        history.push("/account");
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {" "}
      <span>로그인 프로세스가 실행중입니다.</span>
      {pageLoading}{" "}
    </div>
  );
};

export default OAuth2RedirectHandler;
