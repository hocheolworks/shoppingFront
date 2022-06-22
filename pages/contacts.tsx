import React, { FC } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";

const Contacts: FC = () => {
  return (
    <>
      <Head>
        <title>진솔유통 - 타포린 마트 가방 전문 | 주문 제작</title>
        <meta
          name="keyword"
          content="타포린, 마트 가방, 사은품, 인쇄 가능, 타포린 가방, 최저가"
        ></meta>{" "}
        <meta
          name="description"
          content={`타포린 마트 가방 전문, 인쇄 가능 마트 사은품, 소량 및 대량 주문제작, 대량 구매시 전국 최저가 보장`}
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={"진솔유통 - 기업 소개"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://jinsoltrade.com/contacts`} />
        <meta property="og:description" content={`기업 소개 페이지`}></meta>
        <meta
          property="og:image"
          content="https://iljo-product.s3.ap-northeast-2.amazonaws.com/A_inside.jpg"
        />
        <meta property="og:article:author" content="진솔유통" />
      </Head>

      <div id="mid">
        <div className="container mt-5">
          <h4>
            <FontAwesomeIcon className="ml-2 mr-2" icon={faInfoCircle} />
            진솔유통 소개
          </h4>
          <br />
          <p>
            마트 가방을 전문으로 하는 진솔유통은 공장 및 국내 인쇄소를{" "}
            <span style={{ fontWeight: "bold" }}>직접 </span>
            운영합니다.
          </p>
        </div>
        <div className="container mt-5">
          <img
            className="img-fluid  img-thumbnail"
            width="33%"
            src="https://iljo-product.s3.ap-northeast-2.amazonaws.com/A_inside.jpg"
            alt="Responsive image"
          ></img>
          <img
            className="img-fluid  img-thumbnail"
            width="33%"
            src="https://iljo-product.s3.ap-northeast-2.amazonaws.com/A_outside.jpg"
            alt="Responsive image"
          ></img>
          <img
            className="img-fluid  img-thumbnail"
            width="33%"
            src="https://iljo-product.s3.ap-northeast-2.amazonaws.com/A_working.jpg"
            alt="Responsive image"
          ></img>
        </div>
        <div className="container mt-5">
          <p className="mb-5">
            다년간의 공장 및 유통 경험을 가진 진솔유통은 최고의 선택입니다.
            <br></br> <br></br>
            <li className="mb-1">
              가격 경쟁력 : 단순 유통을 넘어 제조까지, 진솔유통이 대량 구매 시{" "}
              <span style={{ fontWeight: "bold", color: "red" }}>
                전국 최저가
              </span>
              를 약속드릴 수 있는 이유입니다.
            </li>
            <li className="mb-1">
              문구 및 이미지 인쇄 : 고객님만의 특성이 담긴 문구와 이미지를
              상품에 인쇄해 드립니다.
            </li>
            <li className="mb-1">세금계산서 발행 가능 업체</li>
          </p>
        </div>
        <div className="container mt-5">
          <p>
            <b>연락처: </b>{" "}
            <span className="mb-1">010-4826-0519, 010-2269-9422</span>
            <br></br>
            <b>이메일: </b> <span className="mb-1">jinsoltrade@gmail.com</span>
            <br></br>
            <b>주소:</b>{" "}
            <span className="mb-1">서울시 용산구 신흥로 3길 22-1</span>
            <br />
            <b>공장 주소:</b>{" "}
            <span className="mb-1">인천시 중구 운북동 168-29</span>
            <br />
            <br />
            <br />
          </p>
          <h6 style={{ fontWeight: "bold" }}>상담 가능 시간 : </h6>
          (연중무휴) 24시간 상담 가능
          <br />
          <span className="mb-3">
            제휴, 상품 스펙, 배송 등 언제든지 문의주세요!
          </span>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

export default Contacts;
