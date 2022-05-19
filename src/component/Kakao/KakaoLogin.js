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
        <img
          src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
          width="222"
        />
      </a>
    </div>
  );
}

export default KakaoLogin;
