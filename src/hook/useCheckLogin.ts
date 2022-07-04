import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export function useCheckLogin(): boolean {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const isMount = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isMount.current) {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      let alertMessage = ""; // default message

      if (isLoggedIn === null) {
        alertMessage = "로그인이 필요합니다.";
      } else {
        if (isLoggedIn !== "true") {
          alertMessage = "로그인이 필요합니다.";
        }
      }

      if (alertMessage !== "") {
        MySwal.fire({
          title: `<strong>잘못된 접근</strong>`,
          html: `<i>${alertMessage}<br/>홈으로 돌아갑니다.</i>`,
          icon: "error",
        }).then(() => router.push("/"));
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }

      isMount.current = true;
    }
  });

  return isLogin;
}
