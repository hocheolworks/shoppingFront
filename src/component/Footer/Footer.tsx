import Link from "next/link";
import { Router } from "next/router";
import React, { FC, useEffect } from "react";

// import "./Footer.css";

const Footer: FC = () => {
  return (
    <>
      <div id="blank" className="d-flex"></div>
      <footer className="page-footer p-5 bg-black text-white" id="footer">
        <div className="container">
          <div className="justify-content-between">
            <div className="footer-container">
              <div className="footer-item">
                <h4 className="mb-3">진솔유통 – 전국 마트 유통 및 행사 전문</h4>
                <p className="mb-0">
                  <small>
                    사업자번호 206-34-61779 | 통신판매신고
                    제2022-서울용산-0837호 | 대표 : 김진솔
                  </small>
                </p>
                <p className="mb-0">
                  <small>
                    본사 : 서울시 용산구 신흥로 3길 22-1 | 영종도 공장 : 인천시
                    중구 운북동 168-29
                  </small>
                </p>
                <p className="mb-0">
                  <small>
                    전화 : 010-2269-9422 또는 010-4826-0519 | 상담 가능 시간 :
                    24시간 전화 상담 가능
                  </small>
                </p>
              </div>
              <div>
                {/* <h6>진솔유통 기본약관</h6> */}
                <Link href={"/policy/privacy"}>
                  <a className="mr-5">
                    <small>개인정보 처리방침</small>
                  </a>
                </Link>
                <Link href={"/policy/service_paid"}>
                  <a className="mr-5">
                    <small>전자금융거래 기본약관</small>
                  </a>
                </Link>
                <p className="copyright text-right">
                  Copyright (C) 2022 jinsoltrade all rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
