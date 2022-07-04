import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export function useCheckAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const isMount = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isMount.current) {
      const customerRole = sessionStorage.getItem("customerRole");
      let alertMessage = ""; // default message

      if (customerRole === null) {
        alertMessage = "로그인이 필요합니다.";
      } else {
        if (customerRole === "USER") {
          alertMessage = "관리자 권한이 필요합니다.";
        }
      }

      if (alertMessage !== "") {
        MySwal.fire({
          title: `<strong>잘못된 접근</strong>`,
          html: `<i>${alertMessage}<br/>홈으로 돌아갑니다.</i>`,
          icon: "error",
        }).then(() => router.push("/"));
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      isMount.current = true;
    }
  });

  return isAdmin;
}
