import React, { FC } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Contacts: FC = () => {
  return (
    <div className="container mt-5">
      <h4>
        <FontAwesomeIcon className="ml-2 mr-2" icon={faInfoCircle} />
        고객지원
      </h4>
      <br />
      <p>
        <b>Mobile:</b> 010-2269-9422
        <br />
        <b>E-mail:</b> iljotradingcompany@gmail.com
      </p>
      <br />
      <h6 style={{ fontWeight: "bold" }}>상담 가능 시간 : </h6>
      <p>
        (평일) 9:00 - 18:00
        <br />
        영업 제휴, 상품 각인, 배송 등 문의사항을 언제든지 문의주세요!
      </p>
      <br />
    </div>
  );
};

export default Contacts;
