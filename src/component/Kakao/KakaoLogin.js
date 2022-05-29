import React from "react";
import { FRONT_BASE_URL } from "../../utils/constants/url";

function KakaoLogin() {
  const hostname = "https://kauth.kakao.com";
  const restApiKey = "00a0cf0c4d10db47d7c12cd0e455fae8";
  const redirectUri = `${FRONT_BASE_URL}oauth2/redirect`;
  const url = `${hostname}/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`;

  return (
    <div>
      <a id="custom-login-btn" href={url}>
        <img src="/image/logo/kakao_login_large_narrow (2).png" width="222" />
      </a>
    </div>
  );
}

export default KakaoLogin;
