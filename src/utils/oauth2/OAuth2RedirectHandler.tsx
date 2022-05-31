import axios from "axios";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../component/PageLoader/PageLoader";
import { AppStateType } from "../../redux/reducers/root-reducer";
import requestService from "../request-service";
import { API_BASE_URL } from "../constants/url";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { login } from "../../redux/thunks/auth-thunks";
import { loginSuccess } from "../../redux/actions/auth-actions";
import { fetchCustomerSuccess } from "../../redux/actions/customer-actions";
import { NextPage } from "next";

const OAuth2RedirectHandler: NextPage = (props: any) => {
  const dispatch = useDispatch();
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
        if (res.data === false) {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: `<strong>로그인 실패</strong>`,
            html: `<i>가입된 회원이 아닙니다. 회원 가입 페이지로 이동합니다.</i>`,
            icon: "error",
          });
          console.log(res);
          history.push("/registration");
        } else {
          console.log(res); // 토큰이 넘어올 것임
          const ACCESS_TOKEN = res.data.token;

          sessionStorage.setItem("token", ACCESS_TOKEN); //예시로 로컬에 저장함
          sessionStorage.setItem("customerEmail", res.data.customerEmail);
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("customerRole", res.data.customerRole);
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("id", res.data.id);
          dispatch(loginSuccess(res.data.customerRole));
          dispatch(fetchCustomerSuccess(res.data));
          history.push("/account");
        }
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
