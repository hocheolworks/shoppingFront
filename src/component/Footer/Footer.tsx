import Link from "next/link";
import React, { FC } from "react";

// import "./Footer.css";

const Footer: FC = () => {
  return (
    <footer className="page-footer p-5 bg-black text-white">
      <div className="container">
        <div className="justify-content-between">
          <div className="footer-container">
            <div className="footer-item">
              <h4 className="mb-3">진솔유통 - 마트가방</h4>
              <p>사업자번호 206-34-61779 | 통신판매신고 제2022-서울용산-0837호 | 대표 : 김진솔</p>
              <p>본사 : 서울시 용산구 신흥로 3길 22-1 | 영종도 공장 : 인천시 중구 운북동 168-29</p>
              <p>전화 : 010-2269-9422 또는 010-4826-0519 | 상담 가능 시간 : 24시간 전화 상담 가능</p>
            </div>
            <div>
              <h6>진솔유통 기본약관</h6>
              <Link href={'/policy/privacy'}><a className="mr-5">개인정보 처리방침</a></Link>
              <Link href={'/policy/service_paid'}><a className="mr-5">전자금융거래 기본약관</a></Link>
              <p className="copyright">Copyright (C) 2022 jinsoltrade all rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
